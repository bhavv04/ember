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
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-ember-page/95 backdrop-blur-sm border-b transition-colors duration-300 ${
          scrolled ? "border-ember-card-border" : "border-transparent"
        }`}
      >
        <nav className="max-w-4xl mx-auto h-14 flex items-center justify-between px-6 sm:px-10">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/ember_logo.png" alt="Ember Logo" width={22} height={22} className="rounded-full" />
            <span className="text-sm font-mono font-medium tracking-tight text-ember-ink">
              ember<span className="text-ember-amber">.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-8 font-mono text-xs uppercase tracking-wide">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`border-b pb-1 transition-colors ${
                    active
                      ? "text-ember-ink border-ember-amber"
                      : "text-ember-muted border-transparent hover:text-ember-ink hover:border-ember-card-border"
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Right */}
          <div className="flex items-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </nav>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-ember-page border-t border-ember-card-border">
        <div className="flex items-center h-16 px-1 pb-safe">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${
                  active ? "text-ember-ink" : "text-ember-muted hover:text-ember-ink"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2 : 1.5} className={active ? "text-ember-amber" : ""} />
                <span className={`text-[10px] leading-none font-mono uppercase tracking-wide ${active ? "font-medium" : ""}`}>
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