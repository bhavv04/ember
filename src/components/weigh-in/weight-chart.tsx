"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeighIn } from "@/types"

interface Props {
  history: WeighIn[]
  startWeightKg: number
  targetWeightKg: number
}

export function WeightChart({ history, startWeightKg, targetWeightKg }: Props) {
  if (history.length < 2) return null

  const sorted = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const weights = sorted.map((h) => h.weightKg)
  const allValues = [...weights, startWeightKg, targetWeightKg]
  const minVal = Math.min(...allValues) - 0.5
  const maxVal = Math.max(...allValues) + 0.5
  const range = maxVal - minVal

  const W = 400
  const H = 120
  const PAD = { top: 12, right: 16, bottom: 20, left: 32 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  function xPos(i: number) {
    return PAD.left + (i / (sorted.length - 1)) * chartW
  }

  function yPos(val: number) {
    return PAD.top + (1 - (val - minVal) / range) * chartH
  }

  const linePath = sorted
    .map((h, i) => `${i === 0 ? "M" : "L"}${xPos(i)},${yPos(h.weightKg)}`)
    .join(" ")

  const areaPath = `${linePath} L${xPos(sorted.length - 1)},${PAD.top + chartH} L${PAD.left},${PAD.top + chartH} Z`

  const targetY = yPos(targetWeightKg)
  const startY = yPos(startWeightKg)

  const totalLost = startWeightKg - sorted[sorted.length - 1].weightKg
  const toGo = sorted[sorted.length - 1].weightKg - targetWeightKg
  const pct = Math.round(((startWeightKg - sorted[sorted.length - 1].weightKg) / (startWeightKg - targetWeightKg)) * 100)

  // Y axis labels
  const yTicks = [maxVal, (maxVal + minVal) / 2, minVal].map((v) => ({
    val: Math.round(v * 10) / 10,
    y: yPos(v),
  }))

  // X axis labels — first and last
  const xLabels = [
    { label: new Date(sorted[0].date).toLocaleDateString("en-CA", { month: "short", day: "numeric" }), x: xPos(0) },
    { label: new Date(sorted[sorted.length - 1].date).toLocaleDateString("en-CA", { month: "short", day: "numeric" }), x: xPos(sorted.length - 1) },
  ]

  return (
    <Card>
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-baseline justify-between">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Weight trend
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {sorted.length} weigh-ins
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 space-y-4">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Lost so far",
              value: `${totalLost >= 0 ? "-" : "+"}${Math.abs(totalLost).toFixed(1)} kg`,
              color: totalLost >= 0 ? "text-green-500" : "text-red-500",
            },
            {
              label: "Still to go",
              value: `${toGo > 0 ? toGo.toFixed(1) : "0"} kg`,
              color: "text-foreground",
            },
            {
              label: "Progress",
              value: `${Math.min(Math.max(pct, 0), 100)}%`,
              color: pct >= 50 ? "text-green-500" : "text-orange-500",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-muted/50 border border-border px-3 py-2.5">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className={`text-lg font-bold tabular-nums ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* SVG chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ minWidth: "280px", height: "120px" }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {yTicks.map((t) => (
              <line
                key={t.val}
                x1={PAD.left} y1={t.y}
                x2={W - PAD.right} y2={t.y}
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="3,3"
                className="text-border"
              />
            ))}

            {/* Y axis labels */}
            {yTicks.map((t) => (
              <text
                key={t.val}
                x={PAD.left - 4}
                y={t.y + 3}
                textAnchor="end"
                fontSize="8"
                className="fill-muted-foreground"
              >
                {t.val}
              </text>
            ))}

            {/* X axis labels */}
            {xLabels.map((l, i) => (
              <text
                key={i}
                x={l.x}
                y={H - 4}
                textAnchor={i === 0 ? "start" : "end"}
                fontSize="8"
                className="fill-muted-foreground"
              >
                {l.label}
              </text>
            ))}

            {/* Target line */}
            <line
              x1={PAD.left} y1={targetY}
              x2={W - PAD.right} y2={targetY}
              stroke="#22c55e"
              strokeWidth="1"
              strokeDasharray="4,3"
              opacity="0.6"
            />
            <text
              x={W - PAD.right + 2}
              y={targetY + 3}
              fontSize="7"
              fill="#22c55e"
              opacity="0.8"
            >
              goal
            </text>

            {/* Start line */}
            <line
              x1={PAD.left} y1={startY}
              x2={W - PAD.right} y2={startY}
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="2,4"
              opacity="0.3"
              className="text-muted-foreground"
            />

            {/* Area fill */}
            <path d={areaPath} fill="#f97316" fillOpacity="0.06" />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {sorted.map((h, i) => (
              <circle
                key={h.id}
                cx={xPos(i)}
                cy={yPos(h.weightKg)}
                r="2.5"
                fill="#f97316"
                stroke="white"
                strokeWidth="1"
              />
            ))}

            {/* Latest point highlight */}
            <circle
              cx={xPos(sorted.length - 1)}
              cy={yPos(sorted[sorted.length - 1].weightKg)}
              r="4"
              fill="#f97316"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
        </div>

      </CardContent>
    </Card>
  )
}