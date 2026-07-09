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
    <div>
      {/* Big numbers */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs text-ember-muted uppercase tracking-widest mb-1 ">burned so far</p>
          <p className="text-4xl text-ember-amber tabular-nums tracking-tight">
            {burnedSoFar.toLocaleString()}
          </p>
          <p className="text-xs text-ember-muted mt-1 ">kcal</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ember-muted uppercase tracking-widest mb-1 ">remaining</p>
          <p className="text-2xl text-ember-ink tabular-nums tracking-tight ">
            {remaining.toLocaleString()}
          </p>
          <p className="text-xs text-ember-muted mt-1 ">kcal</p>
        </div>
      </div>

     {/* Progress bar — ruler style */}
      <div className="space-y-2 mb-6">
        <div className="relative w-full pt-3">
          <div className="w-full bg-ember-card-border h-1.5 overflow-hidden">
            <div
              className="h-1.5 bg-ember-amber transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {milestones.map((m) => (
            <div
              key={m}
              className="absolute top-3 h-1.5 flex items-center"
              style={{ left: `${m}%`, transform: "translateX(-50%)" }}
            >
              <div className={`w-px h-3 ${progressPercent >= m ? "bg-ember-amber" : "bg-ember-ink/20"}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-ember-muted pt-1">
          <span>0</span>
          <span className={progressPercent >= 100 ? "text-ember-forest" : "text-ember-ink"}>
            {progressPercent.toFixed(1)}% complete
          </span>
          <span>{totalDeficit.toLocaleString()}</span>
        </div>
      </div>

      {/* kg row */}
      <div className="grid grid-cols-3 divide-x divide-ember-card-border border-y border-ember-card-border mb-6 ">
        <div className="px-4 py-3 first:pl-0">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">Goal</p>
          <p className="text-lg text-ember-ink tabular-nums">{weightToLose.toFixed(1)} <span className="text-xs text-ember-muted">kg</span></p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">Lost</p>
          <p className="text-lg text-ember-amber tabular-nums">{kgBurned.toFixed(2)} <span className="text-xs text-ember-muted">kg</span></p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">Left</p>
          <p className="text-lg text-ember-ink tabular-nums">{kgRemaining.toFixed(2)} <span className="text-xs text-ember-muted">kg</span></p>
        </div>
      </div>

      {/* Math breakdown */}
      <div className="space-y-2 ">
        <p className="uppercase tracking-[0.15em] text-xs text-ember-muted mb-3">The math</p>
        <div className="flex justify-between text-sm">
          <span className="text-ember-muted">{weightToLose} kg × 7,700 kcal</span>
          <span className="text-ember-ink tabular-nums">{totalDeficit.toLocaleString()} kcal</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ember-muted">Burned so far</span>
          <span className="text-ember-ink tabular-nums">{burnedSoFar.toLocaleString()} kcal</span>
        </div>
        {avgDailyDeficit !== undefined && loggedDays !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-ember-muted">Avg over {loggedDays} days</span>
            <span className="text-ember-ink tabular-nums">{Math.round(avgDailyDeficit).toLocaleString()} kcal/day</span>
          </div>
        )}
        <div className="h-px bg-ember-card-border my-1" />
        <div className="flex justify-between text-sm">
          <span className="text-ember-muted">Remaining</span>
          <span className="text-ember-amber tabular-nums">{remaining.toLocaleString()} kcal</span>
        </div>
      </div>
    </div>
  )
}