"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { DailyLog } from "@/types"

interface Props {
  logs: DailyLog[]
}

function getStreaks(logs: DailyLog[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const logDates = new Set(
    logs.map((l) => new Date(l.date).toISOString().split("T")[0])
  )

  let current = 0
  let longest = 0
  let temp = 0

  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const key = date.toISOString().split("T")[0]

    if (logDates.has(key)) {
      if (i === 0 || current > 0) current++
      temp++
      longest = Math.max(longest, temp)
    } else {
      if (i === 0) current = 0
      else if (current > 0) current = 0
      temp = 0
    }
  }

  return { current, longest }
}

export function StreakStats({ logs }: Props) {
  const { current, longest } = getStreaks(logs)
  const avgDeficit = logs.length > 0
    ? Math.round(logs.reduce((s, l) => s + l.netDeficit, 0) / logs.length)
    : 0
  const deficitDays = logs.filter((l) => l.netDeficit > 0).length

  const stats = [
    {
      label: "Current streak",
      value: `${current} days`,
      sub: `best: ${longest} days`,
    },
    {
      label: "Avg deficit",
      value: `${avgDeficit > 0 ? "+" : ""}${avgDeficit.toLocaleString()} kcal`,
      sub: "per day",
    },
    {
      label: "Deficit days",
      value: `${deficitDays}`,
      sub: `of ${logs.length} logged`,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-lg font-bold mt-1 tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}