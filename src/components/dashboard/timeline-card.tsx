import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  projectedDate: string
  avgDailyDeficit: number
  daysRemaining: number
}

export function TimelineCard({ projectedDate, avgDailyDeficit, daysRemaining }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle>Projected goal date</CardTitle></CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{projectedDate}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your average daily deficit of {avgDailyDeficit.toFixed(0)} kcal — {daysRemaining} days from today
        </p>
      </CardContent>
    </Card>
  )
}