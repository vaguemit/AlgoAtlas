import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Competitive Programming Skills?</h2>
        <p className="text-muted-foreground mb-6">
          Start your journey today and join thousands of programmers who have improved their algorithmic thinking and
          problem-solving abilities.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="gap-2">
            Create Account <ArrowRight className="h-4 w-4" />
          </Button>
          <Link href="/learning-paths">
            <Button variant="outline" size="lg">
              Browse Learning Paths
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

