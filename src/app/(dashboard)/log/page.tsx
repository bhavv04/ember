"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarHeatmap } from "@/components/log/calendar-heatmap"
import { WeeklyChart } from "@/components/log/weekly-chart"
import { StreakStats } from "@/components/log/streak-stats"
import { RecentLogs } from "@/components/log/recent-logs"
import type { DailyLog } from "@/types"

export default function LogPage() {
  const router = useRouter()
  const [caloriesEaten, setCaloriesEaten] = useState("")
  const [tdeeForDay, setTdeeForDay] = useState("")
  const [loading, setLoading] = useState(false)
  const [baselineTdee, setBaselineTdee] = useState<number | null>(null)
  const [logs, setLogs] = useState<DailyLog[]>([])

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

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Log today</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-CA", {
            weekday: "long", year: "numeric",
            month: "long", day: "numeric",
          })}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today's intake</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Calories eaten</Label>
              <Input
                type="number"
                placeholder="e.g. 1800"
                value={caloriesEaten}
                onChange={(e) => setCaloriesEaten(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>
                TDEE today
                {baselineTdee && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (baseline: {baselineTdee})
                  </span>
                )}
              </Label>
              <Input
                type="number"
                placeholder="e.g. 2500"
                value={tdeeForDay}
                onChange={(e) => setTdeeForDay(e.target.value)}
              />
            </div>
          </div>

          {netDeficit !== null && (
            <div className={`rounded-lg p-4 ${netDeficit > 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                net deficit today
              </p>
              <p className={`text-2xl font-bold ${netDeficit > 0 ? "text-green-500" : "text-red-500"}`}>
                {netDeficit > 0 ? "+" : ""}{netDeficit.toLocaleString()} kcal
              </p>
            </div>
          )}

          <Button
            className="w-full"
            disabled={!caloriesEaten || !tdeeForDay || loading}
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : "Save log"}
          </Button>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <>
          <StreakStats logs={logs} />
          <CalendarHeatmap logs={logs} />
          <WeeklyChart logs={logs} />
          <RecentLogs logs={logs} />
        </>
      )}
    </div>
  )
}