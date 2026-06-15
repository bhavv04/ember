"use client"

import { useEffect, useState } from "react"
import { KCAL_PER_KG } from "@/lib/constants"
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
      const logsData: DailyLog[] = await logsRes.json()

      const seen = new Set<string>()
      const uniqueLogs = logsData.filter((log) => {
        const day = log.date.split("T")[0]
        if (seen.has(day)) return false
        seen.add(day)
        return true
      })

      setGoal(goalData)
      setLogs(uniqueLogs)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="w-7 h-7 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your ember...</p>
        </div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-4xl">🔥</p>
          <p className="font-semibold">No goal set yet</p>
          <a href="/settings" className="text-sm text-orange-500 underline">Set one up</a>
        </div>
      </div>
    )
  }

  const weightToLose = goal.startWeightKg - goal.targetWeightKg
  const totalDeficit = weightToLose * KCAL_PER_KG
  const burnedSoFar = logs.reduce((sum, log) => sum + log.netDeficit, 0)
  const remaining = Math.max(totalDeficit - burnedSoFar, 0)
  const progressPercent = Math.min((burnedSoFar / totalDeficit) * 100, 100)
  const avgDailyDeficit = logs.length > 0 ? burnedSoFar / logs.length : goal.baselineTdee - 2000
  const daysRemaining = avgDailyDeficit > 0 ? Math.ceil(remaining / avgDailyDeficit) : null
  const projectedDate = daysRemaining
    ? new Date(Date.now() + daysRemaining * 86400000).toLocaleDateString("en-CA", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between pb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your ember</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {weightToLose} kg goal · {totalDeficit.toLocaleString()} kcal mountain
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })}
          </p>
        </div>

        {/* Quick actions always visible at top */}
        <QuickActions />

        {/* Main bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Progress — takes full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2">
            <ProgressCard
              weightToLose={weightToLose}
              totalDeficit={totalDeficit}
              burnedSoFar={burnedSoFar}
              remaining={remaining}
              progressPercent={progressPercent}
            />
          </div>

          {/* Timeline — 1 col */}
          <div className="lg:col-span-1">
            {projectedDate && daysRemaining ? (
              <TimelineCard
                projectedDate={projectedDate}
                avgDailyDeficit={avgDailyDeficit}
                daysRemaining={daysRemaining}
              />
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6 h-full flex flex-col justify-center items-center text-center gap-2">
                <p className="text-3xl">📈</p>
                <p className="text-sm font-medium">No projection yet</p>
                <p className="text-xs text-muted-foreground">Log a few days to see your projected goal date</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity card — full width */}
        <ActivityCard remaining={remaining} />

      </div>
    </div>
  )
}