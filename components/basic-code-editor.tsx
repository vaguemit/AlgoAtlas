"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface BasicCodeEditorProps {
  code: string
  language: string
}

export function BasicCodeEditor({ code, language }: BasicCodeEditorProps) {
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)
  const lines = code.split("\n")

  return (
    <div className="bg-black rounded-md overflow-hidden">
      <div className="max-h-[400px] overflow-auto">
        <div className="min-w-max">
          <div className="p-4 font-mono text-xs sm:text-sm">
            <div className="flex">
              {/* Line numbers */}
              <div className="pr-4 text-right text-gray-500 select-none">
                {lines.map((_, index) => (
                  <div
                    key={index}
                    className={cn("transition-colors duration-200", highlightedLine === index ? "text-gray-300" : "")}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Code without syntax highlighting */}
              <div>
                {lines.map((line, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative group transition-colors duration-200 whitespace-pre",
                      highlightedLine === index ? "bg-primary/10" : "hover:bg-primary/5",
                    )}
                    onMouseEnter={() => setHighlightedLine(index)}
                    onMouseLeave={() => setHighlightedLine(null)}
                  >
                    {line || " "}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

