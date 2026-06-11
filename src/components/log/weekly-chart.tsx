"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailyLog } from "@/types"

interface Props {
  logs: DailyLog[]
}

export function WeeklyChart({ logs }: Props) {
  const days = 7
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const logMap = new Map<string, DailyLog>()
  logs.forEach((log) => {
    const key = new Date(log.date).toISOString().split("T")[0]
    logMap.set(key, log)
  })

  const week = Array.from({ length: days }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (days - 1 - i))
    const key = date.toISOString().split("T")[0]
    return {
      day: date.toLocaleDateString("en-CA", { weekday: "short" }),
      log: logMap.get(key),
    }
  })

  const maxVal = Math.max(
    ...week.map((d) =>
      Math.max(d.log?.caloriesEaten ?? 0, d.log?.tdeeForDay ?? 0, 2500)
    )
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">This week</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end gap-2 h-24">
          {week.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full h-20 relative flex items-end justify-center">
                {d.log ? (
                  <>
                    <div
                      className="absolute bottom-0 w-full rounded-t-sm bg-muted"
                      style={{ height: `${(d.log.tdeeForDay / maxVal) * 100}%` }}
                    />
                    <div
                      className={`absolute bottom-0 rounded-t-sm z-10 ${
                        d.log.netDeficit >= 0 ? "bg-orange-400" : "bg-red-400"
                      }`}
                      style={{
                        height: `${(d.log.caloriesEaten / maxVal) * 100}%`,
                        width: "55%",
                      }}
                    />
                  </>
                ) : (
                  <div className="absolute bottom-0 w-full h-0.5 bg-muted opacity-30 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {week.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              <p className="text-xs text-muted-foreground">{d.day}</p>
              {d.log && (
                <p className={`text-xs font-medium mt-0.5 ${d.log.netDeficit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {d.log.netDeficit > 0 ? "+" : ""}{d.log.netDeficit}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <span>TDEE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-400" />
            <span>Eaten</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}