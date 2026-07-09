"use client"

import type { UnitSystem } from "@/lib/units"

interface UnitsSectionProps {
  unitSystem: UnitSystem
  onToggle: (unit: UnitSystem) => void
}

export function UnitsSection({ unitSystem, onToggle }: UnitsSectionProps) {
  return (
    <section className="pb-8 mb-8 border-b border-ember-card-border">
      <h2 className="text-sm font-medium text-ember-muted mb-4">
        Fig. 01 — Units
      </h2>
      <div className="flex gap-1 text-sm">
        {(["metric", "imperial"] as const).map((u, i) => (
          <button
            key={u}
            onClick={() => onToggle(u)}
            className={`px-0 py-1 ${i === 1 ? "ml-6" : ""} border-b transition-colors ${
              unitSystem === u
                ? "border-ember-amber text-ember-ink"
                : "border-transparent text-ember-muted hover:text-ember-ink"
            }`}
          >
            {u === "metric" ? "Metric (kg, cm)" : "Imperial (lb, ft/in)"}
          </button>
        ))}
      </div>
    </section>
  )
}