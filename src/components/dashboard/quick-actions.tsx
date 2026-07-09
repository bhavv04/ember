export function QuickActions() {
  return (
    <div className="flex gap-4 font-mono text-xs uppercase tracking-wide">
      <a
        href="/log"
        className="flex items-center gap-2 px-4 py-2.5 bg-ember-ink text-ember-page hover:bg-ember-ink/90 transition-colors"
      >
        <span className="text-ember-amber">+</span> Log today
      </a>
      <a
        href="/weigh-in"
        className="flex items-center gap-2 px-4 py-2.5 border border-ember-card-border text-ember-ink hover:border-ember-ink transition-colors"
      >
        <span className="text-ember-muted">+</span> Weigh in
      </a>
    </div>
  )
}