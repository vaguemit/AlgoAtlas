import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Welcome to AlgoMaster</h1>
      <p className="text-xl mb-8">
        Master competitive programming, algorithms, and computer science concepts with our comprehensive learning
        platform.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Structured Learning Paths</h2>
          <p className="mb-4">
            Follow our carefully crafted learning paths to build your skills from beginner to advanced levels.
          </p>
          <Link href="/learning-paths">
            <Button>Explore Paths</Button>
          </Link>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Problem Repository</h2>
          <p className="mb-4">
            Practice with our extensive collection of coding problems, categorized by difficulty and topic.
          </p>
          <Link href="/problems">
            <Button>Solve Problems</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

