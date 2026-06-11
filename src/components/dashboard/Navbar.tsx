"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function DashboardNavbar() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "dashboard" },
    { href: "/log", label: "log" },
    { href: "/weigh-in", label: "weigh in" },
    { href: "/settings", label: "settings" },
  ]

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/ember.png" alt="Ember Logo" className="w-6 h-6" />
          <span className="font-bold text-foreground tracking-tight text-sm">ember</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
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
  )
}