"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LogPage() {
  const router = useRouter()
  const [caloriesEaten, setCaloriesEaten] = useState("")
  const [tdeeForDay, setTdeeForDay] = useState("")
  const [loading, setLoading] = useState(false)
  const [baselineTdee, setBaselineTdee] = useState<number | null>(null)

  useEffect(() => {
    async function fetchGoal() {
      const res = await fetch("/api/goals")
      const goal = await res.json()
      if (goal?.baselineTdee) {
        setTdeeForDay(goal.baselineTdee.toString())
        setBaselineTdee(goal.baselineTdee)
      }
    }
    fetchGoal()
  }, [])

  const netDeficit = tdeeForDay && caloriesEaten
    ? parseInt(tdeeForDay) - parseInt(caloriesEaten)
    : null

  async function handleSubmit() {
    if (!caloriesEaten || !tdeeForDay) return
    setLoading(true)

    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caloriesEaten: parseInt(caloriesEaten),
        tdeeForDay: parseInt(tdeeForDay),
      }),
    })

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Log today</h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-CA", {
              weekday: "long", year: "numeric",
              month: "long", day: "numeric"
            })}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's intake</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Calories eaten</Label>
              <Input
                type="number"
                placeholder="e.g. 1800"
                value={caloriesEaten}
                onChange={(e) => setCaloriesEaten(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>
                TDEE today
                {baselineTdee && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (baseline: {baselineTdee} kcal)
                  </span>
                )}
              </Label>
              <Input
                type="number"
                placeholder="e.g. 2500"
                value={tdeeForDay}
                onChange={(e) => setTdeeForDay(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Increase this if you worked out today
              </p>
            </div>

            {netDeficit !== null && (
              <div className={`rounded-lg p-4 ${netDeficit > 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <p className="text-sm text-muted-foreground">Net deficit today</p>
                <p className={`text-2xl font-bold ${netDeficit > 0 ? "text-green-500" : "text-red-500"}`}>
                  {netDeficit > 0 ? "+" : ""}{netDeficit.toLocaleString()} kcal
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {netDeficit > 0
                    ? "You're in a deficit — good work"
                    : "You're over your TDEE today"}
                </p>
              </div>
            )}

            <Button
              className="w-full"
              disabled={!caloriesEaten || !tdeeForDay || loading}
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : "Save log"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}