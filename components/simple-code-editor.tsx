"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface SimpleCodeEditorProps {
  code: string
  language: string
}

// Function to tokenize and highlight code
function tokenizeCode(code: string, language: string) {
  // Split the code into lines
  const lines = code.split("\n")

  // Define token types and their corresponding colors
  const tokenTypes = {
    keyword: "text-blue-400",
    string: "text-green-400",
    comment: "text-gray-500",
    number: "text-orange-400",
    function: "text-purple-400",
    operator: "text-yellow-400",
    type: "text-cyan-400",
    default: "text-white",
  }

  // Define regex patterns for different token types based on language
  const patterns: Record<string, Record<string, RegExp>> = {
    cpp: {
      keyword:
        /\b(if|else|for|while|do|switch|case|break|continue|return|void|int|char|float|double|bool|struct|class|public|private|protected|const|static|namespace|using|include|define|typedef|template|virtual|new|delete|try|catch|throw)\b/g,
      string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,
      comment: /\/\/.*|\/\*[\s\S]*?\*\//g,
      number: /\b\d+(\.\d+)?\b/g,
      function: /\b([a-zA-Z_]\w*)\s*\(/g,
      operator: /[+\-*/%=<>!&|^~?:]/g,
      type: /\b(vector|string|map|set|pair|queue|stack|deque|list|array|iostream|algorithm)\b/g,
    },
    python: {
      keyword:
        /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g,
      string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|"""[\s\S]*?"""|'''[\s\S]*?'''/g,
      comment: /#.*/g,
      number: /\b\d+(\.\d+)?\b/g,
      function: /\b([a-zA-Z_]\w*)\s*\(/g,
      operator: /[+\-*/%=<>!&|^~?:]/g,
      type: /\b(int|str|list|dict|set|tuple|float|bool|None|True|False)\b/g,
    },
    java: {
      keyword:
        /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g,
      string: /"(?:[^"\\]|\\.)*"/g,
      comment: /\/\/.*|\/\*[\s\S]*?\*\//g,
      number: /\b\d+(\.\d+)?\b/g,
      function: /\b([a-zA-Z_]\w*)\s*\(/g,
      operator: /[+\-*/%=<>!&|^~?:]/g,
      type: /\b(String|Integer|Boolean|Double|Float|Object|ArrayList|HashMap|List|Map|Set)\b/g,
    },
  }

  // Process each line
  return lines.map((line) => {
    // Create spans for each token type
    let processedLine = line

    // Skip processing if line is empty
    if (!line.trim()) {
      return { __html: "&nbsp;" }
    }

    // Get patterns for the current language
    const langPatterns = patterns[language] || {}

    // Replace HTML special characters to prevent XSS
    processedLine = processedLine.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

    // Apply syntax highlighting
    for (const [type, pattern] of Object.entries(langPatterns)) {
      processedLine = processedLine.replace(pattern, (match) => {
        // For function matches, we only want to highlight the function name, not the parenthesis
        if (type === "function") {
          const funcName = match.slice(0, -1) // Remove the trailing parenthesis
          return `<span class="${tokenTypes[type]}">${funcName}</span>(`
        }
        return `<span class="${tokenTypes[type]}">${match}</span>`
      })
    }

    return { __html: processedLine }
  })
}

export function SimpleCodeEditor({ code, language }: SimpleCodeEditorProps) {
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)
  const lines = code.split("\n")
  const tokenizedLines = tokenizeCode(code, language)

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

              {/* Code with syntax highlighting */}
              <div>
                {tokenizedLines.map((line, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative group transition-colors duration-200 whitespace-pre",
                      highlightedLine === index ? "bg-primary/10" : "hover:bg-primary/5",
                    )}
                    onMouseEnter={() => setHighlightedLine(index)}
                    onMouseLeave={() => setHighlightedLine(null)}
                  >
                    <span dangerouslySetInnerHTML={line} />
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

