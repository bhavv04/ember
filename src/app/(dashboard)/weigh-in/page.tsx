"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WeighIn {
  id: string
  date: string
  weightKg: number
}

export default function WeighInPage() {
  const router = useRouter()
  const [weight, setWeight] = useState("")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<WeighIn[]>([])

  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch("/api/weigh-ins")
      const data = await res.json()
      setHistory(data)
    }
    fetchHistory()
  }, [])

  async function handleSubmit() {
    if (!weight) return
    setLoading(true)

    await fetch("/api/weigh-ins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weightKg: parseFloat(weight) }),
    })

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Weigh in</h1>
          <p className="text-muted-foreground mt-1">
            Weekly weigh-ins help Ember recalibrate your TDEE
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's weight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g. 88.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={!weight || loading}
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : "Save weigh-in"}
            </Button>
          </CardContent>
        </Card>

        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.slice(0, 6).map((entry) => (
                <div key={entry.id} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                  <span className="text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("en-CA", {
                      month: "short", day: "numeric"
                    })}
                  </span>
                  <span className="font-medium">{entry.weightKg} kg</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}