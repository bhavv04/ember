interface Props {
  projectedDate: string
  avgDailyDeficit: number
  daysRemaining: number
}

export function TimelineCard({ projectedDate, avgDailyDeficit, daysRemaining }: Props) {
  const weeksRemaining = Math.ceil(daysRemaining / 7)
  const monthsRemaining = (daysRemaining / 30.4).toFixed(1)

  const pace =
    avgDailyDeficit >= 700 ? { label: "Aggressive" } :
    avgDailyDeficit >= 400 ? { label: "On track" } :
    avgDailyDeficit >= 200 ? { label: "Moderate" } :
    { label: "Slow" }

  return (
    <div className="bg-ember-forest px-8 py-10 ">
      {/* Main date */}
      <p className="uppercase tracking-[0.18em] text-xs text-ember-forest-text mb-4">
        Projected date
      </p>
      <p className="text-3xl text-[#f7f3ea] tracking-tight leading-none mb-3">
        {projectedDate}
      </p>

      {/* Pace badge — bracket style */}
      <p className="text-xs text-ember-forest-muted mb-6">
        <span className="text-ember-amber">[ {pace.label.toUpperCase()} ]</span>{" "}
        · {Math.round(avgDailyDeficit)} kcal/day
      </p>

      {/* Time breakdown */}
      <div className="space-y-1.5 py-5 border-y border-white/10 mb-6">
        {[
          { label: "Days", value: daysRemaining.toLocaleString() },
          { label: "Weeks", value: weeksRemaining },
          { label: "Months", value: monthsRemaining },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-ember-forest-muted uppercase text-xs tracking-wide">{label}</span>
            <span className="text-[#f7f3ea] tabular-nums">{value}</span>
          </div>
        ))}
      </div>

      {/* What if */}
      <p className="uppercase tracking-[0.15em] text-xs text-ember-forest-muted mb-3">
        What if
      </p>
      <div className="space-y-1.5">
        {[
          { label: "300 kcal/day", days: Math.ceil((daysRemaining * avgDailyDeficit) / 300) },
          { label: "500 kcal/day", days: Math.ceil((daysRemaining * avgDailyDeficit) / 500) },
          { label: "700 kcal/day", days: Math.ceil((daysRemaining * avgDailyDeficit) / 700) },
        ].map((s) => (
          <div key={s.label} className="flex justify-between text-sm">
            <span className="text-ember-forest-muted">{s.label}</span>
            <span className="text-[#f7f3ea] tabular-nums">{s.days} days</span>
          </div>
        ))}
      </div>
    </div>
  )
}