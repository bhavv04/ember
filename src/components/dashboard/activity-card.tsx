import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ACTIVITIES } from "@/lib/constants"

interface Props {
  remaining: number
}

export function ActivityCard({ remaining }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>To burn the rest you could</CardTitle>
        <p className="text-sm text-muted-foreground">Based on {remaining.toLocaleString()} kcal remaining</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {ACTIVITIES.map((activity) => (
          <div key={activity.label} className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <p className="font-medium text-sm">{activity.label}</p>
              <p className="text-xs text-muted-foreground">{activity.sub(remaining)}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{activity.convert(remaining)}</p>
              <p className="text-xs text-muted-foreground">{activity.unit}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}