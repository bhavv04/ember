import { StreakCard } from "./streak-card"
import { DeficitTrendCard } from "./deficit-trend-card"
import { DeficitDaysCard } from "./deficit-days-card"
import type { DailyLog } from "@/types"

interface Props {
  logs: DailyLog[]
}

export function StreakStats({ logs }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StreakCard logs={logs} />
      <DeficitTrendCard logs={logs} />
      <DeficitDaysCard logs={logs} />
    </div>
  )
}