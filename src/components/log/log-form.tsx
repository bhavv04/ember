"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface Props {
  baselineTdee: number | null
  loggedDates: string[] // ["2026-06-12", "2026-06-10", ...]
  onSubmit: (date: Date, caloriesEaten: string, tdeeForDay: string) => Promise<void>
}

function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function NetDeficitPreview({
  caloriesEaten,
  tdeeForDay,
}: {
  caloriesEaten: string
  tdeeForDay: string
}) {
  const eaten = parseFloat(caloriesEaten)
  const tdee = parseFloat(tdeeForDay)

  if (!eaten || !tdee) return null

  const net = tdee - eaten
  const isDeficit = net > 0
  const label = isDeficit ? "deficit" : net === 0 ? "break even" : "surplus"
  const colorClass = isDeficit
    ? "text-green-600 dark:text-green-400"
    : net === 0
    ? "text-yellow-600 dark:text-yellow-400"
    : "text-red-500"

  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3.5 py-2.5 text-sm">
      <span className="text-muted-foreground">Today's net</span>
      <span className={`font-semibold tabular-nums ${colorClass}`}>
        {isDeficit ? "+" : ""}
        {net.toLocaleString()} kcal{" "}
        <span className="font-normal text-xs opacity-75">({label})</span>
      </span>
    </div>
  )
}

export function LogForm({ baselineTdee, loggedDates, onSubmit }: Props) {
    const [date, setDate] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)
  const [caloriesEaten, setCaloriesEaten] = useState("")
  const [tdeeForDay, setTdeeForDay] = useState("")
  const [loading, setLoading] = useState(false)
  const [existingLog, setExistingLog] = useState(false)
  const [fetching, setFetching] = useState(false)

    const loggedDateObjects = loggedDates.map((d) => {
    const [year, month, day] = d.split("-").map(Number)
    return new Date(year, month - 1, day) // local time, no UTC shift
    })
    
  const isToday = date.toDateString() === new Date().toDateString()
  const canSubmit = !!caloriesEaten && !!tdeeForDay && !loading && !fetching

  // Fetch existing log whenever date changes
  useEffect(() => {
    async function fetchLogForDate() {
      setFetching(true)
      const key = toLocalDateKey(date)
      const res = await fetch(`/api/logs?date=${key}`)
      const data = await res.json()

      if (data && data.caloriesEaten != null) {
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

    fetchLogForDate()
  }, [date, baselineTdee])

  async function handleSubmit() {
    if (!caloriesEaten || !tdeeForDay) return
    setLoading(true)
    await onSubmit(date, caloriesEaten, tdeeForDay)
    setLoading(false)
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pt-5 px-5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            {existingLog ? "Update log" : "Log today"}
          </CardTitle>
          {existingLog && (
            <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Editing existing entry
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 space-y-4">

        {/* Date picker */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Date
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors",
                  "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
              >
                <span className={cn(isToday ? "text-foreground" : "text-orange-500 font-medium")}>
                  {isToday ? "Today" : format(date, "EEE, MMM d, yyyy")}
                </span>
                <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => { if (d) { setDate(d); setOpen(false) } }}
                disabled={(d) => d > new Date()}
                modifiers={{ logged: loggedDateObjects }}
                modifiersClassNames={{ logged: "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-orange-500 relative" }}
                />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Calories eaten */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Calories eaten
            </Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="1800"
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
            <div className="flex items-baseline gap-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                TDEE
              </Label>
              {baselineTdee && (
                <button
                  type="button"
                  onClick={() => setTdeeForDay(String(baselineTdee))}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  tabIndex={0}
                >
                  Use baseline ({baselineTdee.toLocaleString()})
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder={baselineTdee ? String(baselineTdee) : "2200"}
                value={tdeeForDay}
                onChange={(e) => setTdeeForDay(e.target.value)}
                className="pr-12"
                disabled={fetching}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                kcal
              </span>
            </div>
          </div>
        </div>

        <NetDeficitPreview caloriesEaten={caloriesEaten} tdeeForDay={tdeeForDay} />

        <Button
          className="w-full"
          disabled={!canSubmit}
          onClick={handleSubmit}
          type="button"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </span>
          ) : fetching ? (
            "Loading…"
          ) : existingLog ? (
            `Update ${isToday ? "today's" : format(date, "MMM d")} log`
          ) : isToday ? (
            "Save log"
          ) : (
            `Save log for ${format(date, "MMM d")}`
          )}
        </Button>
      </CardContent>
    </Card>
  )
}