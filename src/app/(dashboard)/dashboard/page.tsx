"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KCAL_PER_KG } from "@/lib/constants"

interface Goal {
  id: string
  targetWeightKg: number
  startWeightKg: number
  baselineTdee: number
  startDate: string
}

interface DailyLog {
  id: string
  date: string
  caloriesEaten: number
  tdeeForDay: number
  netDeficit: number
}

export default function DashboardPage() {
  const [goal, setGoal] = useState<Goal | null>(null)
  const [logs, setLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [goalRes, logsRes] = await Promise.all([
        fetch("/api/goals"),
        fetch("/api/logs"),
      ])
      const goalData = await goalRes.json()
      const logsData = await logsRes.json()
      setGoal(goalData)
      setLogs(logsData)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No goal found. <a href="/settings" className="underline">Set one up</a></p>
      </div>
    )
  }

  const weightToLose = goal.startWeightKg - goal.targetWeightKg
  const totalDeficit = weightToLose * KCAL_PER_KG
  const burnedSoFar = logs.reduce((sum, log) => sum + log.netDeficit, 0)
  const remaining = totalDeficit - burnedSoFar
  const progressPercent = Math.min((burnedSoFar / totalDeficit) * 100, 100)

  // Activity equivalents
  const walkingHours = (remaining / 280).toFixed(0)
  const treadmillHours = (remaining / 400).toFixed(0)
  const cyclingHours = (remaining / 450).toFixed(0)

  // Timeline projection
  const avgDailyDeficit = logs.length > 0
    ? burnedSoFar / logs.length
    : goal.baselineTdee - 2000
  const daysRemaining = avgDailyDeficit > 0
    ? Math.ceil(remaining / avgDailyDeficit)
    : null
  const projectedDate = daysRemaining
    ? new Date(Date.now() + daysRemaining * 86400000).toLocaleDateString("en-CA", {
        year: "numeric", month: "long", day: "numeric"
      })
    : null

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your ember</h1>
        <p className="text-muted-foreground mt-1">
          {weightToLose} kg to lose — {totalDeficit.toLocaleString()} kcal to burn
        </p>
      </div>

      {/* Main progress card */}
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Burned so far</span>
              <span className="font-medium">{burnedSoFar.toLocaleString()} / {totalDeficit.toLocaleString()} kcal</span>
            </div>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full bg-orange-500 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progressPercent.toFixed(1)}% complete</span>
              <span>{remaining.toLocaleString()} kcal remaining</span>
            </div>
          </div>

          {/* The math */}
          <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
            <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">The math</p>
            <p>{weightToLose} kg × 7,700 kcal = <span className="font-bold">{totalDeficit.toLocaleString()} kcal total</span></p>
            <p>Burned so far: <span className="font-bold">{burnedSoFar.toLocaleString()} kcal</span></p>
            <p>Remaining: <span className="font-bold text-orange-500">{remaining.toLocaleString()} kcal</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {projectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Projected goal date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projectedDate}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Based on your average daily deficit of {avgDailyDeficit.toFixed(0)} kcal — {daysRemaining} days from today
            </p>
          </CardContent>
        </Card>
      )}

      {/* Activity equivalents */}
      <Card>
        <CardHeader>
          <CardTitle>To burn the rest you could</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Walk", value: `${walkingHours} hours`, sub: "~280 kcal/hr" },
            { label: "Treadmill (moderate)", value: `${treadmillHours} hours`, sub: "~400 kcal/hr" },
            { label: "Cycling", value: `${cyclingHours} hours`, sub: "~450 kcal/hr" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <p className="text-xl font-bold">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href="/log"
          className="flex items-center justify-center p-4 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
        >
          + Log today
        </a>
        <a
          href="/weigh-in"
          className="flex items-center justify-center p-4 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
        >
          + Weigh in
        </a>
      </div>
    </div>
  )
}