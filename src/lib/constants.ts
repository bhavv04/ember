import {
  Footprints,
  Timer,
  TrendingUp,
  Bike,
  Waves,
  Zap,
  Flame,
  MoveUpRight,
  PersonStanding,
  Dumbbell,
  Music,
  RefreshCw,
  LucideIcon,
} from "lucide-react"

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

export const ACTIVITIES: {
  label: string
  Icon: LucideIcon
  kcalPerHour: number
  stepsPerHour?: number
  unit: string
  convert: (remaining: number) => string
  sub: (remaining: number) => string
}[] = [
  {
    label: "Walking",
    Icon: Footprints,
    kcalPerHour: 280,
    stepsPerHour: 6000,
    unit: "steps",
    convert: (remaining) => Math.round((remaining / 280) * 6000).toLocaleString(),
    sub: (remaining) => `${((remaining / 280) * 60).toFixed(0)} mins · ~6,000 steps/hr`,
  },
  {
    label: "Running",
    Icon: Timer,
    kcalPerHour: 600,
    stepsPerHour: 10000,
    unit: "steps",
    convert: (remaining) => Math.round((remaining / 600) * 10000).toLocaleString(),
    sub: (remaining) => `${((remaining / 600) * 60).toFixed(0)} mins · ~10,000 steps/hr`,
  },
  {
    label: "Treadmill",
    Icon: TrendingUp,
    kcalPerHour: 400,
    stepsPerHour: 7500,
    unit: "steps",
    convert: (remaining) => Math.round((remaining / 400) * 7500).toLocaleString(),
    sub: (remaining) => `${((remaining / 400) * 60).toFixed(0)} mins · ~7,500 steps/hr`,
  },
  {
    label: "Cycling",
    Icon: Bike,
    kcalPerHour: 450,
    unit: "hours",
    convert: (remaining) => (remaining / 450).toFixed(1),
    sub: (remaining) => `${((remaining / 450) * 60).toFixed(0)} mins total`,
  },
  {
    label: "Swimming",
    Icon: Waves,
    kcalPerHour: 500,
    unit: "hours",
    convert: (remaining) => (remaining / 500).toFixed(1),
    sub: (remaining) => `${((remaining / 500) * 60).toFixed(0)} mins total`,
  },
  {
    label: "Jump rope",
    Icon: Zap,
    kcalPerHour: 700,
    unit: "mins",
    convert: (remaining) => ((remaining / 700) * 60).toFixed(0),
    sub: (remaining) => `${(remaining / 700).toFixed(1)} hrs · high intensity`,
  },
  {
    label: "HIIT",
    Icon: Flame,
    kcalPerHour: 800,
    unit: "mins",
    convert: (remaining) => ((remaining / 800) * 60).toFixed(0),
    sub: (remaining) => `${(remaining / 800).toFixed(1)} hrs · ~800 kcal/hr`,
  },
  {
    label: "Hiking",
    Icon: MoveUpRight,
    kcalPerHour: 420,
    unit: "hours",
    convert: (remaining) => (remaining / 420).toFixed(1),
    sub: (remaining) => `${((remaining / 420) * 60).toFixed(0)} mins total`,
  },
  {
    label: "Yoga",
    Icon: PersonStanding,
    kcalPerHour: 180,
    unit: "hours",
    convert: (remaining) => (remaining / 180).toFixed(1),
    sub: (remaining) => `${((remaining / 180) * 60).toFixed(0)} mins total`,
  },
  {
    label: "Rowing",
    Icon: Dumbbell,
    kcalPerHour: 550,
    unit: "hours",
    convert: (remaining) => (remaining / 550).toFixed(1),
    sub: (remaining) => `${((remaining / 550) * 60).toFixed(0)} mins total`,
  },
  {
    label: "Dance",
    Icon: Music,
    kcalPerHour: 350,
    unit: "hours",
    convert: (remaining) => (remaining / 350).toFixed(1),
    sub: (remaining) => `${((remaining / 350) * 60).toFixed(0)} mins total`,
  },
  {
    label: "Elliptical",
    Icon: RefreshCw,
    kcalPerHour: 480,
    unit: "hours",
    convert: (remaining) => (remaining / 480).toFixed(1),
    sub: (remaining) => `${((remaining / 480) * 60).toFixed(0)} mins total`,
  },
]