import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary, ErrorToast } from "@/components/ErrorBoundary"
import { AuthProvider } from "@/contexts/auth-context"
import { AnimatePresence } from "framer-motion"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <AnimatePresence mode="wait">
                  <main className="flex-grow">{children}</main>
                </AnimatePresence>
                <footer className="py-6 text-center border-t">© 2024 AlgoAtlas. All rights reserved.</footer>
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

