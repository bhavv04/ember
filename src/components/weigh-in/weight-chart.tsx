"use client"

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
  const pct = Math.round(
    ((startWeightKg - sorted[sorted.length - 1].weightKg) / (startWeightKg - targetWeightKg)) * 100
  )

  const yTicks = [maxVal, (maxVal + minVal) / 2, minVal].map((v) => ({
    val: Math.round(v * 10) / 10,
    y: yPos(v),
  }))

  const xLabels = [
    { label: new Date(sorted[0].date).toLocaleDateString("en-CA", { month: "short", day: "numeric" }), x: xPos(0) },
    { label: new Date(sorted[sorted.length - 1].date).toLocaleDateString("en-CA", { month: "short", day: "numeric" }), x: xPos(sorted.length - 1) },
  ]

  return (
    <div className="space-y-6 ">

      {/* Stats row — flat, bordered, no tile backgrounds */}
      <div className="grid grid-cols-3 divide-x divide-ember-card-border border-y border-ember-card-border">
        {[
          {
            label: "Lost so far",
            value: `${totalLost >= 0 ? "−" : "+"}${Math.abs(totalLost).toFixed(1)} kg`,
            accent: totalLost >= 0,
          },
          {
            label: "Still to go",
            value: `${toGo > 0 ? toGo.toFixed(1) : "0"} kg`,
            accent: false,
          },
          {
            label: "Progress",
            value: `${Math.min(Math.max(pct, 0), 100)}%`,
            accent: pct < 50,
          },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3 first:pl-0">
            <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">{s.label}</p>
            <p className={`text-lg tabular-nums ${s.accent ? "text-ember-amber" : "text-ember-ink"}`}>
              {s.value}
            </p>
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
              stroke="#e3e5e4"
              strokeWidth="0.5"
              strokeDasharray="3,3"
            />
          ))}

          {/* Y axis labels */}
          {yTicks.map((t) => (
            <text key={t.val} x={PAD.left - 4} y={t.y + 3} textAnchor="end" fontSize="8" fill="#6b7280">
              {t.val}
            </text>
          ))}

          {/* X axis labels */}
          {xLabels.map((l, i) => (
            <text key={i} x={l.x} y={H - 4} textAnchor={i === 0 ? "start" : "end"} fontSize="8" fill="#6b7280">
              {l.label}
            </text>
          ))}

          {/* Target line */}
          <line
            x1={PAD.left} y1={targetY}
            x2={W - PAD.right} y2={targetY}
            stroke="#1b1d1e"
            strokeWidth="1"
            strokeDasharray="4,3"
            opacity="0.4"
          />
          <text x={W - PAD.right + 2} y={targetY + 3} fontSize="7" fill="#1b1d1e" opacity="0.6">
            goal
          </text>

          {/* Start line */}
          <line
            x1={PAD.left} y1={startY}
            x2={W - PAD.right} y2={startY}
            stroke="#6b7280"
            strokeWidth="0.5"
            strokeDasharray="2,4"
            opacity="0.4"
          />

          {/* Area fill */}
          <path d={areaPath} fill="#d97706" fillOpacity="0.06" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#d97706"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {sorted.map((h, i) => (
            <circle key={h.id} cx={xPos(i)} cy={yPos(h.weightKg)} r="2" fill="#d97706" stroke="#fafaf9" strokeWidth="1" />
          ))}

          {/* Latest point highlight */}
          <circle
            cx={xPos(sorted.length - 1)}
            cy={yPos(sorted[sorted.length - 1].weightKg)}
            r="3.5"
            fill="#d97706"
            stroke="#fafaf9"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  )
}