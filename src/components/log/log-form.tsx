"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isFuture, isSameDay, subMonths, addMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  baselineTdee: number | null
  loggedDates: string[]
  onSubmit: (date: Date, caloriesEaten: string, tdeeForDay: string) => Promise<void>
}

function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function LogForm({ baselineTdee, loggedDates, onSubmit }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())
  const [caloriesEaten, setCaloriesEaten] = useState("")
  const [tdeeForDay, setTdeeForDay] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [existingLog, setExistingLog] = useState(false)

  const loggedSet = new Set(loggedDates)
  const isSelectedToday = isToday(selectedDate)
  const canSubmit = !!caloriesEaten && !!tdeeForDay && !loading && !fetching

  const net = caloriesEaten && tdeeForDay
    ? parseFloat(tdeeForDay) - parseFloat(caloriesEaten)
    : null

  const monthStart = startOfMonth(calendarMonth)
  const monthEnd = endOfMonth(calendarMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad = getDay(monthStart)
  const paddedDays = [...Array(startPad).fill(null), ...days]

  useEffect(() => {
    async function fetchLog() {
      setFetching(true)
      const key = toLocalDateKey(selectedDate)
      const res = await fetch(`/api/logs?date=${key}`)
      const data = await res.json()
      if (data?.caloriesEaten != null) {
        setCaloriesEaten(String(data.caloriesEaten))
        setTdeeForDay(String(data.tdeeForDay))
        setExistingLog(true)
      } else {
        setCaloriesEaten("")
        setTdeeForDay(baselineTdee ? String(baselineTdee) : "")
        setExistingLog(false)
      }
      setFetching(false)
    }
    fetchLog()
  }, [selectedDate, baselineTdee])

  async function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    await onSubmit(selectedDate, caloriesEaten, tdeeForDay)
    setLoading(false)
  }

  return (
    <div className="space-y-1">

      {/* Title row */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-ember-ink text-sm">
          {existingLog ? "Update log" : "Log entry"}
        </p>
        {existingLog && (
          <span className="text-xs text-ember-forest bg-ember-forest-pale px-2.5 py-1 rounded-full">
            Editing existing
          </span>
        )}
      </div>

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
            <p className="text-sm text-ember-ink">
              {format(calendarMonth, "MMMM yyyy")}
            </p>
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
              <div key={d} className="text-center text-[11px] text-ember-muted py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {paddedDays.map((day, i) => {
              if (!day) return <div key={`pad-${i}`} />

              const key = toLocalDateKey(day)
              const isSelected = isSameDay(day, selectedDate)
              const isLogged = loggedSet.has(key)
              const isFutureDay = isFuture(day) && !isToday(day)
              const isTodayDay = isToday(day)

              return (
                <div key={key} className="flex items-center justify-center py-0.5">
                  <button
                    disabled={isFutureDay}
                    onClick={() => {
                      setSelectedDate(day)
                      setCalendarMonth(day)
                    }}
                    className={cn(
                      "w-8 h-8 rounded-full text-xs transition-all flex items-center justify-center border",
                      isSelected
                        ? "bg-ember-forest border-ember-forest text-white"
                        : isLogged && isTodayDay
                        ? "border-ember-forest text-ember-forest"
                        : isLogged
                        ? "border-ember-forest text-ember-forest"
                        : isTodayDay
                        ? "border-ember-forest text-ember-white hover:border-ember-forest hover:text-ember-forest"
                        : isFutureDay
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

          {/* Selected date footer */}
          <div className="flex items-center justify-between pt-3 border-t border-ember-card-border">
            <p className="text-xs text-ember-muted">
              {isSelectedToday ? "Today" : format(selectedDate, "EEE, MMM d, yyyy")}
            </p>
            {fetching && <p className="text-xs text-ember-muted">Loading…</p>}
            {existingLog && !fetching && (
              <p className="text-xs text-ember-amber">Entry exists</p>
            )}
          </div>
        </div>

        {/* Right — inputs */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">

            {/* Calories eaten */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-[0.15em] text-ember-muted">
                Calories eaten
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="e.g. 1800"
                  value={caloriesEaten}
                  onChange={(e) => setCaloriesEaten(e.target.value)}
                  disabled={fetching}
                  className="w-full bg-ember-forest-pale border border-ember-card-border rounded-xl px-4 py-2.5 pr-14 text-sm text-ember-ink placeholder:text-ember-muted focus:outline-none focus:border-ember-amber transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ember-muted pointer-events-none">
                  kcal
                </span>
              </div>
            </div>

            {/* TDEE */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-[0.15em] text-ember-muted">
                  TDEE today
                </label>
                {baselineTdee && (
                  <button
                    type="button"
                    onClick={() => setTdeeForDay(String(baselineTdee))}
                    className="text-[11px] text-ember-muted hover:text-ember-amber transition-colors underline underline-offset-2"
                  >
                    Reset to baseline
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder={baselineTdee ? String(baselineTdee) : "e.g. 2200"}
                  value={tdeeForDay}
                  onChange={(e) => setTdeeForDay(e.target.value)}
                  disabled={fetching}
                  className="w-full bg-ember-forest-pale border border-ember-card-border rounded-xl px-4 py-2.5 pr-14 text-sm text-ember-ink placeholder:text-ember-muted focus:outline-none focus:border-ember-amber transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ember-muted pointer-events-none">
                  kcal
                </span>
              </div>
              <p className="text-xs text-ember-muted">Increase if you worked out today</p>
            </div>

            {/* Net deficit */}
            {net !== null && (
              <div className={cn(
                "flex items-center justify-between rounded-2xl px-5 py-4",
                net > 0 ? "bg-ember-forest-pale" : "bg-ember-amber/10"
              )}>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-ember-muted mb-1">
                    Net deficit
                  </p>
                  <p className={cn(
                    "text-2xl tabular-nums",
                    net > 0 ? "text-ember-forest" : "text-ember-amber"
                  )}>
                    {net > 0 ? "+" : ""}{net.toLocaleString()}
                    <span className="text-sm text-ember-muted ml-1">kcal</span>
                  </p>
                </div>
                <span className={cn(
                  "text-xs px-2.5 py-1 rounded-full",
                  net > 0
                    ? "bg-ember-forest text-[#f7f3ea]"
                    : net === 0
                    ? "bg-ember-card-border text-ember-muted"
                    : "bg-ember-amber/20 text-ember-amber"
                )}>
                  {net > 0 ? "Deficit" : net === 0 ? "Break even" : "Surplus"}
                </span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="w-full bg-ember-forest text-[#f7f3ea] rounded-xl py-2.5 text-sm transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </span>
            ) : fetching ? "Loading…"
              : existingLog
              ? `Update ${isSelectedToday ? "today's" : format(selectedDate, "MMM d")} log`
              : isSelectedToday
              ? "Save log"
              : `Save log for ${format(selectedDate, "MMM d")}`
            }
          </button>
        </div>
      </div>
    </div>
  )
}