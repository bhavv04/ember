"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailyLog } from "@/types"

interface Props {
  logs: DailyLog[]
}

export function RecentLogs({ logs }: Props) {
  const recent = logs.slice(0, 7)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent logs</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between py-3 border-b border-border last:border-0"
          >
            <div>
              <p className="text-sm font-medium">
                {new Date(log.date).toLocaleDateString("en-CA", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {log.caloriesEaten.toLocaleString()} eaten · {log.tdeeForDay.toLocaleString()} TDEE
              </p>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-bold ${
                  log.netDeficit > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {log.netDeficit > 0 ? "+" : ""}{log.netDeficit.toLocaleString()} kcal
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}