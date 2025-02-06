import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { CodeforcesUser } from "@/types/codeforces"

interface UserProfileProps {
  user: CodeforcesUser
}

export function UserProfile({ user }: UserProfileProps) {
  const getRankColor = (rank: string) => {
    const colors: { [key: string]: string } = {
      newbie: "gray",
      pupil: "green",
      specialist: "cyan",
      expert: "blue",
      "candidate master": "violet",
      master: "orange",
      "international master": "orange",
      grandmaster: "red",
      "international grandmaster": "red",
      "legendary grandmaster": "red",
    }
    return colors[rank.toLowerCase()] || "gray"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={user.titlePhoto || "/placeholder.svg"}
              alt={`${user.handle}'s profile`}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <CardTitle>{user.handle}</CardTitle>
            <CardDescription>
              <Badge className={`bg-${getRankColor(user.rank)}-500`}>{user.rank}</Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Rating</p>
            <p className="text-lg font-semibold">{user.rating}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Max Rating</p>
            <p className="text-lg font-semibold">{user.maxRating}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Max Rank</p>
            <p className="text-lg font-semibold">{user.maxRank}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Contribution</p>
            <p className="text-lg font-semibold">{user.contribution}</p>
          </div>
          {user.organization && (
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Organization</p>
              <p className="text-lg font-semibold">{user.organization}</p>
            </div>
          )}
          {user.country && (
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-lg font-semibold">
                {user.country}
                {user.city ? `, ${user.city}` : ""}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

