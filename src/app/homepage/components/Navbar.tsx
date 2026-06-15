"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useUser, UserButton } from "@clerk/nextjs"

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
            ? "bg-white/55 border-border shadow-sm"
            : "bg-white/10 border-transparent shadow-xl"
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 pl-2">
          <Image src="/ember_logo.png" alt="Ember Logo" width={28} height={28} className="rounded-full" />
          <span className="text-sm font-bold tracking-tight text-gray-800">
            ember
            <span className="text-orange-400 font-bold">.</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5 pr-1">
          {!isLoaded ? (
            <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
          ) : isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors px-3 py-2"
              >
                sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-xs font-semibold px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-400 transition-colors text-white hover:opacity-80 transition-opacity"
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