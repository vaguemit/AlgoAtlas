import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          The Codeforces Arena
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/learning-paths">Learning Paths</Link>
          <Link href="/problems">Problems</Link>
          <Link href="/dashboard">Dashboard</Link>
          <ModeToggle />
          <Button>Sign In</Button>
        </div>
      </div>
    </nav>
  )
}

