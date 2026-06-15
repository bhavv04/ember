interface Props {
  projectedDate: string
  avgDailyDeficit: number
  daysRemaining: number
}

export function TimelineCard({ projectedDate, avgDailyDeficit, daysRemaining }: Props) {
  const weeksRemaining = Math.ceil(daysRemaining / 7)
  const monthsRemaining = (daysRemaining / 30.4).toFixed(1)

  const pace =
    avgDailyDeficit >= 700 ? { label: "Aggressive", color: "text-ember-amber", bg: "bg-ember-amber/10" } :
    avgDailyDeficit >= 400 ? { label: "On track",   color: "text-ember-forest", bg: "bg-ember-forest-pale" } :
    avgDailyDeficit >= 200 ? { label: "Moderate",   color: "text-ember-amber", bg: "bg-ember-amber/10" } :
    { label: "Slow", color: "text-ember-muted", bg: "bg-ember-forest-pale" }

  return (
    <div className="bg-ember-forest rounded-3xl p-8 flex flex-col h-full">

      <p className="uppercase tracking-[0.18em] text-xs text-ember-forest-text mb-6">Projected date</p>

      {/* Main date */}
      <div className="mb-6">
        <p className="text-2xl text-[#f7f3ea] tracking-tight leading-none">{projectedDate}</p>
        <p className="text-xs text-ember-forest-muted mt-2">at your current pace</p>
      </div>

      {/* Pace badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit mb-6 bg-white/10`}>
        <div className="w-1.5 h-1.5 rounded-full bg-ember-amber" />
        <span className="text-xs text-[#f7f3ea]">{pace.label}</span>
        <span className="text-xs text-ember-forest-muted">·</span>
        <span className="text-xs text-ember-forest-muted">{Math.round(avgDailyDeficit)} kcal/day</span>
      </div>

      {/* Time breakdown */}
      <div className="bg-white/5 rounded-2xl p-5 space-y-2 mb-6">
        <p className="uppercase tracking-[0.15em] text-xs text-ember-forest-muted mb-3">Time remaining</p>
        {[
          { label: "Days",   value: daysRemaining.toLocaleString() },
          { label: "Weeks",  value: weeksRemaining },
          { label: "Months", value: monthsRemaining },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-ember-forest-muted">{label}</span>
            <span className="text-[#f7f3ea]">{value}</span>
          </div>
        ))}
      </div>

      {/* What if */}
      <div className="mt-auto space-y-2">
        <p className="uppercase tracking-[0.15em] text-xs text-ember-forest-muted mb-3">What if</p>
        {[
          { label: "300 kcal/day", days: Math.ceil((daysRemaining * avgDailyDeficit) / 300) },
          { label: "500 kcal/day", days: Math.ceil((daysRemaining * avgDailyDeficit) / 500) },
          { label: "700 kcal/day", days: Math.ceil((daysRemaining * avgDailyDeficit) / 700) },
        ].map((s) => (
          <div key={s.label} className="flex justify-between text-sm py-1.5 border-b border-white/10 last:border-0">
            <span className="text-ember-forest-muted">{s.label}</span>
            <span className="text-[#f7f3ea]">{s.days} days</span>
          </div>
        ))}
      </div>

    </div>
  )
}