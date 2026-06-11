"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLast14Deficits } from "./streak-utils"
import type { DailyLog } from "@/types"

interface Props {
  logs: DailyLog[]
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 100
  const h = 40
  const zero = h - ((0 - min) / range) * h

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    .join(" ")

  // Area fill path
  const first = values[0]
  const last = values[values.length - 1]
  const firstX = 0
  const lastX = w
  const firstY = h - ((first - min) / range) * h
  const lastY = h - ((last - min) / range) * h
  const areaPath = `M${firstX},${firstY} ${points
    .split(" ")
    .slice(1)
    .join(" ")} L${lastX},${h} L${firstX},${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" preserveAspectRatio="none">
      {/* Zero line */}
      {min < 0 && max > 0 && (
        <line
          x1="0" y1={zero} x2={w} y2={zero}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2,2"
          className="text-border"
        />
      )}
      {/* Area */}
      <path d={areaPath} fill="#22c55e" fillOpacity="0.1" />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DeficitTrendCard({ logs }: Props) {
  const avgDeficit = logs.length > 0
    ? Math.round(logs.reduce((s, l) => s + l.netDeficit, 0) / logs.length)
    : 0

  const totalBurned = logs
    .filter((l) => l.netDeficit > 0)
    .reduce((s, l) => s + l.netDeficit, 0)

  const last14 = getLast14Deficits(logs)
  const last7Avg = Math.round(
    last14.slice(7).reduce((a, b) => a + b, 0) / 7
  )
  const prev7Avg = Math.round(
    last14.slice(0, 7).reduce((a, b) => a + b, 0) / 7
  )
  const trend = last7Avg - prev7Avg
  const trendPositive = trend >= 0

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Avg daily deficit
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex flex-col gap-4 flex-1">

        {/* Main number */}
        <div className="flex items-baseline gap-1.5">
          <span className={`text-4xl font-bold tabular-nums ${avgDeficit >= 0 ? "text-green-500" : "text-red-500"}`}>
            {avgDeficit > 0 ? "+" : ""}{avgDeficit.toLocaleString()}
          </span>
          <span className="text-base text-muted-foreground font-medium">kcal/day</span>
        </div>

        {/* Sparkline */}
        <div className="space-y-1">
          <Sparkline values={last14} />
          <p className="text-xs text-muted-foreground">last 14 days</p>
        </div>

        {/* Week over week */}
        <div className="rounded-xl bg-muted/50 border border-border px-4 py-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">week over week</span>
            <span className={`text-xs font-semibold ${trendPositive ? "text-green-500" : "text-red-500"}`}>
              {trendPositive ? "▲" : "▼"} {Math.abs(trend)} kcal
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Total burned: <span className="font-semibold text-foreground">{totalBurned.toLocaleString()} kcal</span></span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}