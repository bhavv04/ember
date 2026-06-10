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
    <section className="min-h-screen bg-white flex flex-col justify-center px-6 pt-16">
      <div className="max-w-4xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-24 items-center min-h-[85vh]">

          {/* Left */}
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-gray-950 leading-[1.08] tracking-tight">
              See the mountain
              <br />
              <span className="text-orange-500">you're climbing.</span>
            </h1>

            <p className="text-gray-400 text-base leading-relaxed">
              Ember turns your weight loss goal into one honest number and tracks
              how close you are — in calories, steps, and days.
            </p>

            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gray-950 hover:bg-gray-800 transition-colors"
            >
              {isSignedIn ? "View your dashboard →" : "Set your goal →"}
            </Link>

            <p className="text-xs text-gray-300">
              Free · No food database · Just the math
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}