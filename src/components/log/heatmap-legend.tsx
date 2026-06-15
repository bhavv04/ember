export function HeatmapLegend() {
  return (
    <div className="flex items-center gap-1.5 pt-3 border-t border-ember-card-border flex-wrap">
      <span className="text-[11px] text-ember-muted">Less</span>
      {[
        "bg-ember-forest-pale",
        "bg-ember-forest-mid",
        "bg-ember-forest-light",
        "bg-ember-forest",
      ].map((c) => (
        <div key={c} className={`w-2.5 h-2.5 rounded-sm shrink-0 ${c}`} />
      ))}
      <span className="text-[11px] text-ember-muted mr-1">More</span>

      <div className="w-px h-3 bg-ember-card-border mx-0.5" />

      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-sm bg-ember-forest-pale shrink-0" />
        <span className="text-[11px] text-ember-muted">No log</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-sm bg-ember-amber/40 shrink-0" />
        <span className="text-[11px] text-ember-muted">Even</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-sm bg-ember-amber shrink-0" />
        <span className="text-[11px] text-ember-muted">Surplus</span>
      </div>
    </div>
  )
}