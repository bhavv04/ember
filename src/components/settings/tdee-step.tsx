"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ACTIVITY_LABELS } from "@/lib/constants"
import type { UnitSystem } from "@/lib/units"

interface TdeeStepProps {
  unitSystem: UnitSystem
  age: string
  heightCm: string
  heightFeet: string
  heightInches: string
  sex: "male" | "female"
  activityLevel: string
  calculatedTdee: number | null
  saveError: string | null
  loading: boolean
  existingGoal: boolean
  onAgeChange: (value: string) => void
  onHeightCmChange: (value: string) => void
  onHeightFeetChange: (value: string) => void
  onHeightInchesChange: (value: string) => void
  onSexChange: (value: "male" | "female") => void
  onActivityLevelChange: (value: string) => void
  onCalculate: () => void
  onBack: () => void
  onSubmit: () => void
}

export function TdeeStep({
  unitSystem,
  age,
  heightCm,
  heightFeet,
  heightInches,
  sex,
  activityLevel,
  calculatedTdee,
  saveError,
  loading,
  existingGoal,
  onAgeChange,
  onHeightCmChange,
  onHeightFeetChange,
  onHeightInchesChange,
  onSexChange,
  onActivityLevelChange,
  onCalculate,
  onBack,
  onSubmit,
}: TdeeStepProps) {
  return (
    <section className="pb-8 mb-8 border-b border-ember-card-border">
      <h2 className="text-sm font-medium text-ember-muted mb-5">
        Fig. 02 — Daily calorie burn
      </h2>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.15em] text-ember-muted font-normal font-mono">
              Age
            </Label>
            <Input
              type="number"
              placeholder="e.g. 28"
              value={age}
              onChange={(e) => onAgeChange(e.target.value)}
              className="rounded-none border-0 border-b border-ember-card-border px-0 font-mono text-ember-ink focus-visible:ring-0 focus-visible:border-ember-amber"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.15em] text-ember-muted font-normal font-mono">
              Height {unitSystem === "imperial" ? "(ft/in)" : "(cm)"}
            </Label>
            {unitSystem === "imperial" ? (
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="ft"
                  value={heightFeet}
                  onChange={(e) => onHeightFeetChange(e.target.value)}
                  className="rounded-none border-0 border-b border-ember-card-border px-0 font-mono text-ember-ink focus-visible:ring-0 focus-visible:border-ember-amber"
                />
                <Input
                  type="number"
                  placeholder="in"
                  value={heightInches}
                  onChange={(e) => onHeightInchesChange(e.target.value)}
                  className="rounded-none border-0 border-b border-ember-card-border px-0 font-mono text-ember-ink focus-visible:ring-0 focus-visible:border-ember-amber"
                />
              </div>
            ) : (
              <Input
                type="number"
                placeholder="e.g. 175"
                value={heightCm}
                onChange={(e) => onHeightCmChange(e.target.value)}
                className="rounded-none border-0 border-b border-ember-card-border px-0 font-mono text-ember-ink focus-visible:ring-0 focus-visible:border-ember-amber"
              />
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-ember-muted font-normal font-mono">
            Sex
          </Label>
          <div className="flex gap-1 text-sm">
            {(["male", "female"] as const).map((s, i) => (
              <button
                key={s}
                onClick={() => onSexChange(s)}
                className={`capitalize px-0 py-1 ${i === 1 ? "ml-6" : ""} border-b transition-colors ${
                  sex === s
                    ? "border-ember-amber text-ember-ink"
                    : "border-transparent text-ember-muted hover:text-ember-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-[0.15em] text-ember-muted font-normal font-mono">
            Activity level
          </Label>
          <div className="space-y-0.5">
            {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onActivityLevelChange(key)}
                className={`w-full text-left py-2 text-sm transition-colors ${
                  activityLevel === key
                    ? "text-ember-ink font-medium"
                    : "text-ember-muted hover:text-ember-ink"
                }`}
              >
                {activityLevel === key ? "→ " : "　 "}
                {label}
              </button>
            ))}
          </div>
        </div>

        <Button
          className="w-full rounded-none text-xs uppercase tracking-wide font-mono border-ember-card-border text-ember-ink hover:bg-ember-card-border/20"
          variant="outline"
          disabled={!age || !heightCm}
          onClick={onCalculate}
        >
          Calculate TDEE
        </Button>

        {calculatedTdee && (
          <div className="pt-2">
            <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted">
              {existingGoal ? "Current TDEE" : "Your estimated TDEE"}
            </p>
            <p className="text-2xl mt-1 text-ember-ink tabular-nums">
              {calculatedTdee.toLocaleString()} kcal/day
            </p>
            <p className="text-xs text-ember-muted mt-1">
              This will auto-adjust as you log weekly weigh-ins
            </p>
          </div>
        )}

        {saveError && (
          <p className="text-sm text-ember-amber">{saveError}</p>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-none text-xs uppercase tracking-wide font-mono border-ember-card-border text-ember-ink hover:bg-ember-card-border/20"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            className="flex-1 rounded-none bg-ember-ink hover:opacity-90 text-ember-page text-xs uppercase tracking-wide font-mono"
            disabled={!calculatedTdee || loading}
            onClick={onSubmit}
          >
            {loading ? "Saving..." : existingGoal ? "Save changes" : "Start tracking"}
          </Button>
        </div>
      </div>
    </section>
  )
}