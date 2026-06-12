"use client"

import { useState, useEffect, useRef } from "react"
import type { DailyLog } from "@/types"

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

interface Props {
  grid: (Cell | null)[][]
  monthLabels: Map<number, string>
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

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]

export function HeatmapGrid({ grid, monthLabels }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const totalCols = grid.length

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const gridTemplateColumns = isMobile
    ? `repeat(${totalCols}, minmax(0, 1fr))`
    : `18px repeat(${totalCols}, minmax(0, 1fr))`

  return (
    <div ref={containerRef} className="w-full">
      <div className="w-full" style={{ display: "grid", gridTemplateColumns, gap: "3px" }}>

        {/* Month label row */}
        {!isMobile && <div />}{/* spacer above day labels */}
        {grid.map((_, colIdx) => (
          <div key={colIdx} className="relative h-[14px] min-w-0">
            {monthLabels.has(colIdx) && (
              <span className="absolute left-0 text-muted-foreground whitespace-nowrap text-[9px] leading-none">
                {monthLabels.get(colIdx)}
              </span>
            )}
          </div>
        ))}

        {/* Day labels column — only rendered on sm+, excluded from grid on mobile */}
        {!isMobile && (
          <div className="flex flex-col gap-[3px]">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="h-[13px] flex items-center justify-center">
                {i % 2 === 1 && (
                  <span className="text-muted-foreground text-[8px]">{d}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cell columns */}
        {grid.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-[3px]">
            {col.map((cell, rowIdx) =>
              cell ? (
                <div
                  key={rowIdx}
                  onMouseEnter={(e) => setTooltip({ cell, x: e.clientX, y: e.clientY })}
                  onMouseMove={(e) => setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)}
                  onMouseLeave={() => setTooltip(null)}
                  className={`w-full aspect-square rounded-[2px] shrink-0 transition-colors ${getCellClass(cell)}`}
                />
              ) : (
                <div key={rowIdx} className="w-full aspect-square shrink-0 opacity-0 pointer-events-none" />
              )
            )}
          </div>
        ))}
      </div>

      {tooltip && <Tooltip state={tooltip} />}
    </div>
  )
}