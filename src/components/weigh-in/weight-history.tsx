"use client"

import type { WeighIn } from "@/types"

interface Props {
  history: WeighIn[]
}

export function WeightHistory({ history }: Props) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-ember-muted text-center py-4">
        No weigh-ins yet — log your first one above.
      </p>
    )
  }

  const sorted = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div>
      {sorted.map((entry, i) => {
        const prev = sorted[i + 1]
        const delta = prev ? entry.weightKg - prev.weightKg : null

        return (
          <div
            key={entry.id}
            className="flex items-center justify-between py-3.5 border-b border-ember-card-border last:border-0"
          >
            <p className="text-sm text-ember-ink">
              {new Date(entry.date).toLocaleDateString("en-CA", {
                weekday: "short", month: "short", day: "numeric", year: "numeric",
              })}
            </p>
            <div className="flex items-center gap-4">
              {delta !== null && (
                <span className={`text-xs tabular-nums ${
                  delta < 0 ? "text-ember-forest" : delta > 0 ? "text-ember-amber" : "text-ember-muted"
                }`}>
                  {delta > 0 ? "+" : ""}{delta.toFixed(1)} kg
                </span>
              )}
              <span className="text-sm text-ember-ink tabular-nums w-16 text-right">
                {entry.weightKg} kg
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}