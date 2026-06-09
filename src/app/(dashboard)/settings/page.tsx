"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateTDEE } from "@/lib/tdee"
import { ACTIVITY_LABELS } from "@/lib/constants"

export default function SettingsPage() {
  const router = useRouter()
  const [step, setStep] = useState<"goal" | "tdee">("goal")
  const [loading, setLoading] = useState(false)

  const [currentWeight, setCurrentWeight] = useState("")
  const [targetWeight, setTargetWeight] = useState("")

  const [age, setAge] = useState("")
  const [heightCm, setHeightCm] = useState("")
  const [sex, setSex] = useState<"male" | "female">("male")
  const [activityLevel, setActivityLevel] = useState("moderate")
  const [calculatedTdee, setCalculatedTdee] = useState<number | null>(null)

  const totalDeficit =
    (parseFloat(currentWeight) - parseFloat(targetWeight)) * 7700

  function handleCalculateTdee() {
    const tdee = calculateTDEE({
      weightKg: parseFloat(currentWeight),
      heightCm: parseFloat(heightCm),
      age: parseInt(age),
      sex,
      activityLevel: activityLevel as any,
    })
    setCalculatedTdee(tdee)
  }

  async function handleSubmit() {
    if (!calculatedTdee) return
    setLoading(true)

    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startWeightKg: parseFloat(currentWeight),
        targetWeightKg: parseFloat(targetWeight),
        baselineTdee: calculatedTdee,
      }),
    })

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Set your goal</h1>
          <p className="text-muted-foreground mt-1">
            Ember will calculate exactly what it takes to get there.
          </p>
        </div>

        {step === "goal" && (
          <Card>
            <CardHeader>
              <CardTitle>Your weight</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 90"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Target weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 75"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                />
              </div>

              {currentWeight && targetWeight && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Total deficit needed</p>
                  <p className="text-2xl font-bold">
                    {totalDeficit.toLocaleString()} kcal
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(parseFloat(currentWeight) - parseFloat(targetWeight)).toFixed(1)} kg × 7,700 kcal/kg
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                disabled={!currentWeight || !targetWeight}
                onClick={() => setStep("tdee")}
              >
                Next — calculate your TDEE
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "tdee" && (
          <Card>
            <CardHeader>
              <CardTitle>Your daily calorie burn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 175"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sex</Label>
                <div className="flex gap-2">
                  {(["male", "female"] as const).map((s) => (
                    <Button
                      key={s}
                      variant={sex === s ? "default" : "outline"}
                      className="flex-1 capitalize"
                      onClick={() => setSex(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Activity level</Label>
                <div className="space-y-2">
                  {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setActivityLevel(key)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm border transition-colors ${
                        activityLevel === key
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                variant="outline"
                disabled={!age || !heightCm}
                onClick={handleCalculateTdee}
              >
                Calculate TDEE
              </Button>

              {calculatedTdee && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Your estimated TDEE</p>
                  <p className="text-2xl font-bold">{calculatedTdee.toLocaleString()} kcal/day</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This will auto-adjust as you log weekly weigh-ins
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("goal")}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={!calculatedTdee || loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Saving..." : "Start tracking"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}