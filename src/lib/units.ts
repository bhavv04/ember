// lib/units.ts
// Suggested location: lib/units.ts
// Client-side only — preference is stored in localStorage, not the DB.

export type UnitSystem = "metric" | "imperial"

const STORAGE_KEY = "ember:unitSystem"

export function getStoredUnitSystem(): UnitSystem {
  if (typeof window === "undefined") return "metric"
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === "imperial" ? "imperial" : "metric"
}

export function setStoredUnitSystem(system: UnitSystem) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, system)
}

// --- Weight ---
export function kgToLbs(kg: number): number {
  return kg * 2.2046226218
}

export function lbsToKg(lbs: number): number {
  return lbs / 2.2046226218
}

// --- Height ---
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return { feet, inches }
}

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54
}

// --- Display helpers (round for UI, keep raw values for storage/calc) ---
export function formatWeight(kg: number, system: UnitSystem): string {
  if (system === "imperial") return `${kgToLbs(kg).toFixed(1)} lb`
  return `${kg.toFixed(1)} kg`
}

export function formatHeight(cm: number, system: UnitSystem): string {
  if (system === "imperial") {
    const { feet, inches } = cmToFeetInches(cm)
    return `${feet}'${inches}"`
  }
  return `${cm.toFixed(0)} cm`
}