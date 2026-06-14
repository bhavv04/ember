"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isFuture, isSameDay, subMonths, addMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    <Card className="md:col-span-2">
      <CardHeader className="pt-5 px-5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            {existingLog ? "Update log" : "Log entry"}
          </CardTitle>
          {existingLog && (
            <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Editing existing
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-4 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Left — inline calendar */}
          <div className="space-y-3">
            {/* Month nav */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <p className="text-sm font-semibold">
                {format(calendarMonth, "MMMM yyyy")}
              </p>
              <button
                onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                disabled={
                  calendarMonth.getMonth() >= new Date().getMonth() &&
                  calendarMonth.getFullYear() >= new Date().getFullYear()
                }
                className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-[11px] text-muted-foreground font-medium py-1">
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
                        "w-8 h-8 rounded-full text-xs font-medium transition-all flex items-center justify-center border",
                        // Selected
                        isSelected
                          ? "bg-orange-500 border-orange-500 text-white"
                          // Logged + today
                          : isLogged && isTodayDay
                          ? "border-orange-400 text-orange-700 dark:border-orange-400 dark:text-orange-300"
                          // Logged
                          : isLogged
                          ? "border-orange-300 text-orange-600 dark:border-orange-500/50 dark:text-orange-400"
                          // Today not logged
                          : isTodayDay
                          ? "border-foreground/30 text-foreground hover:border-orange-400 hover:text-orange-500"
                          // Future
                          : isFutureDay
                          ? "border-border/30 text-muted-foreground/30 cursor-not-allowed"
                          // Normal past day
                          : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Selected date */}
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {isSelectedToday ? "Today" : format(selectedDate, "EEE, MMM d, yyyy")}
              </p>
              {fetching && (
                <p className="text-xs text-muted-foreground">Loading…</p>
              )}
              {existingLog && !fetching && (
                <p className="text-xs text-orange-500 font-medium">Entry exists</p>
              )}
            </div>
          </div>

          {/* Right — inputs */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">

              {/* Calories eaten */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                  Calories eaten
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="e.g. 1800"
                    value={caloriesEaten}
                    onChange={(e) => setCaloriesEaten(e.target.value)}
                    className="pr-12"
                    disabled={fetching}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    kcal
                  </span>
                </div>
              </div>

              {/* TDEE */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    TDEE today
                  </Label>
                  {baselineTdee && (
                    <button
                      type="button"
                      onClick={() => setTdeeForDay(String(baselineTdee))}
                      className="text-[11px] text-muted-foreground hover:text-orange-500 transition-colors underline underline-offset-2"
                    >
                      Reset to baseline
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={baselineTdee ? String(baselineTdee) : "e.g. 2200"}
                    value={tdeeForDay}
                    onChange={(e) => setTdeeForDay(e.target.value)}
                    className="pr-12"
                    disabled={fetching}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    kcal
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Increase if you worked out today
                </p>
              </div>

              {/* Net deficit */}
              {net !== null && (
                <div className={cn(
                  "flex items-center justify-between rounded-lg px-4 py-3 border",
                  net > 0
                    ? "bg-green-500/5 border-green-500/20"
                    : net === 0
                    ? "bg-yellow-500/5 border-yellow-500/20"
                    : "bg-red-500/5 border-red-500/20"
                )}>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                      Net deficit
                    </p>
                    <p className={cn(
                      "text-2xl font-bold tabular-nums mt-0.5",
                      net > 0 ? "text-green-500" : net === 0 ? "text-yellow-500" : "text-red-500"
                    )}>
                      {net > 0 ? "+" : ""}{net.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground ml-1">kcal</span>
                    </p>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold px-2.5 py-1 rounded-full",
                    net > 0
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : net === 0
                      ? "bg-yellow-500/10 text-yellow-600"
                      : "bg-red-500/10 text-red-500"
                  )}>
                    {net > 0 ? "Deficit" : net === 0 ? "Break even" : "Surplus"}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              className="w-full"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {loading ? (
                <span className="flex items-center gap-2">
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
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}