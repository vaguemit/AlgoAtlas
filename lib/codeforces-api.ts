interface CodeforcesSubmission {
  id: number
  contestId: number
  problem: {
    contestId: number
    index: string
    name: string
  }
  creationTimeSeconds: number
  verdict: string
}

export async function getLastSubmissions(handle: string): Promise<CodeforcesSubmission[]> {
  try {
    const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`)
    const data = await response.json()
    
    if (data.status === 'OK') {
      return data.result
    }
    throw new Error('Failed to fetch submissions')
  } catch (error) {
    console.error('Error fetching submissions:', error)
    throw error
  }
}

export async function verifyCodeforcesHandle(handle: string): Promise<boolean> {
  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`)
    const data = await response.json()
    return data.status === 'OK'
  } catch (error) {
    return false
  }
}

export function checkProblemSolved(
  submissions: CodeforcesSubmission[],
  contestId: number,
  index: string,
  startTime: number
): boolean {
  return submissions.some(submission => 
    submission.problem.contestId === contestId &&
    submission.problem.index === index &&
    submission.verdict === 'OK' &&
    submission.creationTimeSeconds * 1000 >= startTime
  )
} 