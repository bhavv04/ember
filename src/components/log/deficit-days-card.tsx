"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWeeklyAvgs } from "./streak-utils"
import type { DailyLog } from "@/types"

interface Props {
  logs: DailyLog[]
}

export function DeficitDaysCard({ logs }: Props) {
  const deficitDays = logs.filter((l) => l.netDeficit > 0).length
  const surplusDays = logs.filter((l) => l.netDeficit < 0).length
  const evenDays = logs.length - deficitDays - surplusDays
  const deficitPct = logs.length > 0 ? Math.round((deficitDays / logs.length) * 100) : 0

  const weeklyAvgs = getWeeklyAvgs(logs)
  const maxAbs = Math.max(...weeklyAvgs.map(Math.abs), 1)

  const weekLabels = ["4w", "3w", "2w", "1w"]

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Deficit days
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex flex-col gap-4 flex-1">

        {/* Main number */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tabular-nums">{deficitDays}</span>
          <span className="text-base text-muted-foreground font-medium">of {logs.length}</span>
          <span className={`ml-auto text-sm font-semibold ${deficitPct >= 70 ? "text-green-500" : deficitPct >= 50 ? "text-orange-400" : "text-red-500"}`}>
            {deficitPct}%
          </span>
        </div>

        {/* Stacked bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2 rounded-full overflow-hidden flex gap-px">
            <div
              className="h-full bg-green-500 transition-all duration-700 rounded-l-full"
              style={{ width: `${deficitPct}%` }}
            />
            <div
              className="h-full bg-yellow-400 transition-all duration-700"
              style={{ width: `${logs.length > 0 ? Math.round((evenDays / logs.length) * 100) : 0}%` }}
            />
            <div
              className="h-full bg-red-400 transition-all duration-700 rounded-r-full"
              style={{ width: `${logs.length > 0 ? Math.round((surplusDays / logs.length) * 100) : 0}%` }}
            />
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {deficitDays} deficit
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
              {evenDays} even
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              {surplusDays} surplus
            </span>
          </div>
        </div>

        {/* Weekly bar chart */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            weekly avg
          </p>
          <div className="flex items-end gap-2 h-10">
            {weeklyAvgs.map((v, i) => {
              const heightPct = Math.abs(v) / maxAbs
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end h-8">
                    <div
                      className={`w-full rounded-sm transition-all duration-500 ${v >= 0 ? "bg-green-400" : "bg-red-400"}`}
                      style={{ height: `${Math.max(heightPct * 100, 6)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{weekLabels[i]}</span>
                </div>
              )
            })}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}