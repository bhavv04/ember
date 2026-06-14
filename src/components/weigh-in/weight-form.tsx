"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { WeighIn } from "@/types"

interface Props {
  baselineTdee?: number
  onSaved?: (entry: WeighIn) => void
}

export function WeightForm({ baselineTdee, onSaved }: Props) {
  const router = useRouter()
  const [weight, setWeight] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit() {
    if (!weight) return
    setLoading(true)

    const res = await fetch("/api/weigh-ins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weightKg: parseFloat(weight) }),
    })

    const entry = await res.json()
    setSaved(true)
    setLoading(false)
    onSaved?.(entry)

    setTimeout(() => router.push("/dashboard"), 800)
  }

  return (
    <Card>
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Today's weight
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="e.g. 88.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              disabled={saved}
            />
          </div>

          {/* Live TDEE impact preview */}
          {baselineTdee && weight && (
            <div className="rounded-xl bg-muted/50 border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                current TDEE
              </p>
              <p className="text-lg font-bold">{baselineTdee.toLocaleString()} kcal</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                will recalibrate after 2+ weigh-ins
              </p>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          disabled={!weight || loading || saved}
          onClick={handleSubmit}
        >
          {saved ? "✓ Saved — redirecting..." : loading ? "Saving..." : "Save weigh-in"}
        </Button>
      </CardContent>
    </Card>
  )
}