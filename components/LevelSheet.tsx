import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LevelSheet() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Level Sheet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Explore the level sheet to determine which contest level suits you best. It's recommended to follow the level
          suggested by ThemeCP, which will be shown on the contest page.
        </p>
        <Button asChild>
          <Link href="/level-sheet">View Detailed Level Guide</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

