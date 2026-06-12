export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <a href="/log" className="flex items-center justify-center p-4 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium">
        + Log today
      </a>
      <a href="/weigh-in" className="flex items-center justify-center p-4 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium">
        + Weigh in
      </a>
    </div>
  )
}