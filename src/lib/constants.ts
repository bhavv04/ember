export const KCAL_PER_KG = 7700

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Sedentary (desk job, little exercise)",
  light: "Lightly active (1-3 days/week)",
  moderate: "Moderately active (3-5 days/week)",
  active: "Very active (6-7 days/week)",
  very_active: "Athlete (2x training per day)",
}

// Add this to your constants.ts
export const ACTIVITIES = [
  {
    label: "Walking",
    kcalPerHour: 280,
    stepsPerHour: 6000,
    unit: "steps",
    convert: (remaining: number) =>
      Math.round((remaining / 280) * 6000).toLocaleString(),
    sub: (remaining: number) =>
      `${((remaining / 280) * 60).toFixed(0)} mins · ~6,000 steps/hr`,
  },
  {
    label: "Running (6 min/km)",
    kcalPerHour: 600,
    stepsPerHour: 10000,
    unit: "steps",
    convert: (remaining: number) =>
      Math.round((remaining / 600) * 10000).toLocaleString(),
    sub: (remaining: number) =>
      `${((remaining / 600) * 60).toFixed(0)} mins · ~10,000 steps/hr`,
  },
  {
    label: "Treadmill (moderate)",
    kcalPerHour: 400,
    stepsPerHour: 7500,
    unit: "steps",
    convert: (remaining: number) =>
      Math.round((remaining / 400) * 7500).toLocaleString(),
    sub: (remaining: number) =>
      `${((remaining / 400) * 60).toFixed(0)} mins · ~7,500 steps/hr`,
  },
  {
    label: "Cycling",
    kcalPerHour: 450,
    unit: "hours",
    convert: (remaining: number) =>
      `${(remaining / 450).toFixed(1)}`,
    sub: (remaining: number) =>
      `${((remaining / 450) * 60).toFixed(0)} mins total`,
  },
  {
    label: "Swimming",
    kcalPerHour: 500,
    unit: "hours",
    convert: (remaining: number) =>
      `${(remaining / 500).toFixed(1)}`,
    sub: (remaining: number) =>
      `${((remaining / 500) * 60).toFixed(0)} mins total`,
  },
  {
    label: "Jump rope",
    kcalPerHour: 700,
    unit: "mins",
    convert: (remaining: number) =>
      `${((remaining / 700) * 60).toFixed(0)}`,
    sub: (remaining: number) =>
      `${(remaining / 700).toFixed(1)} hrs · high intensity`,
  },
  {
    label: "HIIT",
    kcalPerHour: 800,
    unit: "mins",
    convert: (remaining: number) =>
      `${((remaining / 800) * 60).toFixed(0)}`,
    sub: (remaining: number) =>
      `${(remaining / 800).toFixed(1)} hrs · ~800 kcal/hr`,
  },
]