import "./globals.css"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary, ErrorToast } from "@/components/ErrorBoundary"
import { AuthProvider } from "@/contexts/auth-context"
import { AnimatePresence } from "framer-motion"
import type React from "react" // Added import for React

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistMono.className}>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <AnimatePresence mode="wait">
                  <main className="flex-grow">{children}</main>
                </AnimatePresence>
              </div>
              <Toaster />
              <ErrorToast />
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

