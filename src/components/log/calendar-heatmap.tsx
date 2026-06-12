"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailyLog } from "@/types"
import { HeatmapGrid } from "@/components/log/heatmap-grid"
import { HeatmapLegend } from "@/components/log/heatmap-legend"
import { StatCard } from "@/components/log/stat-card"
import { StreakBadges } from "@/components/log/streak-badges"
import { computeStats, type Cell } from "@/lib/heatmap-stats"

interface Props {
  logs: DailyLog[]
}

export function CalendarHeatmap({ logs }: Props) {
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatCard label="Logged days" value={String(stats.loggedDays)} />
          <StatCard label="Log rate" value={`${stats.logRate}%`}
            sentiment={stats.logRate >= 80 ? "positive" : stats.logRate < 50 ? "negative" : "neutral"} />
          <StatCard label="Avg deficit"
            value={`${stats.avgDeficit > 0 ? "+" : ""}${stats.avgDeficit.toLocaleString()} kcal`}
            sentiment={stats.avgDeficit > 0 ? "positive" : stats.avgDeficit < 0 ? "negative" : "neutral"} />
          <StatCard label="Deficit days" value={String(stats.deficitDays)}
            sentiment={stats.deficitDays > stats.loggedDays * 0.6 ? "positive" : "neutral"} />
        </div>

        <StreakBadges currentStreak={stats.currentStreak} bestStreak={stats.bestStreak} />
        <HeatmapGrid grid={grid} monthLabels={monthLabels} />
        <HeatmapLegend />
      </CardContent>
    </Card>
  )
}