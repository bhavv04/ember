"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UnitSystem } from "@/lib/units"

interface GoalStepProps {
  unitSystem: UnitSystem
  currentWeight: string
  targetWeight: string
  currentWeightLbs: string
  targetWeightLbs: string
  existingGoal: boolean
  onCurrentWeightChange: (value: string) => void
  onTargetWeightChange: (value: string) => void
  onNext: () => void
}

export function GoalStep({
  unitSystem,
  currentWeight,
  targetWeight,
  currentWeightLbs,
  targetWeightLbs,
  existingGoal,
  onCurrentWeightChange,
  onTargetWeightChange,
  onNext,
}: GoalStepProps) {
  const totalDeficit =
    (parseFloat(currentWeight) - parseFloat(targetWeight)) * 7700

  return (
    <section className="pb-8 mb-8 border-b border-ember-card-border">
      <h2 className="text-sm font-medium text-ember-muted mb-5">
        Fig. 02 — Your weight
      </h2>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label className="text-sm uppercase text-ember-muted font-normal font-mono">
            Current weight ({unitSystem === "imperial" ? "lb" : "kg"})
          </Label>
          <Input
            type="number"
            placeholder={unitSystem === "imperial" ? "e.g. 198" : "e.g. 90"}
            value={unitSystem === "imperial" ? currentWeightLbs : currentWeight}
            onChange={(e) => onCurrentWeightChange(e.target.value)}
            className="rounded-none border-0 border-b border-ember-card-border px-0 font-mono text-ember-ink focus-visible:ring-0 focus-visible:border-ember-amber"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm uppercase text-ember-muted font-normal font-mono">
            Target weight ({unitSystem === "imperial" ? "lb" : "kg"})
          </Label>
          <Input
            type="number"
            placeholder={unitSystem === "imperial" ? "e.g. 165" : "e.g. 75"}
            value={unitSystem === "imperial" ? targetWeightLbs : targetWeight}
            onChange={(e) => onTargetWeightChange(e.target.value)}
            className="rounded-none border-0 border-b border-ember-card-border px-0 font-mono text-ember-ink focus-visible:ring-0 focus-visible:border-ember-amber"
          />
        </div>

        {currentWeight && targetWeight && (
          <div className="pt-2">
            <p className="text-sm uppercase text-ember-muted">Total deficit needed</p>
            <p className="text-2xl mt-1 text-ember-ink tabular-nums">
              {totalDeficit.toLocaleString()} kcal
            </p>
            <p className="text-xs text-ember-muted mt-1">
              {(parseFloat(currentWeight) - parseFloat(targetWeight)).toFixed(1)} kg × 7,700 kcal/kg
            </p>
          </div>
        )}

        <Button
          className="w-full rounded-none bg-ember-ink hover:opacity-90 text-ember-page text-xs uppercase"
          disabled={!currentWeight || !targetWeight}
          onClick={onNext}
        >
          Next — {existingGoal ? "review your TDEE" : "calculate your TDEE"}
        </Button>
      </div>
    </section>
  )
}