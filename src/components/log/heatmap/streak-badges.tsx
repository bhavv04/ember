import { Flame, Trophy } from "lucide-react"

interface Props {
  currentStreak: number
  bestStreak: number
}

export function StreakBadges({ currentStreak, bestStreak }: Props) {
  return (
    <div className="flex items-center gap-6 font-mono text-xs border-y border-ember-card-border py-3">
      <div className="flex items-center gap-2">
        <Flame size={13} className="text-ember-amber" strokeWidth={1.5} />
        <span className="text-ember-muted uppercase tracking-wide">Current</span>
        <span className="text-ember-ink tabular-nums">
          {currentStreak} day{currentStreak !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Trophy size={13} className="text-ember-muted" strokeWidth={1.5} />
        <span className="text-ember-muted uppercase tracking-wide">Best</span>
        <span className="text-ember-ink tabular-nums">
          {bestStreak} day{bestStreak !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  )
}