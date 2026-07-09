"use client"

interface AccountSectionProps {
  userLabel: string | null
  onSignOut: () => void
}

export function AccountSection({ userLabel, onSignOut }: AccountSectionProps) {
  return (
    <section className="pb-8 mb-8 border-b border-ember-card-border">
      <h2 className="text-sm text-ember-muted mb-4">
        Fig. 03 — Account
      </h2>
      {userLabel && (
        <p className="text-sm text-ember-muted mb-3">
          Signed in as {userLabel}
        </p>
      )}
      <button
        onClick={onSignOut}
        className="text-sm text-ember-ink border-b border-transparent hover:border-ember-ink transition-colors pb-px"
      >
        Sign out
      </button>
    </section>
  )
}