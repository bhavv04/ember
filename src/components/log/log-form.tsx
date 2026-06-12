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

function NetDeficitPreview({
  caloriesEaten,
  tdeeForDay,
}: {
  caloriesEaten: string
  tdeeForDay: string
}) {
  const eaten = parseFloat(caloriesEaten)
  const tdee = parseFloat(tdeeForDay)

  if (!eaten || !tdee) return null

  const net = tdee - eaten
  const isDeficit = net > 0
  const label = isDeficit ? "deficit" : net === 0 ? "break even" : "surplus"
  const colorClass = isDeficit
    ? "text-green-600 dark:text-green-400"
    : net === 0
    ? "text-yellow-600 dark:text-yellow-400"
    : "text-red-500"

  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3.5 py-2.5 text-sm">
      <span className="text-muted-foreground">Today's net</span>
      <span className={`font-semibold tabular-nums ${colorClass}`}>
        {isDeficit ? "+" : ""}
        {net.toLocaleString()} kcal{" "}
        <span className="font-normal text-xs opacity-75">({label})</span>
      </span>
    </div>
  )
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
  const canSubmit = !!caloriesEaten && !!tdeeForDay && !loading

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pt-5 px-5 pb-3">
        <CardTitle className="text-base font-medium">Log today</CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Calories eaten */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Calories eaten
            </Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="1800"
                value={caloriesEaten}
                onChange={(e) => onCaloriesEatenChange(e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                kcal
              </span>
            </div>
          </div>

          {/* TDEE */}
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                TDEE
              </Label>
              {baselineTdee && (
                <button
                  type="button"
                  onClick={() => onTdeeForDayChange(String(baselineTdee))}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  tabIndex={0}
                >
                  Use baseline ({baselineTdee.toLocaleString()})
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder={baselineTdee ? String(baselineTdee) : "2200"}
                value={tdeeForDay}
                onChange={(e) => onTdeeForDayChange(e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                kcal
              </span>
            </div>
          </div>
        </div>

        {/* Live net preview */}
        <NetDeficitPreview caloriesEaten={caloriesEaten} tdeeForDay={tdeeForDay} />

        <Button
          className="w-full"
          disabled={!canSubmit}
          onClick={onSubmit}
          type="button"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-3.5 w-3.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving…
            </span>
          ) : (
            "Save log"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}