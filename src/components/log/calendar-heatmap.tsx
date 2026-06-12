"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailyLog } from "@/types"
import { HeatmapGrid } from "@/components/log/heatmap-grid"

interface Props {
  logs: DailyLog[]
}

interface Cell {
  date: Date
  key: string
  log?: DailyLog
  isFuture: boolean
}

interface TooltipState {
  cell: Cell
  x: number
  y: number
}

interface Stats {
  loggedDays: number
  logRate: number
  avgDeficit: number
  deficitDays: number
  currentStreak: number
  bestStreak: number
}

function getCellClass(cell: Cell): string {
  if (cell.isFuture) return "bg-muted/40 cursor-default"
  if (!cell.log) return "bg-muted hover:bg-muted/70 cursor-default"
  const d = cell.log.netDeficit
  if (d >= 700)  return "bg-green-800 hover:bg-green-900"
  if (d >= 400)  return "bg-green-600 hover:bg-green-700"
  if (d >= 100)  return "bg-green-400 hover:bg-green-500"
  if (d > 0)     return "bg-green-200 hover:bg-green-300"
  if (d === 0)   return "bg-yellow-400 hover:bg-yellow-500"
  if (d >= -200) return "bg-red-300 hover:bg-red-400"
  return "bg-red-500 hover:bg-red-600"
}

function computeStats(cells: Cell[]): Stats {
  const past = cells.filter((c) => !c.isFuture)
  const logged = past.filter((c) => !!c.log)
  const deficitDays = logged.filter((c) => (c.log?.netDeficit ?? 0) > 0).length
  const totalDeficit = logged.reduce((s, c) => s + (c.log?.netDeficit ?? 0), 0)
  const avgDeficit = logged.length ? Math.round(totalDeficit / logged.length) : 0
  const logRate = past.length ? Math.round((logged.length / past.length) * 100) : 0

  const sorted = [...past].sort((a, b) => a.date.getTime() - b.date.getTime())
  let best = 0, tmp = 0
  for (const c of sorted) {
    if (c.log && c.log.netDeficit > 0) { tmp++; best = Math.max(best, tmp) }
    else tmp = 0
  }
  let current = 0
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].log && (sorted[i].log?.netDeficit ?? 0) > 0) current++
    else break
  }

  return { loggedDays: logged.length, logRate, avgDeficit, deficitDays, currentStreak: current, bestStreak: best }
}

function StatCard({
  label,
  value,
  sentiment,
}: {
  label: string
  value: string
  sentiment?: "positive" | "negative" | "neutral"
}) {
  const valueColor =
    sentiment === "positive" ? "text-green-600 dark:text-green-400" :
    sentiment === "negative" ? "text-red-500" :
    "text-foreground"

  return (
    <div className="rounded-lg bg-muted/60 px-3 py-2.5 min-w-0">
      <p className="text-[11px] text-muted-foreground mb-0.5 truncate">{label}</p>
      <p className={`text-base font-medium leading-tight tabular-nums truncate ${valueColor}`}>{value}</p>
    </div>
  )
}

function Tooltip({ state }: { state: TooltipState }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ left: state.x + 12, top: state.y })

  useEffect(() => {
    if (!ref.current) return
    const { offsetWidth: tw, offsetHeight: th } = ref.current
    let left = state.x + 12
    let top = state.y - th / 2
    if (left + tw > window.innerWidth - 8) left = state.x - tw - 12
    if (top < 8) top = 8
    if (top + th > window.innerHeight - 8) top = window.innerHeight - th - 8
    setPos({ left, top })
  }, [state.x, state.y])

  const { cell } = state
  const log = cell.log
  const sign = log && log.netDeficit > 0 ? "+" : ""
  const deficitColor =
    log && log.netDeficit > 0 ? "text-green-600 dark:text-green-400" :
    log && log.netDeficit < 0 ? "text-red-500" :
    "text-foreground"

  return (
    <div
      ref={ref}
      className="fixed z-50 pointer-events-none bg-popover border border-border rounded-xl px-3.5 py-2.5 shadow-lg text-xs min-w-[160px]"
      style={{ left: pos.left, top: pos.top }}
    >
      <p className="font-semibold text-foreground mb-1.5">
        {cell.date.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
      </p>
      {cell.isFuture ? (
        <p className="text-muted-foreground">Future</p>
      ) : log ? (
        <div className="space-y-0.5">
          <div className="flex justify-between gap-6">
            <span className="text-muted-foreground">Eaten</span>
            <span className="font-medium text-foreground">{log.caloriesEaten.toLocaleString()} kcal</span>
          </div>
          <div className="flex justify-between gap-6 pt-0.5 border-t border-border mt-1">
            <span className="text-muted-foreground">Net</span>
            <span className={`font-semibold ${deficitColor}`}>{sign}{log.netDeficit.toLocaleString()} kcal</span>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">No entry logged</p>
      )}
    </div>
  )
}

function Legend() {
  return (
    <div className="flex items-center gap-1.5 pt-3 border-t border-border flex-wrap">
      <span className="text-[11px] text-muted-foreground">Less</span>
      {["bg-green-200", "bg-green-400", "bg-green-600", "bg-green-800"].map((c) => (
        <div key={c} className={`w-2.5 h-2.5 rounded-sm shrink-0 ${c}`} />
      ))}
      <span className="text-[11px] text-muted-foreground mr-1">More</span>
      <div className="w-px h-3 bg-border mx-0.5" />
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-sm bg-muted shrink-0" />
        <span className="text-[11px] text-muted-foreground">No log</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-sm bg-yellow-400 shrink-0" />
        <span className="text-[11px] text-muted-foreground">Even</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-sm bg-red-400 shrink-0" />
        <span className="text-[11px] text-muted-foreground">Surplus</span>
      </div>
    </div>
  )
}

export function CalendarHeatmap({ logs }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const WEEKS = 16
  const DAYS = WEEKS * 7
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const logMap = new Map<string, DailyLog>()
  logs.forEach((log) => {
    const key = new Date(log.date).toISOString().split("T")[0]
    logMap.set(key, log)
  })

  const cells: Cell[] = Array.from({ length: DAYS }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (DAYS - 1 - i))
    const key = date.toISOString().split("T")[0]
    return { date, key, log: logMap.get(key), isFuture: date > today }
  })

  const stats = computeStats(cells)

  const firstDow = cells[0].date.getDay()
  const padded: (Cell | null)[] = [...Array(firstDow).fill(null), ...cells]
  const totalCols = Math.ceil(padded.length / 7)
  const grid: (Cell | null)[][] = Array.from({ length: totalCols }, (_, c) =>
    padded.slice(c * 7, c * 7 + 7)
  )

  const monthLabels = new Map<number, string>()
  let lastMonth = -1
  padded.forEach((cell, i) => {
    if (!cell) return
    const col = Math.floor(i / 7)
    if (cell.date.getMonth() !== lastMonth) {
      monthLabels.set(col, cell.date.toLocaleDateString("en-CA", { month: "short" }))
      lastMonth = cell.date.getMonth()
    }
  })

  const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]

  const rangeStart = cells[0].date.toLocaleDateString("en-CA", { month: "short", day: "numeric" })
  const rangeEnd = cells[cells.length - 1].date.toLocaleDateString("en-CA", {
    month: "short", day: "numeric", year: "numeric",
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-baseline justify-between">
          <CardTitle className="text-base">Consistency</CardTitle>
          <span className="text-[11px] text-muted-foreground">{rangeStart} – {rangeEnd}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Stats — 2-col on mobile, 4-col on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatCard label="Logged days" value={String(stats.loggedDays)} />
          <StatCard
            label="Log rate"
            value={`${stats.logRate}%`}
            sentiment={stats.logRate >= 80 ? "positive" : stats.logRate < 50 ? "negative" : "neutral"}
          />
          <StatCard
            label="Avg deficit"
            value={`${stats.avgDeficit > 0 ? "+" : ""}${stats.avgDeficit.toLocaleString()} kcal`}
            sentiment={stats.avgDeficit > 0 ? "positive" : stats.avgDeficit < 0 ? "negative" : "neutral"}
          />
          <StatCard
            label="Deficit days"
            value={String(stats.deficitDays)}
            sentiment={stats.deficitDays > stats.loggedDays * 0.6 ? "positive" : "neutral"}
          />
        </div>

        {/* Streaks */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
            <span>🔥</span>
            <span>Current</span>
            <span className="font-medium text-foreground">
              {stats.currentStreak} day{stats.currentStreak !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
            <span>🏆</span>
            <span>Best</span>
            <span className="font-medium text-foreground">
              {stats.bestStreak} day{stats.bestStreak !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Heatmap — bleeds to card edges on mobile for max width */}
        <HeatmapGrid grid={grid} monthLabels={monthLabels} />

        <Legend />
      </CardContent>

      {tooltip && <Tooltip state={tooltip} />}
    </Card>
  )
}