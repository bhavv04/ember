export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <a
        href="/log"
        className="flex items-center justify-center py-3 px-5 rounded-2xl bg-ember-amber/10 text-ember-amber text-sm hover:bg-ember-amber/20 transition-colors"
      >
        + Log today
      </a>
      <a
        href="/weigh-in"
        className="flex items-center justify-center py-3 px-5 rounded-2xl bg-ember-forest-pale text-ember-forest text-sm hover:bg-ember-forest-pale/80 transition-colors"
      >
        + Weigh in
      </a>
    </div>
  )
}