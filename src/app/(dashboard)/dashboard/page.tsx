"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ACTIVITIES, KCAL_PER_KG } from "@/lib/constants"
import { ProgressCard } from "@/components/dashboard/progress-card"
import { TimelineCard } from "@/components/dashboard/timeline-card"
import { ActivityCard } from "@/components/dashboard/activity-card"
import { QuickActions } from "@/components/dashboard/quick-actions"

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
            <p className="text-muted-foreground mt-1">{weightToLose} kg to lose — {totalDeficit.toLocaleString()} kcal to burn</p>
            </div>

            <ProgressCard weightToLose={weightToLose} totalDeficit={totalDeficit} burnedSoFar={burnedSoFar} remaining={remaining} progressPercent={progressPercent} />
            {projectedDate && daysRemaining && <TimelineCard projectedDate={projectedDate} avgDailyDeficit={avgDailyDeficit} daysRemaining={daysRemaining} />}
            <ActivityCard remaining={remaining} />
            <QuickActions />
        </div>
    )
}