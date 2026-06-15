"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-4">
      <nav
        className={`
          w-full max-w-3xl h-12 flex items-center justify-between
          px-2 rounded-full border transition-all duration-300 backdrop-blur-xl
          ${scrolled
            ? "bg-background/55 backdrop-blur-xl border-border shadow-sm"
            : "bg-background/10 backdrop-blur-xl shadow-xl text-white"
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 pl-2">
          <Image src="/ember.png" alt="Ember Logo" width={28} height={28} className="rounded-full" />
            <span className="text-sm font-bold tracking-tight text-secondary-foreground">
                ember 
                <span className="text-orange-400 font-bold">.</span>
            </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            how it works
          </Link>
          <Link href="#the-math" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            the math
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pr-1">
          {!isLoaded ? (
            <div className="w-7 h-7 rounded-full bg-muted animate-pulse" />
          ) : isSignedIn ? (
            <>
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
              >
                sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-xs font-semibold px-4 py-2 rounded-full bg-secondary-foreground text-background hover:opacity-80 transition-opacity"
              >
                get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}