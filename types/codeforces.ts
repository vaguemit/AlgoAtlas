export interface CodeforcesUser {
  handle: string
  email?: string
  vkId?: string
  titlePhoto: string
  avatar: string
  rank: string
  rating: number
  maxRank: string
  maxRating: number
  lastOnlineTimeSeconds: number
  registrationTimeSeconds: number
  friendOfCount: number
  contribution: number
  organization?: string
  country?: string
  city?: string
}

export interface CodeforcesFriend {
  handle: string
  rank: string
  rating: number
  titlePhoto: string
}

export interface CodeforcesSubmission {
  id: number
  contestId: number
  creationTimeSeconds: number
  relativeTimeSeconds: number
  problem: CodeforcesProblem
  author: {
    contestId: number
    members: { handle: string }[]
    participantType: string
    ghost: boolean
    startTimeSeconds: number
  }
  programmingLanguage: string
  verdict: string
  testset: string
  passedTestCount: number
  timeConsumedMillis: number
  memoryConsumedBytes: number
}

export interface CodeforcesContest {
  id: number
  name: string
  type: string
  phase: string
  frozen: boolean
  durationSeconds: number
  startTimeSeconds: number
  relativeTimeSeconds: number
  preparedBy?: string
  websiteUrl?: string
  description?: string
  difficulty?: number
  kind?: string
  icpcRegion?: string
  country?: string
  city?: string
  season?: string
}

export interface CodeforcesProblem {
  contestId: number
  problemsetName?: string
  index: string
  name: string
  type: string
  points?: number
  rating?: number
  tags: string[]
}

export interface CodeforcesApiResponse {
  status: string
  result: any
  comment?: string
}

