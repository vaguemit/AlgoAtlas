import LevelSheetTable from "./LevelSheetTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LevelSheetPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-mono font-bold mb-2">Level Sheet</h1>
          <p className="text-muted-foreground">
            Find the perfect contest level for your skills. Contest durations vary based on the level.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/train-contest">Start Training</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Difficulty Guide</CardTitle>
            <CardDescription>Understanding the rating ranges</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-emerald-500 dark:text-emerald-400 font-bold">Beginner</div>
              <div className="text-sm text-muted-foreground">&lt; 1200</div>
            </div>
            <div>
              <div className="text-blue-500 dark:text-blue-400 font-bold">Intermediate</div>
              <div className="text-sm text-muted-foreground">1200 - 1399</div>
            </div>
            <div>
              <div className="text-purple-500 dark:text-purple-400 font-bold">Advanced</div>
              <div className="text-sm text-muted-foreground">1400 - 1599</div>
            </div>
            <div>
              <div className="text-yellow-500 dark:text-yellow-400 font-bold">Expert</div>
              <div className="text-sm text-muted-foreground">1600 - 1899</div>
            </div>
            <div>
              <div className="text-red-500 dark:text-red-400 font-bold">Master</div>
              <div className="text-sm text-muted-foreground">&gt; 1900</div>
            </div>
          </CardContent>
        </Card>

        <LevelSheetTable />
      </div>
    </div>
  )
}

