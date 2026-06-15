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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-10 space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between pb-2">
          <div>
            <p className="uppercase tracking-[0.18em] text-xs text-ember-muted mb-1">Body</p>
            <h1 className="text-2xl text-ember-ink tracking-tight">Weigh in</h1>
            <p className="text-sm text-ember-muted mt-1">
              Weekly weigh-ins recalibrate your TDEE automatically
            </p>
          </div>
          <p className="text-xs text-ember-muted mt-1">
            {new Date().toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })}
          </p>
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Form */}
          <div className="md:col-span-2 bg-ember-card border border-ember-card-border rounded-3xl p-8">
            <p className="uppercase tracking-[0.18em] text-xs text-ember-muted mb-6">New entry</p>
            <WeightForm
              baselineTdee={goal?.baselineTdee}
              onSaved={handleSaved}
            />
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-3">
            {fetching ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-ember-card border border-ember-card-border rounded-2xl px-5 py-4 flex-1 animate-pulse">
                    <div className="h-2 w-16 bg-ember-forest-pale rounded-full mb-3" />
                    <div className="h-6 w-20 bg-ember-forest-pale rounded-full" />
                  </div>
                ))}
              </>
            ) : goal ? (
              <>
                {[
                  { label: "Start",   value: `${goal.startWeightKg} kg`,          color: "text-ember-ink"   },
                  { label: "Current", value: current ? `${current} kg` : "—",      color: "text-ember-amber" },
                  { label: "Lost",    value: lost ? `−${lost} kg` : "—",           color: "text-ember-forest"},
                  { label: "To go",   value: remaining ? `${remaining} kg` : "—",  color: "text-ember-ink"   },
                ].map((s) => (
                  <div key={s.label} className="bg-ember-card border border-ember-card-border rounded-2xl px-5 py-4 flex-1">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">{s.label}</p>
                    <p className={`text-xl tabular-nums ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>

        {/* Chart */}
        {!fetching && goal && history.length >= 2 && (
          <div className="bg-ember-card border border-ember-card-border rounded-3xl p-8">
            <p className="uppercase tracking-[0.18em] text-xs text-ember-muted mb-6">Trend</p>
            <WeightChart
              history={history}
              startWeightKg={goal.startWeightKg}
              targetWeightKg={goal.targetWeightKg}
            />
          </div>
        )}

        {/* History */}
        {!fetching && (
          <div className="bg-ember-card border border-ember-card-border rounded-3xl p-8">
            <p className="uppercase tracking-[0.18em] text-xs text-ember-muted mb-6">History</p>
            <WeightHistory history={history} />
          </div>
        )}

      </div>
    </div>
  )
}