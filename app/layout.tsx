import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { CosmicBackground } from "@/components/cosmic-background"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { AssistantWrapper } from "@/components/assistant-wrapper"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimize font display
  variable: "--font-inter",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "AlgoAtlas - Learn Algorithms and Data Structures",
  description: "A platform for learning algorithms and data structures",
  generator: 'v0.dev',
  icons: {
    icon: [
      {
        url: '/compass-logo.png',
        sizes: '32x32',
      },
      {
        url: '/compass-logo.png',
        sizes: '64x64',
      },
    ],
    apple: {
      url: '/compass-logo.png',
      sizes: '180x180',
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/compass-logo.png" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-navy-950 font-sans antialiased overflow-x-hidden",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          <AuthProvider>
            <div className="relative overflow-hidden">
              <CosmicBackground />
              <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16 pb-16">{children}</main>
                <Footer />
              </div>
              <Toaster />
              <AssistantWrapper />
              <Analytics debug={process.env.NODE_ENV === 'development'} />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}