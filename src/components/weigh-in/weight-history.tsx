"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeighIn } from "@/types"

interface Props {
  history: WeighIn[]
}

export function WeightHistory({ history }: Props) {
  if (history.length === 0) return null

  const sorted = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Card>
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          History
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-2">
        {sorted.map((entry, i) => {
          const prev = sorted[i + 1]
          const delta = prev ? entry.weightKg - prev.weightKg : null

          return (
            <div
              key={entry.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="text-sm font-medium">
                  {new Date(entry.date).toLocaleDateString("en-CA", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {delta !== null && (
                  <span className={`text-xs font-medium tabular-nums ${
                    delta < 0 ? "text-green-500" : delta > 0 ? "text-red-500" : "text-muted-foreground"
                  }`}>
                    {delta > 0 ? "+" : ""}{delta.toFixed(1)} kg
                  </span>
                )}
                <span className="text-sm font-bold tabular-nums w-16 text-right">
                  {entry.weightKg} kg
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}