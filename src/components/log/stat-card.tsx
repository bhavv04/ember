interface Props {
  label: string
  value: string
  sentiment?: "positive" | "negative" | "neutral"
}

export function StatCard({ label, value, sentiment }: Props) {
  const valueColor =
    sentiment === "positive" ? "text-green-600 dark:text-green-400" :
    sentiment === "negative" ? "text-red-500" :
    "text-foreground"

  return (
    <div className="rounded-lg bg-muted/60 px-3 py-2.5 min-w-0">
      <p className="text-[11px] text-muted-foreground mb-0.5 truncate">{label}</p>
      <p className={`text-base font-medium leading-tight tabular-nums truncate ${valueColor}`}>{value}</p>
    </div>
  )
}