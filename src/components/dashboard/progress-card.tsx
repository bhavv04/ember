import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  weightToLose: number
  totalDeficit: number
  burnedSoFar: number
  remaining: number
  progressPercent: number
}

export function ProgressCard({ weightToLose, totalDeficit, burnedSoFar, remaining, progressPercent }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle>Progress</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Burned so far</span>
            <span className="font-medium">{burnedSoFar.toLocaleString()} / {totalDeficit.toLocaleString()} kcal</span>
          </div>
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div className="h-4 rounded-full bg-orange-500 transition-all duration-700" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progressPercent.toFixed(1)}% complete</span>
            <span>{remaining.toLocaleString()} kcal remaining</span>
          </div>
        </div>
        <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
          <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">The math</p>
          <p>{weightToLose} kg × 7,700 kcal = <span className="font-bold">{totalDeficit.toLocaleString()} kcal total</span></p>
          <p>Burned so far: <span className="font-bold">{burnedSoFar.toLocaleString()} kcal</span></p>
          <p>Remaining: <span className="font-bold text-orange-500">{remaining.toLocaleString()} kcal</span></p>
        </div>
      </CardContent>
    </Card>
  )
}