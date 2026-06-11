"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailyLog } from "@/types"

interface Props {
  logs: DailyLog[]
}

function getColor(log: DailyLog | undefined) {
  if (!log) return "bg-muted"
  if (log.netDeficit >= 500) return "bg-green-500"
  if (log.netDeficit >= 200) return "bg-green-400"
  if (log.netDeficit > 0) return "bg-green-300"
  if (log.netDeficit === 0) return "bg-yellow-400"
  return "bg-red-400"
}

export function CalendarHeatmap({ logs }: Props) {
  const weeks = 16
  const days = weeks * 7
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const logMap = new Map<string, DailyLog>()
  logs.forEach((log) => {
    const key = new Date(log.date).toISOString().split("T")[0]
    logMap.set(key, log)
  })

  const cells = Array.from({ length: days }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (days - 1 - i))
    const key = date.toISOString().split("T")[0]
    return { date, key, log: logMap.get(key) }
  })

  const firstDayOfWeek = cells[0].date.getDay()
  const padded = [...Array(firstDayOfWeek).fill(null), ...cells]
  const totalCols = Math.ceil(padded.length / 7)

  const grid: (typeof cells[0] | null)[][] = Array.from(
    { length: totalCols },
    (_, col) => padded.slice(col * 7, col * 7 + 7) as any
  )

  const monthLabels: { label: string; col: number }[] = []
  padded.forEach((cell, i) => {
    if (!cell) return
    const col = Math.floor(i / 7)
    if (cell.date.getDate() === 1 || i === firstDayOfWeek) {
      const label = cell.date.toLocaleDateString("en-CA", { month: "short" })
      const last = monthLabels[monthLabels.length - 1]
      if (!last || last.label !== label) {
        monthLabels.push({ label, col })
      }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Consistency</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 overflow-x-auto">
        {/* Month labels */}
        <div className="flex gap-1">
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

        {/* Grid */}
        <div className="flex gap-1">
          {grid.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1">
              {col.map((cell, rowIdx) => (
                <div
                  key={rowIdx}
                  title={
                    cell
                      ? `${cell.key}: ${cell.log ? `${cell.log.netDeficit > 0 ? "+" : ""}${cell.log.netDeficit} kcal` : "no log"}`
                      : ""
                  }
                  className={`w-3 h-3 rounded-sm shrink-0 ${cell ? getColor(cell.log) : "opacity-0"}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="text-xs text-muted-foreground">less</span>
          {["bg-muted", "bg-green-300", "bg-green-400", "bg-green-500"].map((c) => (
            <div key={c} className={`w-3 h-3 rounded-sm shrink-0 ${c}`} />
          ))}
          <span className="text-xs text-muted-foreground">more</span>
          <div className="ml-4 flex items-center gap-1">
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