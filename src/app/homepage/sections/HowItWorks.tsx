import Link from "next/link"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Set your goal",
      description:
        "Enter your current weight and target weight. Ember calculates the exact calorie deficit you need to get there — no guessing.",
      detail: "20 kg → 154,000 kcal to burn",
    },
    {
      number: "02",
      title: "Log your days",
      description:
        "Each day, enter what you ate and your TDEE. Ember tracks your net deficit and adds it to your total progress.",
      detail: "2,500 TDEE − 1,800 eaten = 700 kcal deficit",
    },
    {
      number: "03",
      title: "Weigh in weekly",
      description:
        "Log your weight once a week. Ember uses the change to recalibrate your TDEE automatically — so your numbers stay accurate.",
      detail: "Lost 0.5 kg this week → TDEE adjusted",
    },
    {
      number: "04",
      title: "Watch the mountain shrink",
      description:
        "Your dashboard shows exactly how far you've come and how far you have left — in calories, steps, and a projected goal date.",
      detail: "57,200 / 154,000 kcal · Dec 14 projected",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
            how it works
          </p>
          <h2 className="text-4xl font-bold text-foreground tracking-tight leading-tight">
            Four steps.<br />
            <span className="text-orange-500">One number that matters.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="grid md:grid-cols-[80px_1fr] gap-6 py-10 border-t border-border last:border-b"
            >
              {/* Number */}
              <span className="text-4xl font-bold text-orange-500/20 tabular-nums leading-none pt-1">
                {step.number}
              </span>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
                  {step.description}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                  <span className="text-xs font-mono text-muted-foreground">
                    {step.detail}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-16">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Start for free →
          </Link>
        </div>

      </div>
    </section>
  )
}