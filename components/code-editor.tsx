"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { SyntaxHighlighter } from "./syntax-highlighter"

interface CodeEditorProps {
  code: string
  language: string
}

export function CodeEditor({ code, language }: CodeEditorProps) {
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)
  const lines = code.split("\n")

  return (
    <div className="bg-black rounded-md overflow-hidden">
      <div className="max-h-[400px] overflow-auto">
        <div className="min-w-max">
          <div className="relative p-4 font-mono text-xs sm:text-sm">
            {/* Syntax highlighted code */}
            <div className="relative">
              <SyntaxHighlighter code={code} language={language} />

              {/* Line numbers and hover effects */}
              <div className="absolute top-0 left-0 right-0">
                {lines.map((line, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative group transition-colors duration-200 flex",
                      highlightedLine === index ? "bg-primary/10" : "hover:bg-primary/5",
                    )}
                    onMouseEnter={() => setHighlightedLine(index)}
                    onMouseLeave={() => setHighlightedLine(null)}
                  >
                    <span className="inline-block w-6 mr-4 text-gray-500 select-none text-right">{index + 1}</span>
                    <div className="invisible">{line || " "}</div>
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

