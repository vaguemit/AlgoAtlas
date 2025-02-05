import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AlgoMaster - Learn Competitive Programming",
  description: "A comprehensive platform for learning algorithms and competitive programming",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <footer className="py-6 text-center border-t">© 2023 AlgoMaster. All rights reserved.</footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

