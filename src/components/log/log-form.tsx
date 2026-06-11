"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  caloriesEaten: string
  tdeeForDay: string
  baselineTdee: number | null
  loading: boolean
  onCaloriesEatenChange: (value: string) => void
  onTdeeForDayChange: (value: string) => void
  onSubmit: () => void
}

export function LogForm({
  caloriesEaten,
  tdeeForDay,
  baselineTdee,
  loading,
  onCaloriesEatenChange,
  onTdeeForDayChange,
  onSubmit,
}: Props) {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="pt-5 px-5">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
          Today's intake
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Calories eaten</Label>
            <Input
              type="number"
              placeholder="e.g. 1800"
              value={caloriesEaten}
              onChange={(e) => onCaloriesEatenChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>
              TDEE
              {baselineTdee && (
                <span className="text-xs text-muted-foreground ml-2">
                  (baseline: {baselineTdee})
                </span>
              )}
            </Label>
            <Input
              type="number"
              placeholder="e.g. 2500"
              value={tdeeForDay}
              onChange={(e) => onTdeeForDayChange(e.target.value)}
            />
          </div>
        </div>
        <Button
          className="w-full"
          disabled={!caloriesEaten || !tdeeForDay || loading}
          onClick={onSubmit}
          type="button"
        >
          {loading ? "Saving..." : "Save log"}
        </Button>
      </CardContent>
    </Card>
  )
}