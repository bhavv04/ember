"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"

export default function HowItWorks() {
  const { isSignedIn } = useUser()

  return (
    <section className="min-h-screen bg-ember-page px-4 py-12 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">

        {/* Eyebrow */}
        <p className="text-center font-serif italic text-ember-amber text-lg mb-8">
          how it works
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Hero */}
          <div className="lg:col-span-2 bg-ember-card border border-ember-card-border rounded-3xl p-10 flex flex-col justify-between min-h-[280px]">
            <div>
              <p className="uppercase tracking-[0.18em] text-xs text-ember-muted mb-5">
                Ember Philosophy
              </p>
              <h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] text-ember-ink">
                Every goal weight
                <br />
                is a mountain.
                <br />
                <span className="italic text-ember-amber">
                  Ember shows the trail.
                </span>
              </h1>
            </div>
            <p className="max-w-md text-ember-muted leading-relaxed mt-8">
              Forget meal plans and complicated macros. Ember tracks one thing:
              the calorie distance between where you are and where you want to be.
            </p>
          </div>

          {/* Mountain Card */}
          <div className="relative overflow-hidden bg-ember-forest rounded-3xl p-8 min-h-[280px] flex flex-col justify-end">
            <div className="absolute inset-0 opacity-[0.05]">
              <svg width="100%" height="100%" viewBox="0 0 400 400" className="w-full h-full">
                <path
                  d="M0 220C80 120 160 320 240 220C320 120 400 260 400 260"
                  stroke="white"
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="uppercase tracking-[0.15em] text-xs text-ember-forest-text">
              The Mountain
            </p>
            <p className="text-6xl text-[#f7f3ea] mt-3">
              7,700
            </p>
            <p className="text-sm text-ember-forest-muted mt-4 leading-relaxed">
              Roughly the number of calories stored in one kilogram of body fat.
              Every calorie deficit chips away at the mountain.
            </p>
          </div>

          {/* Step 1 */}
          <div className="bg-ember-card border border-ember-card-border rounded-3xl p-8">
            <div className="w-8 h-8 rounded-full bg-ember-amber/10 text-ember-amber flex items-center justify-center text-xs font-medium mb-5">
              01
            </div>
            <h3 className="text-2xl mb-3 text-ember-ink">
              Define the summit
            </h3>
            <p className="text-ember-muted leading-relaxed">
              Enter your current weight and your target. Ember calculates the
              total calorie deficit required to reach it.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-ember-card border border-ember-card-border rounded-3xl p-8">
            <div className="w-8 h-8 rounded-full bg-ember-amber/10 text-ember-amber flex items-center justify-center text-xs font-medium mb-5">
              02
            </div>
            <h3 className="text-2xl mb-3 text-ember-ink">
              Log each day
            </h3>
            <p className="text-ember-muted leading-relaxed">
              Track food, steps, and activities. Ember automatically turns your
              daily habits into a running calorie deficit.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-ember-card border border-ember-card-border rounded-3xl p-8">
            <div className="w-8 h-8 rounded-full bg-ember-amber/10 text-ember-amber flex items-center justify-center text-xs font-medium mb-5">
              03
            </div>
            <h3 className="text-2xl mb-3 text-ember-ink">
              Watch it shrink
            </h3>
            <p className="text-ember-muted leading-relaxed">
              See your remaining calorie mountain decrease over time and get a
              projected finish date based on your real progress.
            </p>
          </div>

          {/* Progress Visual */}
          <div className="bg-ember-forest-pale rounded-3xl p-8 flex flex-col justify-between min-h-[240px]">
            <div>
              <p className="uppercase tracking-[0.18em] text-xs text-ember-forest-light mb-4">
                Progress
              </p>
              <h3 className="text-3xl text-ember-forest">
                The summit gets
                <br />
                closer every day.
              </h3>
            </div>
            <div>
              <div className="h-4 rounded-full bg-ember-forest-muted/40 overflow-hidden">
                <div className="h-full w-[68%] bg-ember-forest-light" />
              </div>
              <p className="text-sm text-ember-forest-light mt-3">
                Your deficit accumulates like miles on a trail.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="lg:col-span-2 bg-ember-forest rounded-3xl p-8">
            <p className="uppercase tracking-[0.18em] text-xs text-ember-forest-text mb-8">
              Trail Tools
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Daily Deficit Tracking",
                  body: "Food and activity logging connected to one simple metric.",
                },
                {
                  title: "TDEE Estimator",
                  body: "Estimate how much energy your body burns each day.",
                },
                {
                  title: "Calendar Heatmap",
                  body: "Spot streaks, patterns, and consistency over time.",
                },
                {
                  title: "Finish Projection",
                  body: "Forecast your goal date using your actual average progress.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-ember-forest-mid border border-ember-forest-light/30 rounded-2xl p-5"
                >
                  <p className="text-[#f7f3ea] mb-2">{item.title}</p>
                  <p className="text-sm text-ember-forest-muted leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-ember-forest rounded-3xl p-8 flex flex-col justify-between min-h-[240px]">
            <div>
              <p className="uppercase tracking-[0.18em] text-xs text-ember-forest-muted mb-4">
                Start Today
              </p>
              <h3 className="text-3xl text-[#f7f3ea] leading-tight">
                Ready for
                <br />
                the first step?
              </h3>
            </div>
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center gap-2 bg-[#f7f3ea] text-ember-forest px-5 py-3 rounded-xl font-medium w-fit hover:-translate-y-px transition-transform"
            >
              {isSignedIn ? "Open dashboard" : "Start climbing"}
              →
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}