"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SyntaxHighlighterProps {
  code: string
  language: string
  lineNumbers?: boolean
}

export function SyntaxHighlighter({ code, language, lineNumbers = true }: SyntaxHighlighterProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const highlight = async () => {
      if (typeof window !== "undefined" && codeRef.current) {
        try {
          const Prism = (await import("prismjs")).default

          // Dynamically import language support
          if (language === "cpp") {
            await import("prismjs/components/prism-c")
            await import("prismjs/components/prism-cpp")
          } else if (language === "python") {
            await import("prismjs/components/prism-python")
          } else if (language === "java") {
            await import("prismjs/components/prism-java")
          }

          // Apply highlighting
          Prism.highlightElement(codeRef.current)
        } catch (error) {
          console.error("Error highlighting code:", error)
        }
      }
    }

    highlight()
  }, [code, language])

  // Apply custom styling for different tokens
  const getCodeClasses = () => {
    return cn(
      "block w-full overflow-x-auto",
      language === "cpp" && "language-cpp",
      language === "python" && "language-python",
      language === "java" && "language-java",
    )
  }

  return (
    <pre className="text-sm bg-transparent m-0 p-0">
      <code ref={codeRef} className={getCodeClasses()}>
        {code}
      </code>
    </pre>
  )
}

