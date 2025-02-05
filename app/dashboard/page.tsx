import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import AIAssistant from "@/components/AIAssistant"

export default function Dashboard() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Your Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Beginner's Algorithms</span>
                  <span>75%</span>
                </div>
                <Progress value={75} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Intermediate Problem Solving</span>
                  <span>50%</span>
                </div>
                <Progress value={50} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Advanced Competitive Programming</span>
                  <span>25%</span>
                </div>
                <Progress value={25} />
              </div>
            </div>
          </CardContent>
        </Card>
        <AIAssistant />
      </div>
    </div>
  )
}

