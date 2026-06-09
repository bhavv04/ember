import { ACTIVITY_MULTIPLIERS } from "./constants"

export function calculateBMR({
  weightKg,
  heightCm,
  age,
  sex,
}: {
  weightKg: number
  heightCm: number
  age: number
  sex: "male" | "female"
}) {
  // Mifflin-St Jeor equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === "male" ? base + 5 : base - 161
}

export function calculateTDEE({
  weightKg,
  heightCm,
  age,
  sex,
  activityLevel,
}: {
  weightKg: number
  heightCm: number
  age: number
  sex: "male" | "female"
  activityLevel: keyof typeof ACTIVITY_MULTIPLIERS
}) {
  const bmr = calculateBMR({ weightKg, heightCm, age, sex })
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel])
}