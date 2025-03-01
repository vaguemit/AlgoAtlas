import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"
import { FeatureCards } from "./FeatureCards"

export function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-12">
      <div className="lg:w-1/2 space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Master Competitive Programming with <span className="text-primary">AlgoAtlas</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Elevate your algorithmic skills through structured learning paths, targeted practice, and personalized
          contests.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Button size="lg" className="gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
          <Link href="/learning-paths">
            <Button variant="outline" size="lg" className="gap-2">
              Explore Learning Paths <BookOpen className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="lg:w-1/2">
        <FeatureCards />
      </div>
    </section>
  )
}

