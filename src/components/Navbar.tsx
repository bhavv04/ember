"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { LayoutDashboard, PencilLine, Scale, Settings } from "lucide-react"

const links = [
  { href: "/dashboard", label: "dashboard", icon: LayoutDashboard },
  { href: "/log",       label: "log",       icon: PencilLine },
  { href: "/weigh-in",  label: "weigh in",  icon: Scale },
  { href: "/settings",  label: "settings",  icon: Settings },
]

export default function DashboardNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* ── Top bar ── */}
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
          <Link href="/dashboard" className="flex items-center gap-2 pl-2">
            <Image src="/ember_logo.png" alt="Ember Logo" width={28} height={28} className="rounded-full" />
            <span className="text-sm font-bold tracking-tight text-gray-800">
              ember
              <span className="text-orange-400 font-bold">.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-0.5">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  pathname === href
                    ? "bg-black/10 text-gray-900 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center pr-1">
            <UserButton afterSignOutUrl="/" />
          </div>
        </nav>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border">
        <div className="flex items-center h-16 px-1 pb-safe">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className={`text-[10px] leading-none ${active ? "font-medium" : ""}`}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}