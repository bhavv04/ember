"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { calculateTDEE } from "@/lib/tdee"
import {
  type UnitSystem,
  getStoredUnitSystem,
  setStoredUnitSystem,
  kgToLbs,
  lbsToKg,
  feetInchesToCm,
} from "@/lib/units"
import { UnitsSection } from "@/components/settings/units-section"
import { GoalStep } from "@/components/settings/goal-step"
import { TdeeStep } from "@/components/settings/tdee-step"
import { AccountSection } from "@/components/settings/account-section"
import { DataSection } from "@/components/settings/data-section"

interface Goal {
  id: string
  targetWeightKg: number
  startWeightKg: number
  baselineTdee: number
}

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()

  const [step, setStep] = useState<"goal" | "tdee">("goal")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [existingGoal, setExistingGoal] = useState<Goal | null>(null)

  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric")
  const [currentWeight, setCurrentWeight] = useState("")
  const [targetWeight, setTargetWeight] = useState("")
  const [currentWeightLbs, setCurrentWeightLbs] = useState("")
  const [targetWeightLbs, setTargetWeightLbs] = useState("")
  const [age, setAge] = useState("")
  const [heightCm, setHeightCm] = useState("")
  const [heightFeet, setHeightFeet] = useState("")
  const [heightInches, setHeightInches] = useState("")
  const [sex, setSex] = useState<"male" | "female">("male")
  const [activityLevel, setActivityLevel] = useState("moderate")
  const [calculatedTdee, setCalculatedTdee] = useState<number | null>(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    setUnitSystem(getStoredUnitSystem())

    async function fetchGoal() {
      try {
        const res = await fetch("/api/goals")
        const goal = await res.json()
        if (goal) {
          setExistingGoal(goal)
          setCurrentWeight(String(goal.startWeightKg))
          setTargetWeight(String(goal.targetWeightKg))
          setCurrentWeightLbs(kgToLbs(goal.startWeightKg).toFixed(1))
          setTargetWeightLbs(kgToLbs(goal.targetWeightKg).toFixed(1))
          setCalculatedTdee(goal.baselineTdee)
        }
      } catch (err) {
        console.error("Failed to load existing goal:", err)
      } finally {
        setFetching(false)
      }
    }
    fetchGoal()
  }, [])

  function handleUnitToggle(next: UnitSystem) {
    setUnitSystem(next)
    setStoredUnitSystem(next)
  }

  function handleCurrentWeightChange(value: string) {
    if (unitSystem === "imperial") {
      setCurrentWeightLbs(value)
      const lbs = parseFloat(value)
      setCurrentWeight(!isNaN(lbs) ? lbsToKg(lbs).toFixed(1) : "")
    } else {
      setCurrentWeight(value)
      const kg = parseFloat(value)
      setCurrentWeightLbs(!isNaN(kg) ? kgToLbs(kg).toFixed(1) : "")
    }
  }

  function handleTargetWeightChange(value: string) {
    if (unitSystem === "imperial") {
      setTargetWeightLbs(value)
      const lbs = parseFloat(value)
      setTargetWeight(!isNaN(lbs) ? lbsToKg(lbs).toFixed(1) : "")
    } else {
      setTargetWeight(value)
      const kg = parseFloat(value)
      setTargetWeightLbs(!isNaN(kg) ? kgToLbs(kg).toFixed(1) : "")
    }
  }

  useEffect(() => {
    if (unitSystem === "imperial") {
      const feet = parseFloat(heightFeet)
      const inches = parseFloat(heightInches)
      if (!isNaN(feet) && !isNaN(inches)) {
        setHeightCm(feetInchesToCm(feet, inches).toFixed(0))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heightFeet, heightInches])

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
    setSaveError(null)

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startWeightKg: parseFloat(currentWeight),
          targetWeightKg: parseFloat(targetWeight),
          baselineTdee: calculatedTdee,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Failed to save goal: ${res.status} ${text}`)
      }

      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      setSaveError("Couldn't save your goal. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteData() {
    setDeleting(true)
    try {
      const res = await fetch("/api/goals", { method: "DELETE" })
      if (!res.ok) throw new Error(`Failed to delete: ${res.status}`)
      router.push("/settings")
      router.refresh()
    } catch (err) {
      console.error("Failed to delete data:", err)
    } finally {
      setDeleting(false)
      setDeleteConfirmOpen(false)
    }
  }

  async function handleExportCsv() {
    setExporting(true)
    try {
      const res = await fetch("/api/logs")
      const logs: Array<{ date: string; caloriesEaten: number; tdeeForDay: number; netDeficit: number }> =
        await res.json()

      const header = "date,caloriesEaten,tdeeForDay,netDeficit"
      const rows = logs.map(
        (l) => `${l.date.split("T")[0]},${l.caloriesEaten},${l.tdeeForDay},${l.netDeficit}`
      )
      const csv = [header, ...rows].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ember-logs-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to export logs:", err)
    } finally {
      setExporting(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ember-page">
        <div className="w-5 h-5 border border-ember-amber border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex justify-center px-6 sm:px-10 py-12 sm:py-16 bg-ember-page min-h-screen">
      <div className="w-full max-w-2xl font-mono">
        {/* --- Header --- */}
        <div className="mb-8 pb-8 border-b border-ember-card-border">
          <p className="text-sm text-ember-muted mb-2">
            {existingGoal ? "Configuration" : "Setup"}
          </p>
          <h1 className="text-3xl font-semibold text-ember-ink">
            {existingGoal ? "Settings" : "Set your goal"}
          </h1>
          <p className="text-sm text-ember-muted mt-2">
            {existingGoal
              ? "Update your goal, units, and account."
              : "Ember will calculate exactly what it takes to get there."}
          </p>
        </div>

        <UnitsSection unitSystem={unitSystem} onToggle={handleUnitToggle} />

        {step === "goal" && (
          <GoalStep
            unitSystem={unitSystem}
            currentWeight={currentWeight}
            targetWeight={targetWeight}
            currentWeightLbs={currentWeightLbs}
            targetWeightLbs={targetWeightLbs}
            existingGoal={!!existingGoal}
            onCurrentWeightChange={handleCurrentWeightChange}
            onTargetWeightChange={handleTargetWeightChange}
            onNext={() => setStep("tdee")}
          />
        )}

        {step === "tdee" && (
          <TdeeStep
            unitSystem={unitSystem}
            age={age}
            heightCm={heightCm}
            heightFeet={heightFeet}
            heightInches={heightInches}
            sex={sex}
            activityLevel={activityLevel}
            calculatedTdee={calculatedTdee}
            saveError={saveError}
            loading={loading}
            existingGoal={!!existingGoal}
            onAgeChange={setAge}
            onHeightCmChange={setHeightCm}
            onHeightFeetChange={setHeightFeet}
            onHeightInchesChange={setHeightInches}
            onSexChange={setSex}
            onActivityLevelChange={setActivityLevel}
            onCalculate={handleCalculateTdee}
            onBack={() => setStep("goal")}
            onSubmit={handleSubmit}
          />
        )}

        {existingGoal && (
          <AccountSection
            userLabel={user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? null}
            onSignOut={() => signOut(() => router.push("/"))}
          />
        )}

        {existingGoal && (
          <DataSection
            exporting={exporting}
            onExportCsv={handleExportCsv}
            deleteConfirmOpen={deleteConfirmOpen}
            deleting={deleting}
            onDeleteConfirmOpenChange={setDeleteConfirmOpen}
            onDelete={handleDeleteData}
          />
        )}
      </div>
    </div>
  )
}