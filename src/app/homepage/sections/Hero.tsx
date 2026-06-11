"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

export default function Hero() {
  const barRef = useRef<HTMLDivElement>(null)
  const { isSignedIn } = useUser()

  useEffect(() => {
    const duration = 2200
    const start = performance.now()

    function update(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      if (barRef.current) {
        barRef.current.style.width = `${eased * 37}%`
      }
      if (progress < 1) requestAnimationFrame(update)
    }

    const t = setTimeout(() => requestAnimationFrame(update), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="min-h-screen bg-muted/40 flex flex-col justify-center px-6 pt-16">
      <div className="max-w-4xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-24 items-center min-h-[85vh]">

          {/* Left */}
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-foreground leading-[1.08] tracking-tight">
              See the mountain
              <br />
              <span className="text-orange-500">you're climbing.</span>
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed">
              Ember turns your weight loss goal into one honest number and tracks
              how close you are — in calories, steps, and days.
            </p>

            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {isSignedIn ? "View your dashboard →" : "Set your goal →"}
            </Link>

            <p className="text-xs text-muted-foreground/50">
              Free · No food database · Just the math
            </p>
          </div>

          {/* Right */}
          <div className="rounded-2xl border border-border bg-card p-7 space-y-6">

            <div className="space-y-2.5 text-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">the math</p>
              {[
                { label: "20 kg × 7,700 kcal/kg", value: "154,000 kcal" },
                { label: "Burned so far", value: "−57,200 kcal", accent: true },
                { label: "Still to burn", value: "96,800 kcal", bold: true },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={
                    row.bold ? "font-bold text-foreground" :
                    row.accent ? "text-orange-500 font-medium" :
                    "text-foreground/70"
                  }>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <div className="w-full bg-muted rounded-full h-1.5">
                <div ref={barRef} className="h-1.5 rounded-full bg-orange-400" style={{ width: "0%" }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground/50">
                <span>0 kg lost</span>
                <span>20 kg goal</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border">
              {[
                { label: "Avg deficit", value: "620 kcal" },
                { label: "Goal date", value: "Dec 14" },
                { label: "Days left", value: "156" },
              ].map((s) => (
                <div key={s.label} className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-sm font-semibold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}