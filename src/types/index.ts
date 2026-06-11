export interface DailyLog {
  id: string
  date: string
  caloriesEaten: number
  tdeeForDay: number
  netDeficit: number
}

export interface Goal {
  id: string
  targetWeightKg: number
  startWeightKg: number
  baselineTdee: number
  startDate: string
}

export interface WeighIn {
  id: string
  date: string
  weightKg: number
}