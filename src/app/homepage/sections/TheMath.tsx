export default function TheMath() {
  const rows = [
    { label: "1 kg of body fat", value: "7,700 kcal", note: "the foundational number" },
    { label: "10 kg to lose", value: "77,000 kcal", note: "your deficit target" },
    { label: "20 kg to lose", value: "154,000 kcal", note: "your deficit target" },
    { label: "30 kg to lose", value: "231,000 kcal", note: "your deficit target" },
  ]

  return (
    <section id="the-math" className="py-24 px-6 bg-muted">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
            the math
          </p>
          <h2 className="text-4xl font-bold text-foreground tracking-tight leading-tight">
            No mystery.<br />
            <span className="text-orange-500">Just arithmetic.</span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-lg mt-4">
            Every gram of body fat stores roughly 7.7 kcal of energy. Losing weight
            means burning through that stored energy — consistently, over time.
            Ember makes that number impossible to ignore.
          </p>
        </div>

        {/* Core equation */}
        <div className="rounded-2xl border border-border bg-card p-8 mb-8">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-6">
            the equation
          </p>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground w-48">kg to lose</span>
              <span className="text-muted-foreground">×</span>
              <span className="text-muted-foreground">7,700 kcal/kg</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-foreground font-bold">total deficit needed</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-4 text-orange-500">
              <span className="w-48">20 kg</span>
              <span className="text-muted-foreground">×</span>
              <span>7,700 kcal/kg</span>
              <span className="text-muted-foreground">=</span>
              <span className="font-bold text-lg">154,000 kcal</span>
            </div>
          </div>
        </div>

        {/* Reference table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden mb-8">
          <div className="px-8 py-5 border-b border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              reference
            </p>
          </div>
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between px-8 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{row.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.note}</p>
                </div>
                <span className="text-sm font-bold text-orange-500 font-mono">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily deficit context */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              deficit: "300 kcal/day",
              result: "~1 kg/month",
              note: "Gentle pace — sustainable long term",
            },
            {
              deficit: "500 kcal/day",
              result: "~2 kg/month",
              note: "Standard pace — recommended by most guidelines",
            },
            {
              deficit: "700 kcal/day",
              result: "~2.7 kg/month",
              note: "Aggressive pace — harder to maintain",
            },
          ].map((item) => (
            <div key={item.deficit} className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                daily deficit
              </p>
              <p className="text-xl font-bold text-orange-500 font-mono">{item.deficit}</p>
              <p className="text-sm font-semibold text-foreground">{item.result}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.note}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}