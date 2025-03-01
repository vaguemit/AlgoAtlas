import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Trophy, Users } from "lucide-react"
import Link from "next/link"

export function FeaturesSection() {
  return (
    <section className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Why Choose AlgoAtlas?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our platform is designed to help you systematically improve your competitive programming skills through a
          combination of learning, practice, and competition.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<BookOpen className="h-6 w-6 text-primary" />}
          title="Structured Learning"
          description="Follow our carefully crafted learning paths from Emerald to Diamond and beyond"
          content="Each path contains curated resources, practice problems, and assessments to ensure mastery of key concepts."
          link="/learning-paths"
          linkText="Explore Paths"
        />
        <FeatureCard
          icon={<Trophy className="h-6 w-6 text-blue-500" />}
          title="Personalized Contests"
          description="Train with contests tailored to your current skill level"
          content="Our system generates contests with problems that match your abilities, helping you improve steadily without frustration."
          link="/train-contest"
          linkText="Start Training"
        />
        <FeatureCard
          icon={<Users className="h-6 w-6 text-emerald-500" />}
          title="Community Support"
          description="Connect with fellow competitive programmers"
          content="Discuss problems, share solutions, and learn from others in our community of competitive programming enthusiasts."
          link="/dashboard"
          linkText="Join Community"
        />
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description, content, link, linkText }) {
  return (
    <Card className="transition-all hover:shadow-md hover:-translate-y-1">
      <CardHeader>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{content}</p>
      </CardContent>
      <CardFooter>
        <Link href={link}>
          <Button variant="ghost" className="gap-2">
            {linkText} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

