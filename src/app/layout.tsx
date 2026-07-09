import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { ThemeProvider } from "../components/ui/theme-provider"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Ember",
  description: "Visualize the math behind your weight loss goal",
  applicationName: "Ember",
  metadataBase: new URL("https://myember.vercel.app"), 
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Ember",
    description: "Visualize the math behind your weight loss goal",
    url: "https://yourdomain.com",
    siteName: "Ember",
    images: [
      {
        url: "/ember_logo.png", // or embermath_bg.png if you want the hero shot
        width: 1200,
        height: 630,
        alt: "Ember — Visualize the math behind your weight loss goal",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ember",
    description: "Visualize the math behind your weight loss goal",
    images: ["/ember_logo.png"],
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