"use client"

interface DataSectionProps {
  exporting: boolean
  onExportCsv: () => void
  deleteConfirmOpen: boolean
  deleting: boolean
  onDeleteConfirmOpenChange: (open: boolean) => void
  onDelete: () => void
}

export function DataSection({
  exporting,
  onExportCsv,
  deleteConfirmOpen,
  deleting,
  onDeleteConfirmOpenChange,
  onDelete,
}: DataSectionProps) {
  return (
    <section>
      <h2 className="text-sm text-ember-muted mb-4">
        Fig. 04 — Data
      </h2>

      <button
        onClick={onExportCsv}
        disabled={exporting}
        className="text-sm text-ember-ink border-b border-transparent hover:border-ember-ink transition-colors pb-px disabled:opacity-50"
      >
        {exporting ? "Exporting..." : "Export logs as CSV →"}
      </button>

      <div className="mt-6 pt-6 border-t border-ember-card-border">
        {!deleteConfirmOpen ? (
          <button
            onClick={() => onDeleteConfirmOpenChange(true)}
            className="text-sm text-ember-amber border-b border-transparent hover:border-ember-amber transition-colors pb-px"
          >
            Delete all data
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-ember-muted">
              This permanently deletes your goal and every logged day. This can't be undone.
            </p>
            <div className="flex gap-4 text-sm">
              <button
                onClick={() => onDeleteConfirmOpenChange(false)}
                disabled={deleting}
                className="text-ember-muted hover:text-ember-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                disabled={deleting}
                className="text-ember-amber border-b border-transparent hover:border-ember-amber transition-colors pb-px"
              >
                {deleting ? "Deleting..." : "Yes, delete everything"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}