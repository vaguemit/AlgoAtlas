"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import type {
  CodeforcesUser,
  CodeforcesFriend,
  CodeforcesSubmission,
  CodeforcesContest,
  CodeforcesProblem,
} from "@/types/codeforces"

interface ProfilePageProps {
  params: {
    handle: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [userData, setUserData] = useState<CodeforcesUser | null>(null)
  const [friends, setFriends] = useState<CodeforcesFriend[]>([])
  const [submissions, setSubmissions] = useState<CodeforcesSubmission[]>([])
  const [contests, setContests] = useState<CodeforcesContest[]>([])
  const [ratingData, setRatingData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user info
        const response = await fetch(`/api/codeforces?method=user.info&handles=${params.handle}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.status === "OK" && data.result.length > 0) {
          setUserData(data.result[0])
        } else {
          throw new Error(data.comment || "Failed to fetch user info")
        }

        // Fetch friends
        const friendsResponse = await fetch(`/api/codeforces?method=user.friends&handle=${params.handle}`)
        if (!friendsResponse.ok) {
          throw new Error(`HTTP error! status: ${friendsResponse.status}`)
        }
        const friendsData = await friendsResponse.json()
        if (friendsData.status === "OK") {
          setFriends(friendsData.result)
        } else {
          throw new Error(friendsData.comment || "Failed to fetch friends")
        }

        // Fetch submissions
        const submissionsResponse = await fetch(`/api/codeforces?method=user.status&handle=${params.handle}`)
        if (!submissionsResponse.ok) {
          throw new Error(`HTTP error! status: ${submissionsResponse.status}`)
        }
        const submissionsData = await submissionsResponse.json()
        if (submissionsData.status === "OK") {
          setSubmissions(submissionsData.result)
        } else {
          throw new Error(submissionsData.comment || "Failed to fetch submissions")
        }

        // Fetch rating history
        const ratingResponse = await fetch(`/api/codeforces?method=user.rating&handle=${params.handle}`)
        if (!ratingResponse.ok) {
          throw new Error(`HTTP error! status: ${ratingResponse.status}`)
        }
        const ratingData = await ratingResponse.json()
        if (ratingData.status === "OK") {
          setRatingData(ratingData.result)
          setContests(ratingData.result)
        } else {
          throw new Error(ratingData.comment || "Failed to fetch rating history")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [params.handle])

  if (isLoading) {
    return <div className="container mx-auto px-6 py-12">Loading...</div>
  }

  if (error || !userData) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "User not found"}</p>
            <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
              Return to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const unsolvedProblems = submissions
    .filter((sub) => sub.verdict !== "OK")
    .map((sub) => sub.problem)
    .filter(
      (prob, index, self) =>
        index === self.findIndex((p: CodeforcesProblem) => p.contestId === prob.contestId && p.index === prob.index),
    )

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{userData.handle}</span>
                <Badge>{userData.rank}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <Image
                  src={userData.titlePhoto || "/placeholder.svg"}
                  alt={`${userData.handle}'s profile`}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="space-y-2">
                <p>Contest rating: {userData.rating}</p>
                <p>Max rating: {userData.maxRating}</p>
                <p>Contribution: {userData.contribution}</p>
                <p>Friend of: {userData.friendOfCount} users</p>
                {userData.organization && <p>Organization: {userData.organization}</p>}
                {userData.country && <p>Location: {userData.country}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Friends List */}
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {friends.map((friend) => (
                  <Link href={`/profile/${friend.handle}`} key={friend.handle}>
                    <div className="flex items-center space-x-4 hover:bg-accent p-2 rounded-md">
                      <Image
                        src={friend.titlePhoto || "/placeholder.svg"}
                        alt={friend.handle}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{friend.handle}</p>
                        <p className="text-sm text-muted-foreground">{friend.rank}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle and Right Columns */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="rating">
            <TabsList>
              <TabsTrigger value="rating">Rating</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="unsolved">Unsolved Problems</TabsTrigger>
              <TabsTrigger value="contests">Contests</TabsTrigger>
            </TabsList>

            <TabsContent value="rating">
              <Card>
                <CardHeader>
                  <CardTitle>Rating History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ratingData}>
                        <XAxis
                          dataKey="ratingUpdateTimeSeconds"
                          tickFormatter={(unixTime) => format(new Date(unixTime * 1000), "MMM yyyy")}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(unixTime) => format(new Date(unixTime * 1000), "MMM dd, yyyy")}
                        />
                        <Line type="monotone" dataKey="newRating" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submissions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissions.slice(0, 10).map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                      >
                        <div>
                          <Link
                            href={`https://codeforces.com/contest/${submission.contestId}/problem/${submission.problem.index}`}
                            className="font-medium hover:underline"
                          >
                            {submission.problem.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(submission.creationTimeSeconds * 1000), "MMM dd, yyyy HH:mm")}
                          </p>
                        </div>
                        <Badge variant={submission.verdict === "OK" ? "success" : "destructive"}>
                          {submission.verdict}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unsolved">
              <Card>
                <CardHeader>
                  <CardTitle>Unsolved Problems</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {unsolvedProblems.slice(0, 10).map((problem) => (
                      <div
                        key={`${problem.contestId}-${problem.index}`}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                      >
                        <Link
                          href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
                          className="font-medium hover:underline"
                        >
                          {problem.name}
                        </Link>
                        <div className="flex items-center space-x-2">
                          <Badge>{problem.rating}</Badge>
                          {problem.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contests">
              <Card>
                <CardHeader>
                  <CardTitle>Contest History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contests.map((contest) => (
                      <div
                        key={contest.contestId}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                      >
                        <div>
                          <Link
                            href={`https://codeforces.com/contest/${contest.contestId}`}
                            className="font-medium hover:underline"
                          >
                            {contest.contestName}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(contest.ratingUpdateTimeSeconds * 1000), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="flex items-center<cut_off_point>
p>
                        </div>
                        <div className="flex items-center
</cut_off_point>

 space-x-2">
                          <Badge variant={contest.newRating > contest.oldRating ? "success" : "destructive"}>
                            {contest.newRating - contest.oldRating > 0 ? "+" : ""}
                            {contest.newRating - contest.oldRating}
                          </Badge>
                          <span>{contest.newRating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  </div>
  )
}

