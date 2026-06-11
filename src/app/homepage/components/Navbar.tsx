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
            ? "bg-background/80 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/ember.png" alt="Ember Logo" className="w-8 h-8" />
          <span className="font-bold text-foreground tracking-tight">ember</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            how it works
          </Link>
          <Link href="#the-math" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            the math
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {!isLoaded ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : isSignedIn ? (
            <>
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
             <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                sign in
              </Link>
              <Link href="/sign-up" className="text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}