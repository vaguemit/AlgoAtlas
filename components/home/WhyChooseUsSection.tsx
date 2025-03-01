import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export function WhyChooseUsSection() {
  return (
    <section className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Why Choose AlgoAtlas?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We offer a comprehensive platform designed to help you systematically improve your competitive programming
          skills.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BenefitCard
          title="Structured Learning Paths"
          description="Follow curated learning paths from beginner to advanced."
        />
        <BenefitCard title="Personalized Practice" description="Train with contests tailored to your skill level." />
        <BenefitCard title="Community Support" description="Connect with fellow competitive programmers." />
        <BenefitCard title="Progress Tracking" description="Monitor your improvement with detailed analytics." />
        <BenefitCard title="Expert Guidance" description="Learn from experienced competitive programmers." />
        <BenefitCard title="Comprehensive Resources" description="Access a vast library of tutorials and problems." />
      </div>
    </section>
  )
}

function BenefitCard({ title, description }) {
  return (
    <Card className="transition-all hover:shadow-md hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

