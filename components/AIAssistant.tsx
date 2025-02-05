"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function AIAssistant() {
  const [code, setCode] = useState("")
  const [feedback, setFeedback] = useState("")

  const analyzeCode = async () => {
    // In a real application, this would call an API endpoint
    // For this example, we'll use a mock response
    setFeedback(
      "Your code looks good! Here are some suggestions:\n1. Consider using a more efficient sorting algorithm.\n2. You can optimize the space complexity by using an in-place solution.",
    )
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">AI Assistant</h2>
      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here for analysis..."
        className="mb-4"
        rows={10}
      />
      <Button onClick={analyzeCode}>Analyze Code</Button>
      {feedback && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Feedback:</h3>
          <pre className="bg-muted p-4 rounded">{feedback}</pre>
        </div>
      )}
    </div>
  )
}

