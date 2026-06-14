import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  weightToLose: number
  totalDeficit: number
  burnedSoFar: number
  remaining: number
  progressPercent: number
}

export function ProgressCard({ weightToLose, totalDeficit, burnedSoFar, remaining, progressPercent }: Props) {
  const milestones = [25, 50, 75, 100]

  return (
    <Card className="flex flex-col h-full">
      <CardHeader><CardTitle>Progress</CardTitle></CardHeader>
      <CardContent className="space-y-4">

        {/* Big numbers */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">burned so far</p>
            <p className="text-4xl font-bold tabular-nums tracking-tight text-orange-500">
              {burnedSoFar.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">kcal</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">remaining</p>
            <p className="text-2xl font-bold tabular-nums tracking-tight">
              {remaining.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">kcal</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="relative w-full">
            {/* Track */}
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-orange-500 transition-all duration-1000 relative"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Glowing tip */}
                {progressPercent > 2 && (
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-orange-400"
                    style={{ boxShadow: "0 0 8px 3px rgba(249,115,22,0.5)" }}
                  />
                )}
              </div>
            </div>

            {/* Milestone markers */}
            {milestones.map((m) => (
              <div
                key={m}
                className="absolute top-0 h-3 flex flex-col items-center"
                style={{ left: `${m}%`, transform: "translateX(-50%)" }}
              >
                <div className={`w-0.5 h-3 ${progressPercent >= m ? "bg-orange-300/50" : "bg-border"}`} />
              </div>
            ))}
          </div>

          {/* Milestone labels */}
          <div className="relative w-full h-4">
            {milestones.map((m) => (
              <div
                key={m}
                className="absolute flex flex-col items-center"
                style={{ left: `${m}%`, transform: "translateX(-50%)" }}
              >
                <span className={`text-xs tabular-nums ${progressPercent >= m ? "text-orange-500 font-semibold" : "text-muted-foreground/50"}`}>
                  {m}%
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 kcal</span>
            <span className={`font-semibold ${progressPercent >= 100 ? "text-green-500" : "text-foreground"}`}>
              {progressPercent.toFixed(1)}% complete
            </span>
            <span>{totalDeficit.toLocaleString()} kcal</span>
          </div>
        </div>

        {/* Math breakdown */}
        <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
          <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">The math</p>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{weightToLose} kg × 7,700 kcal</span>
            <span className="font-bold">{totalDeficit.toLocaleString()} kcal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Burned so far</span>
            <span className="font-bold">{burnedSoFar.toLocaleString()} kcal</span>
          </div>
          <div className="h-px bg-border my-1" />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-bold text-orange-500">{remaining.toLocaleString()} kcal</span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}