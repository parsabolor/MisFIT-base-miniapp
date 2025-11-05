import "./globals.css"
import type { Metadata } from "next"
import RootProviders from "@/components/RootProviders"

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

function ThemeInitScript() {
  const code = `
  try {
    const stored = localStorage.getItem('misfit-theme') || 'system';
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'system' ? (systemDark ? 'dark' : 'light') : stored;
    root.classList.remove('light','dark');
    root.classList.add(theme);
  } catch {}
  `
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
