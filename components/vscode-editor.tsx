"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface VSCodeEditorProps {
  code: string
  language: string
}

// VS Code Dark+ theme syntax highlighting colors
const vsCodeColors = {
  keyword: "text-[#569cd6]", // blue 
  control: "text-[#c586c0]", // purple
  string: "text-[#ce9178]", // orange-brown
  comment: "text-[#6a9955]", // green
  number: "text-[#b5cea8]", // light green
  function: "text-[#dcdcaa]", // yellow
  type: "text-[#4ec9b0]", // teal
  variable: "text-[#9cdcfe]", // light blue
  parameter: "text-[#9cdcfe]", // light blue
  class: "text-[#4ec9b0]", // teal
  operator: "text-[#d4d4d4]", // light gray
  punctuation: "text-[#d4d4d4]", // light gray
  preprocessor: "text-[#c586c0]", // purple
  default: "text-[#d4d4d4]", // light gray
  decorators: "text-[#dcdcaa]", // yellow
  namespace: "text-[#4ec9b0]", // teal
}

// Simple token-based syntax highlighting
function highlightLine(line: string, language: string): React.ReactNode[] {
  // Simple tokenization for basic syntax highlighting
  const tokens: React.ReactNode[] = []

  // Helper function to add a token with appropriate styling
  const addToken = (text: string, type: keyof typeof vsCodeColors) => {
    tokens.push(
      <span key={tokens.length} className={vsCodeColors[type]}>
        {text}
      </span>,
    )
  }

  // If line is empty, return a non-breaking space
  if (!line.trim()) {
    return [<span key="empty">&nbsp;</span>]
  }

  // Very basic tokenization based on language
  if (language === "cpp") {
    // Handle preprocessor directives
    if (line.trim().startsWith("#")) {
      const parts = line.split(" ")
      addToken(parts[0], "preprocessor")
      if (parts.length > 1) {
        addToken(" ", "default")
        addToken(parts.slice(1).join(" "), "string")
      }
      return tokens
    }

    // Handle comments
    if (line.trim().startsWith("//")) {
      addToken(line, "comment")
      return tokens
    }

    // Very basic tokenization for C++
    const cppTokens = line.split(/(\s+|[;{}()[\],.<>:?|&^~%!+\-*/=]|".*?"|'.*?')/).filter(Boolean)

    for (const token of cppTokens) {
      if (/^\s+$/.test(token)) {
        // Whitespace
        addToken(token, "default")
      } else if (
        /^(int|void|char|double|float|bool|auto|const|static|struct|class|namespace|using|return|if|else|for|while|do|switch|case|break|continue|try|catch|throw|new|delete)$/.test(
          token,
        )
      ) {
        // Keywords
        addToken(token, "keyword")
      } else if (/^(return|if|else|for|while|do)$/.test(token)) {
        // Control flow
        addToken(token, "control")
      } else if (/^".*?"$/.test(token) || /^'.*?'$/.test(token)) {
        // Strings
        addToken(token, "string")
      } else if (/^-?\d+(\.\d+)?$/.test(token)) {
        // Numbers
        addToken(token, "number")
      } else if (/^[A-Za-z_]\w*(?=\s*\()/.test(token)) {
        // Function calls
        addToken(token, "function")
      } else if (/^(vector|string|map|set|pair|queue|stack)$/.test(token)) {
        // Types
        addToken(token, "type")
      } else if (/^[;{}()[\],.<>:?|&^~%!+\-*/=]$/.test(token)) {
        // Punctuation and operators
        addToken(token, "punctuation")
      } else {
        // Default
        addToken(token, "default")
      }
    }
  } else if (language === "python") {
    // Handle comments
    if (line.trim().startsWith("#")) {
      addToken(line, "comment")
      return tokens
    }

    // Very basic tokenization for Python
    const pythonTokens = line.split(/(\s+|[;:,.()[\]{}]|".*?"|'.*?')/).filter(Boolean)

    for (const token of pythonTokens) {
      if (/^\s+$/.test(token)) {
        // Whitespace
        addToken(token, "default")
      } else if (
        /^(def|class|import|from|as|global|nonlocal|lambda|with|yield|assert|del|pass|raise|in|is|not|and|or)$/.test(
          token,
        )
      ) {
        // Keywords
        addToken(token, "keyword")
      } else if (/^(if|elif|else|for|while|try|except|finally|return|break|continue)$/.test(token)) {
        // Control flow
        addToken(token, "control")
      } else if (/^".*?"$/.test(token) || /^'.*?'$/.test(token)) {
        // Strings
        addToken(token, "string")
      } else if (/^-?\d+(\.\d+)?$/.test(token)) {
        // Numbers
        addToken(token, "number")
      } else if (/^[A-Za-z_]\w*(?=\s*\()/.test(token)) {
        // Function calls
        addToken(token, "function")
      } else if (/^(int|str|list|dict|set|tuple|bool|None|True|False)$/.test(token)) {
        // Types and constants
        addToken(token, "type")
      } else if (/^[;:,.()[\]{}]$/.test(token)) {
        // Punctuation
        addToken(token, "punctuation")
      } else {
        // Default
        addToken(token, "default")
      }
    }
  } else if (language === "java") {
    // Handle comments
    if (line.trim().startsWith("//")) {
      addToken(line, "comment")
      return tokens
    }

    // Very basic tokenization for Java
    const javaTokens = line.split(/(\s+|[;{}()[\],.<>:?|&^~%!+\-*/=]|".*?"|'.*?')/).filter(Boolean)

    for (const token of javaTokens) {
      if (/^\s+$/.test(token)) {
        // Whitespace
        addToken(token, "default")
      } else if (
        /^(abstract|assert|boolean|byte|char|class|const|default|enum|extends|final|finally|float|implements|import|instanceof|interface|long|native|package|private|protected|public|short|static|strictfp|super|synchronized|this|throws|transient|volatile)$/.test(
          token,
        )
      ) {
        // Keywords
        addToken(token, "keyword")
      } else if (/^(if|else|for|while|do|switch|case|break|continue|return|try|catch|throw|new)$/.test(token)) {
        // Control flow
        addToken(token, "control")
      } else if (/^".*?"$/.test(token) || /^'.*?'$/.test(token)) {
        // Strings
        addToken(token, "string")
      } else if (/^-?\d+(\.\d+)?$/.test(token)) {
        // Numbers
        addToken(token, "number")
      } else if (/^[A-Za-z_]\w*(?=\s*\()/.test(token)) {
        // Function calls
        addToken(token, "function")
      } else if (/^(int|void|double|boolean|String|Object|ArrayList|HashMap|List|Map|Set)$/.test(token)) {
        // Types
        addToken(token, "type")
      } else if (/^[;{}()[\],.<>:?|&^~%!+\-*/=]$/.test(token)) {
        // Punctuation and operators
        addToken(token, "punctuation")
      } else {
        // Default
        addToken(token, "default")
      }
    }
  } else {
    // Default for unknown languages
    addToken(line, "default")
  }

  return tokens
}

export function VSCodeEditor({ code, language }: VSCodeEditorProps) {
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)
  const lines = code.split("\n")

  return (
    <div className="w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((line, index) => {
              return (
                <tr
                  key={index}
                  className={cn(
                    "transition-colors",
                    highlightedLine === index ? "bg-[#2a2d2e]" : "hover:bg-[#2a2d2e]",
                  )}
                  onMouseEnter={() => setHighlightedLine(index)}
                  onMouseLeave={() => setHighlightedLine(null)}
                >
                  {/* Line number */}
                  <td className="py-0 px-2 text-right text-[#858585] text-xs select-none border-r border-[#3c3c3c] bg-[#1e1e1e] w-[3rem] min-w-[3rem]">
                    {index + 1}
                  </td>
                  {/* Code content */}
                  <td className="py-0 px-4 whitespace-pre">
                    {highlightLine(line, language)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

