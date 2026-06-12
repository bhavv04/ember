import type { DailyLog } from "@/types"

export interface Cell {
  date: Date
  key: string
  log?: DailyLog
  isFuture: boolean
}

export interface Stats {
  loggedDays: number
  logRate: number
  avgDeficit: number
  deficitDays: number
  currentStreak: number
  bestStreak: number
}

export function computeStats(cells: Cell[]): Stats {
  const past = cells.filter((c) => !c.isFuture)
  const logged = past.filter((c) => !!c.log)
  const deficitDays = logged.filter((c) => (c.log?.netDeficit ?? 0) > 0).length
  const totalDeficit = logged.reduce((s, c) => s + (c.log?.netDeficit ?? 0), 0)
  const avgDeficit = logged.length ? Math.round(totalDeficit / logged.length) : 0
  const logRate = past.length ? Math.round((logged.length / past.length) * 100) : 0

  const sorted = [...past].sort((a, b) => a.date.getTime() - b.date.getTime())
  let best = 0, tmp = 0
  for (const c of sorted) {
    if (c.log && c.log.netDeficit > 0) { tmp++; best = Math.max(best, tmp) }
    else tmp = 0
  }
  let current = 0
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].log && (sorted[i].log?.netDeficit ?? 0) > 0) current++
    else break
  }

  return { loggedDays: logged.length, logRate, avgDeficit, deficitDays, currentStreak: current, bestStreak: best }
}