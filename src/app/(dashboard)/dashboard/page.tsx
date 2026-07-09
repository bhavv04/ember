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
      <div className="min-h-screen flex items-center justify-center bg-ember-page">
        <div className="space-y-2 text-center">
          <div className="w-5 h-5 border border-ember-amber border-t-transparent animate-spin mx-auto" />
          <p className="text-xs  uppercase tracking-wider text-ember-muted">
            Reading instruments...
          </p>
        </div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-ember-page">
        <div className="text-center space-y-3">
          <p className="text-2xl font-semibold text-ember-ink">No goal set yet</p>
          <a
            href="/settings"
            className="text-sm  text-ember-amber border-b border-ember-amber/40 hover:border-ember-amber transition-colors pb-px"
          >
            Set one up →
          </a>
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

  const today = new Date()

  return (
    <div
      className="min-h-screen bg-ember-page"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-16">

        {/* Header */}
        <div className="flex items-start justify-between pb-8 mb-8 border-b border-ember-card-border">
          <div>
            <h1 className="text-3xl font-semibold text-ember-ink">Your ember</h1>
            <p className="text-sm text-ember-muted mt-1 ">
              {weightToLose} kg goal · {totalDeficit.toLocaleString()} kcal mountain
            </p>
          </div>
          <p className="text-xs  text-ember-muted mt-1">
            {today.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })}
          </p>
        </div>

        {/* Quick actions */}
        <div className="pb-8 mb-8 border-b border-ember-card-border">
          <QuickActions />
        </div>

        {/* Progress + Timeline side by side on wider screens */}
        <div className="grid sm:grid-cols-2 gap-x-12 pb-8 mb-8 border-b border-ember-card-border">
          <div>
            <h2 className="text-sm text-ember-muted mb-5">
              Fig. 01 — Progress
            </h2>
            <ProgressCard
              weightToLose={weightToLose}
              totalDeficit={totalDeficit}
              burnedSoFar={burnedSoFar}
              remaining={remaining}
              progressPercent={progressPercent}
              avgDailyDeficit={avgDailyDeficit}
              loggedDays={logs.length}
            />
          </div>

          <div className="mt-8 sm:mt-0">
            <h2 className="text-sm text-ember-muted mb-5">
              Fig. 02 — Timeline
            </h2>
            {projectedDate && daysRemaining ? (
              <TimelineCard
                projectedDate={projectedDate}
                avgDailyDeficit={avgDailyDeficit}
                daysRemaining={daysRemaining}
              />
            ) : (
              <p className="text-sm text-ember-muted ">
                Log a few days to see your projected goal date.
              </p>
            )}
          </div>
        </div>

        {/* Activity */}
        <div>
          <h2 className="text-sm text-ember-muted mb-5">
            Fig. 03 — Activity equivalents
          </h2>
          <ActivityCard remaining={remaining} />
        </div>

      </div>
    </div>
  )
}