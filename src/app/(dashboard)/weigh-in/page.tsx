"use client"

import { useState, useEffect } from "react"
import { WeightForm } from "@/components/weigh-in/weight-form"
import { WeightChart } from "@/components/weigh-in/weight-chart"
import { WeightHistory } from "@/components/weigh-in/weight-history"
import type { WeighIn, Goal } from "@/types"

export default function WeighInPage() {
  const [history, setHistory] = useState<WeighIn[]>([])
  const [goal, setGoal] = useState<Goal | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [weighInsRes, goalRes] = await Promise.all([
        fetch("/api/weigh-ins"),
        fetch("/api/goals"),
      ])
      setHistory(await weighInsRes.json())
      setGoal(await goalRes.json())
      setFetching(false)
    }
    fetchData()
  }, [])

  function handleSaved(entry: WeighIn) {
    setHistory((prev) => [entry, ...prev])
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Weigh in</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Weekly weigh-ins recalibrate your TDEE automatically
          </p>
        </div>

        {/* Top row — form + quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <WeightForm
              baselineTdee={goal?.baselineTdee}
              onSaved={handleSaved}
            />
          </div>

          {/* Quick stats */}
          {!fetching && goal && history.length > 0 && (
            <div className="flex flex-col gap-3">
              {[
                {
                  label: "Start weight",
                  value: `${goal.startWeightKg} kg`,
                },
                {
                  label: "Current",
                  value: `${history[0]?.weightKg ?? "—"} kg`,
                },
                {
                  label: "Target",
                  value: `${goal.targetWeightKg} kg`,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-card px-4 py-3 flex-1"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                    {s.label}
                  </p>
                  <p className="text-xl font-bold tabular-nums">{s.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart */}
        {!fetching && goal && history.length >= 2 && (
          <WeightChart
            history={history}
            startWeightKg={goal.startWeightKg}
            targetWeightKg={goal.targetWeightKg}
          />
        )}

        {/* History */}
        {!fetching && <WeightHistory history={history} />}

      </div>
    </div>
  )
}