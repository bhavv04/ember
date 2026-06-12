export function HeatmapLegend() {
  return (
    <div className="flex items-center gap-1.5 pt-3 border-t border-border flex-wrap">
      <span className="text-[11px] text-muted-foreground">Less</span>
      {["bg-green-200", "bg-green-400", "bg-green-600", "bg-green-800"].map((c) => (
        <div key={c} className={`w-2.5 h-2.5 rounded-sm shrink-0 ${c}`} />
      ))}
      <span className="text-[11px] text-muted-foreground mr-1">More</span>
      <div className="w-px h-3 bg-border mx-0.5" />
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-sm bg-muted shrink-0" />
        <span className="text-[11px] text-muted-foreground">No log</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-sm bg-yellow-400 shrink-0" />
        <span className="text-[11px] text-muted-foreground">Even</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-sm bg-red-400 shrink-0" />
        <span className="text-[11px] text-muted-foreground">Surplus</span>
      </div>
    </div>
  )
}