import type { DailyLog } from "@/types"

export function getStreaks(logs: DailyLog[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const logDates = new Set(
    logs.map((l) => new Date(l.date).toISOString().split("T")[0])
  )

  let current = 0
  let longest = 0
  let temp = 0
  let counting = true

  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const key = date.toISOString().split("T")[0]

    if (logDates.has(key)) {
      if (counting) current++
      temp++
      longest = Math.max(longest, temp)
    } else {
      counting = false
      temp = 0
    }
  }

  return { current, longest }
}

export function buildLogMap(logs: DailyLog[]) {
  return new Map(
    logs.map((l) => [new Date(l.date).toISOString().split("T")[0], l])
  )
}

export function getLast14Deficits(logs: DailyLog[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const logMap = buildLogMap(logs)

  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (13 - i))
    const key = d.toISOString().split("T")[0]
    return logMap.get(key)?.netDeficit ?? 0
  })
}

export function getWeeklyAvgs(logs: DailyLog[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const logMap = buildLogMap(logs)

  return Array.from({ length: 4 }, (_, w) => {
    const weekLogs = Array.from({ length: 7 }, (_, d) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (w * 7 + d))
      const key = date.toISOString().split("T")[0]
      return logMap.get(key)?.netDeficit
    }).filter((v): v is number => v !== undefined)

    return weekLogs.length > 0
      ? Math.round(weekLogs.reduce((a, b) => a + b, 0) / weekLogs.length)
      : 0
  }).reverse()
}