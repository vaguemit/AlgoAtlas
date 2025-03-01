import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Target, Code, LineChart } from "lucide-react"

export function FeatureCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FeatureCard
        icon={<Trophy className="h-5 w-5 text-primary" />}
        title="Contests"
        description="Train with personalized contests tailored to your skill level"
        className="bg-primary/5 border-primary/10"
      />
      <FeatureCard
        icon={<Target className="h-5 w-5 text-blue-500" />}
        title="Learning Paths"
        description="Follow structured paths from beginner to advanced"
        className="bg-blue-500/5 border-blue-500/10"
      />
      <FeatureCard
        icon={<Code className="h-5 w-5 text-emerald-500" />}
        title="Problem Repository"
        description="Access thousands of curated problems with detailed solutions"
        className="bg-emerald-500/5 border-emerald-500/10"
      />
      <FeatureCard
        icon={<LineChart className="h-5 w-5 text-purple-500" />}
        title="Progress Tracking"
        description="Monitor your improvement with detailed analytics"
        className="bg-purple-500/5 border-purple-500/10"
      />
    </div>
  )
}

function FeatureCard({ icon, title, description, className }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

