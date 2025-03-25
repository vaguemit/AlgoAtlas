import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { FloatingChatBubble } from "@/components/floating-chat-bubble"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

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
      <body
        className={`${inter.className} ${inter.variable} bg-gradient-to-b from-[#0D0D0D] via-[#2E0854] to-[#4B0082] min-h-screen text-white antialiased`}
      >
        <ThemeProvider>
          <div className="relative overflow-hidden">
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pt-16 pb-16">{children}</main>
              <Footer />
              <FloatingChatBubble />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'