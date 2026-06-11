"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarHeatmap } from "@/components/log/calendar-heatmap"
import { WeeklyChart } from "@/components/log/weekly-chart"
import { StreakStats } from "@/components/log/streak-stats"
import { RecentLogs } from "@/components/log/recent-logs"
import type { DailyLog } from "@/types"
import { LogForm } from "@/components/log/log-form"

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

  const netDeficit =
    tdeeForDay && caloriesEaten
      ? parseInt(tdeeForDay) - parseInt(caloriesEaten)
      : null

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

  const hasLogs = logs.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Log today</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString("en-CA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Top bento row — form + net deficit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <LogForm
            caloriesEaten={caloriesEaten}
            tdeeForDay={tdeeForDay}
            baselineTdee={baselineTdee}
            loading={loading}
            onCaloriesEatenChange={setCaloriesEaten}
            onTdeeForDayChange={setTdeeForDay}
            onSubmit={handleSubmit}
          />

          {/* Net deficit — spans 1 col */}
          <Card className="flex flex-col justify-center">
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Net deficit today
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {netDeficit !== null ? (
                <div className="space-y-2">
                  <p className={`text-5xl font-bold tabular-nums ${netDeficit > 0 ? "text-green-500" : "text-red-500"}`}>
                    {netDeficit > 0 ? "+" : ""}{netDeficit.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">kcal</p>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    netDeficit > 0
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-600"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${netDeficit > 0 ? "bg-green-500" : "bg-red-500"}`} />
                    {netDeficit > 0 ? "In a deficit" : "Over TDEE"}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-5xl font-bold text-muted-foreground/20 tabular-nums">—</p>
                  <p className="text-sm text-muted-foreground">enter values to see</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats row */}
        {!fetching && hasLogs && (
          <StreakStats logs={logs} />
        )}

        {/* Middle bento — heatmap + recent logs */}
        {!fetching && hasLogs && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Heatmap — 2 cols */}
            <div className="lg:col-span-2">
              <CalendarHeatmap logs={logs} />
            </div>

            {/* Recent logs — 1 col */}
            <div className="lg:col-span-1">
              <RecentLogs logs={logs} />
            </div>
          </div>
        )}

        {/* Bottom — weekly chart full width */}
        {!fetching && hasLogs && (
          <WeeklyChart logs={logs} />
        )}

        {/* Empty state */}
        {!fetching && !hasLogs && (
          <Card>
            <CardContent className="py-16 text-center space-y-2">
              <p className="text-4xl">📋</p>
              <p className="font-semibold text-foreground">No logs yet</p>
              <p className="text-sm text-muted-foreground">
                Save your first log above to start seeing your stats
              </p>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}