interface Props {
  weightToLose: number
  totalDeficit: number
  burnedSoFar: number
  remaining: number
  progressPercent: number
  avgDailyDeficit?: number
  loggedDays?: number
}

export function ProgressCard({ weightToLose, totalDeficit, burnedSoFar, remaining, progressPercent, avgDailyDeficit, loggedDays }: Props) {
  const milestones = [25, 50, 75, 100]
  const kgBurned = burnedSoFar / 7700
  const kgRemaining = remaining / 7700

  return (
    <div className="bg-ember-card border border-ember-card-border rounded-3xl p-8 flex flex-col h-full">

      {/* Header */}
      <p className="uppercase tracking-[0.18em] text-xs text-ember-muted mb-6">Progress</p>

      {/* Big numbers */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs text-ember-muted uppercase tracking-widest mb-1">burned so far</p>
          <p className="text-4xl text-ember-amber tabular-nums tracking-tight">
            {burnedSoFar.toLocaleString()}
          </p>
          <p className="text-xs text-ember-muted mt-1">kcal</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ember-muted uppercase tracking-widest mb-1">remaining</p>
          <p className="text-2xl text-ember-ink tabular-nums tracking-tight">
            {remaining.toLocaleString()}
          </p>
          <p className="text-xs text-ember-muted mt-1">kcal</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2 mb-6">
        <div className="relative w-full">
          <div className="w-full bg-ember-forest-pale rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-ember-amber transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {milestones.map((m) => (
            <div
              key={m}
              className="absolute top-0 h-2.5 flex items-center"
              style={{ left: `${m}%`, transform: "translateX(-50%)" }}
            >
              <div className={`w-px h-2.5 ${progressPercent >= m ? "bg-ember-amber/40" : "bg-ember-card-border"}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-ember-muted">
          <span>0</span>
          <span className={progressPercent >= 100 ? "text-ember-forest" : "text-ember-ink"}>
            {progressPercent.toFixed(1)}% complete
          </span>
          <span>{totalDeficit.toLocaleString()}</span>
        </div>
      </div>

      {/* kg tiles */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-ember-forest-pale rounded-2xl p-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">Goal</p>
          <p className="text-xl text-ember-ink tabular-nums">{weightToLose.toFixed(1)}</p>
          <p className="text-[11px] text-ember-muted mt-0.5">kg total</p>
        </div>
        <div className="bg-ember-forest-pale rounded-2xl p-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">Lost</p>
          <p className="text-xl text-ember-amber tabular-nums">{kgBurned.toFixed(2)}</p>
          <p className="text-[11px] text-ember-muted mt-0.5">kg so far</p>
        </div>
        <div className="bg-ember-forest-pale rounded-2xl p-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">Left</p>
          <p className="text-xl text-ember-ink tabular-nums">{kgRemaining.toFixed(2)}</p>
          <p className="text-[11px] text-ember-muted mt-0.5">kg to go</p>
        </div>
      </div>

      {/* Math breakdown */}
      <div className="bg-ember-forest-pale rounded-2xl p-5 space-y-2 mt-auto">
        <p className="uppercase tracking-[0.15em] text-xs text-ember-forest-light mb-3">The math</p>
        <div className="flex justify-between text-sm">
          <span className="text-ember-muted">{weightToLose} kg × 7,700 kcal</span>
          <span className="text-ember-forest">{totalDeficit.toLocaleString()} kcal</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ember-muted">Burned so far</span>
          <span className="text-ember-forest">{burnedSoFar.toLocaleString()} kcal</span>
        </div>
        {avgDailyDeficit !== undefined && loggedDays !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-ember-muted">Avg over {loggedDays} days</span>
            <span className="text-ember-forest">{Math.round(avgDailyDeficit).toLocaleString()} kcal/day</span>
          </div>
        )}
        <div className="h-px bg-ember-forest-muted/20 my-1" />
        <div className="flex justify-between text-sm">
          <span className="text-ember-muted">Remaining</span>
          <span className="text-ember-amber">{remaining.toLocaleString()} kcal</span>
        </div>
      </div>

    </div>
  )
}