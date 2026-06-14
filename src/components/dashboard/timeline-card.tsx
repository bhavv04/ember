import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  projectedDate: string
  avgDailyDeficit: number
  daysRemaining: number
}

export function TimelineCard({ projectedDate, avgDailyDeficit, daysRemaining }: Props) {
  const weeksRemaining = Math.ceil(daysRemaining / 7)
  const monthsRemaining = (daysRemaining / 30.4).toFixed(1)

  // Pace assessment
  const pace =
    avgDailyDeficit >= 700 ? { label: "Aggressive", color: "text-red-500", bg: "bg-red-500/10" } :
    avgDailyDeficit >= 400 ? { label: "On track", color: "text-green-500", bg: "bg-green-500/10" } :
    avgDailyDeficit >= 200 ? { label: "Moderate", color: "text-orange-500", bg: "bg-orange-500/10" } :
    { label: "Slow", color: "text-muted-foreground", bg: "bg-muted" }

  // What if scenarios
  const scenarios = [
    { label: "At 300 kcal/day", days: null as number | null },
    { label: "At 500 kcal/day", days: null as number | null },
    { label: "At 700 kcal/day", days: null as number | null },
  ]

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Projected goal date</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col flex-1">

        {/* Main date */}
        <div>
          <p className="text-2xl font-bold tracking-tight leading-none">{projectedDate}</p>
          <p className="text-xs text-muted-foreground mt-1.5">
            at your current pace
          </p>
        </div>

        {/* Pace badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit ${pace.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${pace.color.replace("text-", "bg-")}`} />
          <span className={`text-xs font-semibold ${pace.color}`}>{pace.label} pace</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className={`text-xs font-semibold ${pace.color}`}>{avgDailyDeficit.toFixed(0)} kcal/day</span>
        </div>

        {/* Time breakdown */}
        <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
          <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">
            time remaining
          </p>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Days</span>
            <span className="font-bold">{daysRemaining.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weeks</span>
            <span className="font-bold">{weeksRemaining}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Months</span>
            <span className="font-bold">{monthsRemaining}</span>
          </div>
        </div>

        {/* What if scenarios */}
        <div className="space-y-1 mt-auto">
          <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">
            what if
          </p>
          {[
            { label: "300 kcal/day deficit", days: Math.ceil((daysRemaining * avgDailyDeficit) / 300) },
            { label: "500 kcal/day deficit", days: Math.ceil((daysRemaining * avgDailyDeficit) / 500) },
            { label: "700 kcal/day deficit", days: Math.ceil((daysRemaining * avgDailyDeficit) / 700) },
          ].map((s) => (
            <div key={s.label} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-medium">{s.days} days</span>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  )
}