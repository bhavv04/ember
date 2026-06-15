import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { ThemeProvider } from "../components/ui/theme-provider"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ember",
  description: "Visualize the math behind your weight loss goal",
  icons: {
    icon: "/favicon.ico", 
        apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={geist.className}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}