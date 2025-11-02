import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MisFIT Check-ins",
  description: "Track your daily check-ins and build unstoppable streaks",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  openGraph: {
    title: "MisFIT Check-ins",
    description: "Daily check-ins, streaks, and challenges on Base",
    images: ["/og-image.png"],
  },
  other: { manifest: "/manifest.json" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">{children}</main>
      </body>
    </html>
  )
}
