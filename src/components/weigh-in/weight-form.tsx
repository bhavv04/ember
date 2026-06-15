"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isFuture, isSameDay, subMonths, addMonths } from "date-fns"
import { cn } from "@/lib/utils"
import type { WeighIn } from "@/types"

interface Props {
  baselineTdee?: number
  onSaved?: (entry: WeighIn) => void
}

function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function WeightForm({ baselineTdee, onSaved }: Props) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())
  const [weight, setWeight] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [existingEntry, setExistingEntry] = useState<WeighIn | null>(null)
  const [weighedDates, setWeighedDates] = useState<Set<string>>(new Set())

  const isSelectedToday = isToday(selectedDate)
  const isFutureDay = (date: Date) => isFuture(date) && !isToday(date)

  const monthStart = startOfMonth(calendarMonth)
  const monthEnd = endOfMonth(calendarMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad = getDay(monthStart)
  const paddedDays = [...Array(startPad).fill(null), ...days]

  // Load all weigh-in dates on mount
  useEffect(() => {
    async function fetchAll() {
      const res = await fetch("/api/weigh-ins")
      const data: WeighIn[] = await res.json()
      setWeighedDates(new Set(data.map((w) => w.date.split("T")[0])))
    }
    fetchAll()
  }, [])

  // Load entry for selected date
  useEffect(() => {
    async function fetchEntry() {
      setFetching(true)
      setSaved(false)
      const key = toLocalDateKey(selectedDate)
      const res = await fetch(`/api/weigh-ins?date=${key}`)
      const data = await res.json()
      if (data?.weightKg != null) {
        setWeight(String(data.weightKg))
        setExistingEntry(data)
      } else {
        setWeight("")
        setExistingEntry(null)
      }
      setFetching(false)
    }
    fetchEntry()
  }, [selectedDate])

    async function handleSubmit() {
    if (!weight) return
    setLoading(true)
    const res = await fetch("/api/weigh-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        weightKg: parseFloat(weight),
        date: toLocalDateKey(selectedDate),
            }),
        })
    const entry = await res.json()
    setSaved(true)
    setLoading(false)
    setExistingEntry(entry)
    setWeighedDates((prev) => new Set([...prev, toLocalDateKey(selectedDate)]))
    onSaved?.(entry)
    if (isSelectedToday) setTimeout(() => router.push("/dashboard"), 800)
    }

  async function handleDelete() {
    if (!existingEntry) return
    setDeleting(true)
    await fetch(`/api/weigh-ins?id=${existingEntry.id}`, { method: "DELETE" })
    setWeight("")
    setExistingEntry(null)
    setSaved(false)
    setDeleting(false)
    setWeighedDates((prev) => {
        const next = new Set(prev)
        next.delete(toLocalDateKey(selectedDate))
        return next
        })
    }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

      {/* Left — calendar */}
      <div className="space-y-3">

        {/* Month nav */}
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-ember-forest-pale transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-ember-muted" />
          </button>
          <p className="text-sm text-ember-ink">{format(calendarMonth, "MMMM yyyy")}</p>
          <button
            onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
            disabled={
              calendarMonth.getMonth() >= new Date().getMonth() &&
              calendarMonth.getFullYear() >= new Date().getFullYear()
            }
            className="p-1.5 rounded-lg hover:bg-ember-forest-pale transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-ember-muted" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="text-center text-[11px] text-ember-muted py-1">{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {paddedDays.map((day, i) => {
            if (!day) return <div key={`pad-${i}`} />
            const key = toLocalDateKey(day)
            const isSelected = isSameDay(day, selectedDate)
            const isWeighed = weighedDates.has(key)
            const future = isFutureDay(day)
            const todayDay = isToday(day)

            return (
              <div key={key} className="flex items-center justify-center py-0.5">
                <button
                  disabled={future}
                  onClick={() => {
                    setSelectedDate(day)
                    setCalendarMonth(day)
                  }}
                  className={cn(
                    "w-8 h-8 rounded-full text-xs transition-all flex items-center justify-center border",
                    isSelected
                      ? "bg-ember-forest border-ember-forest text-white"
                      : isWeighed && todayDay
                      ? "border-ember-forest text-ember-forest"
                      : isWeighed
                      ? "border-ember-forest/50 text-ember-forest"
                      : todayDay
                      ? "border-ember-ink/30 text-ember-ink hover:border-ember-forest hover:text-ember-forest"
                      : future
                      ? "border-ember-card-border/30 text-ember-muted/30 cursor-not-allowed"
                      : "border-ember-card-border text-ember-muted hover:border-ember-forest hover:text-ember-forest"
                  )}
                >
                  {format(day, "d")}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-ember-card-border">
          <p className="text-xs text-ember-muted">
            {isSelectedToday ? "Today" : format(selectedDate, "EEE, MMM d, yyyy")}
          </p>
          {fetching && <p className="text-xs text-ember-muted">Loading…</p>}
          {existingEntry && !fetching && (
            <p className="text-xs text-ember-forest">Entry exists</p>
          )}
        </div>
      </div>

      {/* Right — input + actions */}
      <div className="flex flex-col justify-between gap-4">
        <div className="space-y-4">

          {/* Weight input */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-[0.15em] text-ember-muted">
              Weight (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 88.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                disabled={saved || fetching}
                className="w-full bg-ember-forest-pale border border-ember-card-border rounded-xl px-4 py-2.5 pr-12 text-sm text-ember-ink placeholder:text-ember-muted focus:outline-none focus:border-ember-amber transition-colors disabled:opacity-50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ember-muted pointer-events-none">
                kg
              </span>
            </div>
          </div>

          {/* TDEE preview */}
          {baselineTdee ? (
            <div className="bg-ember-forest-pale rounded-xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">Current TDEE</p>
              <p className="text-lg text-ember-forest tabular-nums">{baselineTdee.toLocaleString()} kcal</p>
              <p className="text-xs text-ember-muted mt-0.5">recalibrates after 2+ weigh-ins</p>
            </div>
          ) : (
            <div className="bg-ember-forest-pale rounded-xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">How it works</p>
              <p className="text-xs text-ember-muted leading-relaxed">
                Each weigh-in recalibrates your TDEE for more accurate projections.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            disabled={!weight || loading || saved || fetching}
            onClick={handleSubmit}
            className="w-full bg-ember-forest text-[#f7f3ea] rounded-xl py-2.5 text-sm transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {saved ? (
              <><Check size={14} strokeWidth={2} />Saved</>
            ) : loading ? "Saving…"
              : existingEntry
              ? `Update ${isSelectedToday ? "today's" : format(selectedDate, "MMM d")} entry`
              : isSelectedToday
              ? "Save weigh-in"
              : `Save for ${format(selectedDate, "MMM d")}`
            }
          </button>

          {existingEntry && !saved && (
            <button
              disabled={deleting}
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-ember-amber border border-ember-amber/30 hover:bg-ember-amber/10 transition-colors disabled:opacity-40"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              {deleting ? "Deleting…" : `Delete ${isSelectedToday ? "today's" : format(selectedDate, "MMM d")} entry`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}