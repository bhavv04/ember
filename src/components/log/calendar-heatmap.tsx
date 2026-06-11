"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailyLog } from "@/types"

interface Props {
  logs: DailyLog[]
}

interface Cell {
  date: Date
  key: string
  log?: DailyLog
}

interface TooltipState {
  cell: Cell
  x: number
  y: number
}

function getColorClass(log: DailyLog | undefined) {
  if (!log) return "bg-muted hover:bg-muted/70"
  if (log.netDeficit >= 700) return "bg-green-600 hover:bg-green-700"
  if (log.netDeficit >= 400) return "bg-green-500 hover:bg-green-600"
  if (log.netDeficit >= 100) return "bg-green-400 hover:bg-green-500"
  if (log.netDeficit > 0) return "bg-green-300 hover:bg-green-400"
  if (log.netDeficit === 0) return "bg-yellow-400 hover:bg-yellow-500"
  if (log.netDeficit >= -200) return "bg-red-300 hover:bg-red-400"
  return "bg-red-500 hover:bg-red-600"
}

export function CalendarHeatmap({ logs }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const weeks = 16
  const days = weeks * 7
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const logMap = new Map<string, DailyLog>()
  logs.forEach((log) => {
    const key = new Date(log.date).toISOString().split("T")[0]
    logMap.set(key, log)
  })

  const cells: Cell[] = Array.from({ length: days }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (days - 1 - i))
    const key = date.toISOString().split("T")[0]
    return { date, key, log: logMap.get(key) }
  })

  const firstDayOfWeek = cells[0].date.getDay()
  const padded: (Cell | null)[] = [...Array(firstDayOfWeek).fill(null), ...cells]
  const totalCols = Math.ceil(padded.length / 7)

  const grid: (Cell | null)[][] = Array.from(
    { length: totalCols },
    (_, col) => padded.slice(col * 7, col * 7 + 7)
  )

  const monthLabels: { label: string; col: number }[] = []
  padded.forEach((cell, i) => {
    if (!cell) return
    const col = Math.floor(i / 7)
    if (cell.date.getDate() === 1 || i === firstDayOfWeek) {
      const label = cell.date.toLocaleDateString("en-CA", { month: "short" })
      const last = monthLabels[monthLabels.length - 1]
      if (!last || last.label !== label) monthLabels.push({ label, col })
    }
  })

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Consistency</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 overflow-x-auto relative">

        <div className="flex gap-1">
          {/* Day label spacer */}
          <div className="w-4 shrink-0" />

          {/* Month labels */}
          {grid.map((_, colIdx) => {
            const month = monthLabels.find((m) => m.col === colIdx)
            return (
              <div key={colIdx} className="w-3 shrink-0 text-center">
                {month && (
                  <span className="text-muted-foreground" style={{ fontSize: "9px" }}>
                    {month.label}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-0">
            {dayLabels.map((d, i) => (
              <div key={i} className="w-3 h-3 flex items-center justify-center">
                {i % 2 === 1 && (
                  <span className="text-muted-foreground" style={{ fontSize: "8px" }}>
                    {d}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Grid */}
          {grid.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1">
              {col.map((cell, rowIdx) => (
                <div
                  key={rowIdx}
                  onMouseEnter={(e) => {
                    if (!cell) return
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    const parent = (e.target as HTMLElement)
                      .closest(".relative")
                      ?.getBoundingClientRect()
                    if (parent) {
                      setTooltip({
                        cell,
                        x: rect.left - parent.left + rect.width / 2,
                        y: rect.top - parent.top - 8,
                      })
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  className={`w-3 h-3 rounded-sm shrink-0 transition-colors cursor-default ${
                    cell ? getColorClass(cell.log) : "opacity-0 pointer-events-none"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-md text-xs space-y-0.5 min-w-[140px]">
              <p className="font-semibold text-foreground">
                {tooltip.cell.date.toLocaleDateString("en-CA", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              {tooltip.cell.log ? (
                <>
                  <p className="text-muted-foreground">
                    Eaten: {tooltip.cell.log.caloriesEaten.toLocaleString()} kcal
                  </p>
                  <p className={`font-semibold ${tooltip.cell.log.netDeficit > 0 ? "text-green-500" : "text-red-500"}`}>
                    {tooltip.cell.log.netDeficit > 0 ? "+" : ""}
                    {tooltip.cell.log.netDeficit.toLocaleString()} kcal
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">No log</p>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-2 pt-2 flex-wrap">
          <span className="text-xs text-muted-foreground">less</span>
          {["bg-green-300", "bg-green-400", "bg-green-500", "bg-green-600"].map((c) => (
            <div key={c} className={`w-3 h-3 rounded-sm shrink-0 ${c}`} />
          ))}
          <span className="text-xs text-muted-foreground">more</span>
          <div className="w-px h-3 bg-border mx-1" />
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted shrink-0" />
            <span className="text-xs text-muted-foreground">no log</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-red-400 shrink-0" />
            <span className="text-xs text-muted-foreground">surplus</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-yellow-400 shrink-0" />
            <span className="text-xs text-muted-foreground">break even</span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}