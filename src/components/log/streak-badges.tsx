import { Flame, Trophy } from "lucide-react"

interface Props {
  currentStreak: number
  bestStreak: number
}

export function StreakBadges({ currentStreak, bestStreak }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-ember-amber/10 px-3 py-1 text-xs">
        <Flame size={12} className="text-ember-amber" strokeWidth={1.5} />
        <span className="text-ember-muted">Current</span>
        <span className="text-ember-amber">
          {currentStreak} day{currentStreak !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-ember-forest-pale px-3 py-1 text-xs">
        <Trophy size={12} className="text-ember-forest" strokeWidth={1.5} />
        <span className="text-ember-muted">Best</span>
        <span className="text-ember-forest">
          {bestStreak} day{bestStreak !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  )
}