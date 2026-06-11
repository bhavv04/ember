"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  LayoutDashboard,
  PencilLine,
  Scale,
  Settings,
} from "lucide-react"

const links = [
  { href: "/dashboard", label: "dashboard", icon: LayoutDashboard },
  { href: "/log",       label: "log",       icon: PencilLine },
  { href: "/weigh-in",  label: "weigh in",  icon: Scale },
  { href: "/settings",  label: "settings",  icon: Settings },
]

export default function DashboardNavbar() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Top bar ── */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/ember.png" alt="Ember Logo" className="w-8 h-8" />
            <span className="font-bold text-foreground tracking-tight text-sm">ember</span>
          </Link>

          {/* Desktop links — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  pathname === link.href
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>

        </div>
      </nav>

      {/* ── Mobile bottom tab bar — hidden on sm+ ── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border">
        <div className="flex items-center h-16 px-1 pb-safe">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={active ? "text-foreground" : ""}
                />
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