import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { FloatingChatBubble } from "@/components/floating-chat-bubble"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { CosmicBackground } from "@/components/cosmic-background"
import { Toaster } from "@/components/ui/toaster"

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
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} ${inter.variable} min-h-screen text-white antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <div className="relative overflow-hidden">
              <CosmicBackground />
              <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16 pb-16">{children}</main>
                <Footer />
                <FloatingChatBubble />
              </div>
              <Toaster />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'