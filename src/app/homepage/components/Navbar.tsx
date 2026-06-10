"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useUser, UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/ember.png" alt="Ember Logo" className="w-8 h-8" />
          <span className="font-bold text-foreground tracking-tight">ember</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            how it works
          </Link>
          <Link href="#the-math" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            the math
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {!isLoaded ? (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          ) : isSignedIn ? (
            <>
            <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-gray-950 text-white hover:bg-gray-800 transition-colors"
              >
                get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}