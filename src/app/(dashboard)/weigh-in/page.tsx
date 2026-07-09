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

  const current = history[0]?.weightKg
  const lost = goal && current ? (goal.startWeightKg - current).toFixed(1) : null
  const remaining = goal && current ? (current - goal.targetWeightKg).toFixed(1) : null

  return (
    <div className="min-h-screen bg-ember-page">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-12">

        {/* Header */}
        <div className="flex items-start justify-between pb-8 mb-8 border-b border-ember-card-border">
          <div>
            <p className=" text-ember-muted mb-2">Body</p>
            <h1 className="text-3xl font-semibold text-ember-ink">Weigh in</h1>
            <p className="text-sm text-ember-muted mt-1 ">
              Weekly weigh-ins recalibrate your TDEE automatically
            </p>
          </div>
          <p className="text-xs  text-ember-muted mt-1">
            {new Date().toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })}
          </p>
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 mb-8 border-b border-ember-card-border">

          {/* Form */}
          <div className="md:col-span-2">
            <h2 className="text-sm text-ember-muted mb-5">
              Fig. 01 — New entry
            </h2>
            <WeightForm
              baselineTdee={goal?.baselineTdee}
              onSaved={handleSaved}
            />
          </div>

          {/* Stats */}
          <div>
            <h2 className="text-sm text-ember-muted mb-5">
              Fig. 02 — Stats
            </h2>
            <div className="flex flex-col divide-y divide-ember-card-border border-y border-ember-card-border ">
              {fetching ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="px-1 py-3 animate-pulse">
                      <div className="h-2 w-16 bg-ember-card-border mb-3" />
                      <div className="h-5 w-20 bg-ember-card-border" />
                    </div>
                  ))}
                </>
              ) : goal ? (
                <>
                  {[
                    { label: "Start",   value: `${goal.startWeightKg} kg` },
                    { label: "Current", value: current ? `${current} kg` : "—", accent: true },
                    { label: "Lost",    value: lost ? `−${lost} kg` : "—" },
                    { label: "To go",   value: remaining ? `${remaining} kg` : "—" },
                  ].map((s) => (
                    <div key={s.label} className="px-1 py-3">
                      <p className="text-sm text-ember-muted mb-1">{s.label}</p>
                      <p className={`text-xl tabular-nums ${s.accent ? "text-ember-amber" : "text-ember-ink"}`}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Chart */}
        {!fetching && goal && history.length >= 2 && (
          <div className="pb-8 mb-8 border-b border-ember-card-border">
            <h2 className="text-sm text-ember-muted mb-5">
              Fig. 03 — Trend
            </h2>
            <WeightChart
              history={history}
              startWeightKg={goal.startWeightKg}
              targetWeightKg={goal.targetWeightKg}
            />
          </div>
        )}

        {/* History */}
        {!fetching && (
          <div>
            <h2 className="text-sm text-ember-muted mb-5">
              Fig. 04 — History
            </h2>
            <WeightHistory history={history} />
          </div>
        )}

      </div>
    </div>
  )
}