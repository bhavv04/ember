import { ACTIVITIES } from "@/lib/constants"

interface Props {
  remaining: number
}

export function ActivityCard({ remaining }: Props) {
  return (
    <div className="bg-ember-card border border-ember-card-border rounded-3xl p-8">

      <p className="uppercase tracking-[0.18em] text-xs text-ember-muted mb-2">To burn the rest</p>
      <p className="text-ember-ink text-sm mb-6 max-w-sm">
        Based on <span className="text-ember-amber">{remaining.toLocaleString()} kcal</span> remaining
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 bg-ember-card ">
            {ACTIVITIES.map(({ label, Icon, convert, unit }) => (
            <div key={label} className="bg-ember-forest-pale p-4 rounded-2xl flex flex-col gap-3">
                <Icon size={18} className="text-ember-amber" strokeWidth={1.5} />
                <p className="text-ember-muted text-xs">{label}</p>
                <div className="mt-auto">
                <p className="text-ember-ink text-xl">{convert(remaining)}</p>
                <p className="text-ember-muted text-xs mt-0.5">{unit}</p>
                </div>
            </div>
            ))}
      </div>

    </div>
  )
}