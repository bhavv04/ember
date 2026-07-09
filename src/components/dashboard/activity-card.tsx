import { ACTIVITIES } from "@/lib/constants"

interface Props {
  remaining: number
}

export function ActivityCard({ remaining }: Props) {
  return (
    <div>
      <p className="text-sm text-ember-ink mb-5 ">
        To burn the rest, based on{" "}
        <span className="text-ember-amber">{remaining.toLocaleString()} kcal</span> remaining:
      </p>

      <div className="divide-y divide-ember-card-border border-t border-b border-ember-card-border">
        {ACTIVITIES.map(({ label, Icon, convert, unit }) => (
          <div key={label} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Icon size={16} className="text-ember-amber" strokeWidth={1.5} />
              <p className="text-ember-ink text-sm">{label}</p>
            </div>
            <p className="text-ember-ink text-sm tabular-nums ">
              {convert(remaining)} <span className="text-ember-muted text-xs">{unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}