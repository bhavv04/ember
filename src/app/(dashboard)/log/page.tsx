"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarHeatmap } from "@/components/log/calendar-heatmap"
import { LogForm } from "@/components/log/log-form"
import type { DailyLog } from "@/types"

export default function LogPage() {
  const router = useRouter()
  const [caloriesEaten, setCaloriesEaten] = useState("")
  const [tdeeForDay, setTdeeForDay] = useState("")
  const [loading, setLoading] = useState(false)
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
      if (goal?.baselineTdee) {
        setTdeeForDay(goal.baselineTdee.toString())
        setBaselineTdee(goal.baselineTdee)
      }
      setLogs(logsData)
      setFetching(false)
    }
    fetchData()
  }, [])

  async function handleSubmit() {
    if (!caloriesEaten || !tdeeForDay) return
    setLoading(true)
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caloriesEaten: parseInt(caloriesEaten),
        tdeeForDay: parseInt(tdeeForDay),
      }),
    })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">Log today</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-CA", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Log form — full width */}
        <LogForm
          caloriesEaten={caloriesEaten}
          tdeeForDay={tdeeForDay}
          baselineTdee={baselineTdee}
          loading={loading}
          onCaloriesEatenChange={setCaloriesEaten}
          onTdeeForDayChange={setTdeeForDay}
          onSubmit={handleSubmit}
        />

        {/* Heatmap — shows once data is loaded */}
        {!fetching && logs.length > 0 && (
          <CalendarHeatmap logs={logs} />
        )}

        {/* Skeleton placeholder while fetching */}
        {fetching && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-3 animate-pulse">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 112 }).map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-sm bg-muted" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}