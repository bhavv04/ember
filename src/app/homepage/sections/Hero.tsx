"use client"

import Link from "next/link"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"

export default function Hero() {
  const { isSignedIn } = useUser()

  return (
    <section className="relative h-screen overflow-hidden">

    <div className="relative h-full w-full">
      <Image
        src="/ember_bg.png"
        alt="A runner on a misty mountain trail at dawn"
        fill
        priority
        className="object-cover object-[center_25%]"
      />

      {/* Gradient scrim — dark at bottom, almost clear at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />

      {/* Hero copy — anchored to bottom-left */}
      <div className="absolute inset-0 flex flex-col justify-end px-12 pb-16">
        <p className="text-sm text-white/90 mb-4">
          Weight loss, simplified
        </p>

        <h1 className="font-serif text-[clamp(40px,6vw,72px)] font-normal leading-[1.04] tracking-[-0.02em] text-white max-w-2xl mb-9">
          The mountain gets smaller<br />
          every single{" "}
          <em className="italic text-orange-400 not-italic" style={{ fontStyle: "italic" }}>
            day.
          </em>
        </h1>

        <div className="flex items-center gap-6">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="inline-flex items-center gap-2 px-7 py-3 bg-orange-500 hover:bg-orange-400 transition-colors text-white rounded-md text-xs font-medium font-sans tracking-wide"
          >
            {isSignedIn ? "View dashboard" : "Start climbing"} →
          </Link>
          <Link
            href="/how-it-works"
            className="text-xs text-white/45 hover:text-white/80 transition-colors font-sans border-b border-white/25 pb-px"
          >
            See how it works
          </Link>
        </div>
      </div>
      </div>
    </section>
  )
}