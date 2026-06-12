interface Props {
  currentStreak: number
  bestStreak: number
}

export function StreakBadges({ currentStreak, bestStreak }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
        <span>🔥</span>
        <span>Current</span>
        <span className="font-medium text-foreground">
          {currentStreak} day{currentStreak !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
        <span>🏆</span>
        <span>Best</span>
        <span className="font-medium text-foreground">
          {bestStreak} day{bestStreak !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  )
}