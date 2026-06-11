"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStreaks } from "./streak-utils"
import type { DailyLog } from "@/types"

interface Props {
  logs: DailyLog[]
}

export function StreakCard({ logs }: Props) {
  const { current, longest } = getStreaks(logs)
  const pct = longest > 0 ? Math.round((current / longest) * 100) : 0

  const milestones = [7, 14, 30, 60, 90]
  const nextMilestone = milestones.find((m) => m > current) ?? 100
  const milestonePct = Math.round((current / nextMilestone) * 100)

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Logging streak
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex flex-col gap-4 flex-1">

        {/* Main number */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tabular-nums">{current}</span>
          <span className="text-base text-muted-foreground font-medium">days</span>
        </div>

        {/* vs best */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>vs personal best</span>
            <span className="font-medium text-foreground">{longest} days</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-orange-400 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">{pct}% of best</p>
        </div>

        {/* Next milestone */}
        <div className="rounded-xl bg-muted/50 border border-border px-4 py-3 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">next milestone</span>
            <span className="font-semibold text-foreground">{nextMilestone} days</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
            <div
              className="h-1 rounded-full bg-orange-300 transition-all duration-700"
              style={{ width: `${milestonePct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {nextMilestone - current} day{nextMilestone - current !== 1 ? "s" : ""} to go
          </p>
        </div>

      </CardContent>
    </Card>
  )
}