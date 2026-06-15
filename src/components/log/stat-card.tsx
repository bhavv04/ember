interface Props {
  label: string
  value: string
  sentiment?: "positive" | "negative" | "neutral"
}

export function StatCard({ label, value, sentiment }: Props) {
  const valueColor =
    sentiment === "positive" ? "text-ember-forest" :
    sentiment === "negative" ? "text-ember-amber" :
    "text-ember-ink"

  return (
    <div className="bg-ember-forest-pale rounded-2xl px-4 py-3 min-w-0">
      <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1 truncate">{label}</p>
      <p className={`text-lg tabular-nums truncate ${valueColor}`}>{value}</p>
    </div>
  )
}