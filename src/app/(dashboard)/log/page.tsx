"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarHeatmap } from "@/components/log/calendar-heatmap"
import { LogForm } from "@/components/log/log-form"
import type { DailyLog } from "@/types"

export default function LogPage() {
  const router = useRouter()
  const [baselineTdee, setBaselineTdee] = useState<number | null>(null)
  const [logs, setLogs] = useState<DailyLog[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [goalRes, logsRes] = await Promise.all([
        fetch("/api/goals"),
        fetch("/api/logs"),
      ])
      const goal = await goalRes.json()
      const logsData = await logsRes.json()
      if (goal?.baselineTdee) setBaselineTdee(goal.baselineTdee)
      setLogs(logsData)
      setFetching(false)
    }
    fetchData()
  }, [])

  async function handleSubmit(date: Date, caloriesEaten: string, tdeeForDay: string) {
    if (!caloriesEaten || !tdeeForDay) return
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caloriesEaten: parseInt(caloriesEaten),
        tdeeForDay: parseInt(tdeeForDay),
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      }),
    })
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-ember-page">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8 sm:py-12">

        {/* Header */}
        <div className="pb-8 mb-8 border-b border-ember-card-border">
          <p className="uppercase text-ember-muted mb-2">
            Daily entry
          </p>
          <h1 className="text-3xl font-semibold text-ember-ink">Log today</h1>
          <p className="text-sm text-ember-muted mt-1 ">
            {new Date().toLocaleDateString("en-CA", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>

        {/* Log form */}
        <div className={logs.length > 0 || fetching ? "pb-8 mb-8 border-b border-ember-card-border" : ""}>
          <h2 className="text-sm text-ember-muted mb-5">
            Fig. 01 — Entry
          </h2>
          <LogForm
            baselineTdee={baselineTdee}
            loggedDates={logs.map((l) => l.date)}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Calendar heatmap */}
        {!fetching && logs.length > 0 && (
          <div>
            <h2 className="text-sm text-ember-muted mb-5">
              Fig. 02 — History
            </h2>
            <CalendarHeatmap logs={logs} />
          </div>
        )}

        {/* Loading skeleton */}
        {fetching && (
          <div className="space-y-4 animate-pulse">
            <div className="h-2.5 w-20 bg-ember-card-border" />
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 112 }).map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 bg-ember-card-border" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}