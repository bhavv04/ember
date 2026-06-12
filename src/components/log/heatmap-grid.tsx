import { useState } from "react"
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

// Move getCellClass here too since it's only used by the grid
function getCellClass(cell: Cell): string {
  if (cell.isFuture) return "bg-muted/40 cursor-default"
  if (!cell.log) return "bg-muted hover:bg-muted/70 cursor-default"
  const d = cell.log.netDeficit
  if (d >= 700) return "bg-green-800 hover:bg-green-900"
  if (d >= 400) return "bg-green-600 hover:bg-green-700"
  if (d >= 100) return "bg-green-400 hover:bg-green-500"
  if (d > 0)    return "bg-green-200 hover:bg-green-300"
  if (d === 0)  return "bg-yellow-400 hover:bg-yellow-500"
  if (d >= -200) return "bg-red-300 hover:bg-red-400"
  return "bg-red-500 hover:bg-red-600"
}

interface Props {
  grid: (Cell | null)[][]
  monthLabels: Map<number, string>
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]

export function HeatmapGrid({ grid, monthLabels }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <div className="w-max">
        {/* Month labels */}
        <div className="flex gap-[3px] mb-[3px] pl-[18px]">
          {grid.map((_, colIdx) => (
            <div key={colIdx} className="w-[13px] shrink-0 overflow-visible">
              {monthLabels.has(colIdx) && (
                <span className="text-muted-foreground whitespace-nowrap text-[9px]">
                  {monthLabels.get(colIdx)}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-[1px]">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="w-[13px] h-[13px] flex items-center justify-center">
                {i % 2 === 1 && (
                  <span className="text-muted-foreground text-[8px]">{d}</span>
                )}
              </div>
            ))}
          </div>

          {/* Columns */}
          {grid.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-[3px]">
              {col.map((cell, rowIdx) =>
                cell ? (
                  <div
                    key={rowIdx}
                    onMouseEnter={(e) => setTooltip({ cell, x: e.clientX, y: e.clientY })}
                    onMouseMove={(e) => setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)}
                    onMouseLeave={() => setTooltip(null)}
                    className={`w-[13px] h-[13px] rounded-[2px] shrink-0 transition-colors ${getCellClass(cell)}`}
                  />
                ) : (
                  <div key={rowIdx} className="w-[13px] h-[13px] shrink-0 opacity-0 pointer-events-none" />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          <div>{tooltip.cell.key}</div>
          {tooltip.cell.log ? (
            <div>Net deficit: {tooltip.cell.log.netDeficit}</div>
          ) : (
            <div>No log</div>
          )}
        </div>
      )}
    </div>
  )
}