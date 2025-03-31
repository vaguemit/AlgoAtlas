"use client"

import { useRef, useEffect, useState } from "react"
import { Editor, type OnMount } from "@monaco-editor/react"
import { Skeleton } from "@/components/ui/skeleton"

interface CodeEditorProps {
  value: string
  language: string
  onChange: (value: string) => void
  readOnly?: boolean
  disableAutoFocus?: boolean
}

export function CodeEditor({ value, language, onChange, readOnly = false, disableAutoFocus = false }: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
    setIsLoaded(true)

    // Focus editor only if auto-focus is not disabled
    if (!disableAutoFocus) {
      editor.focus()
    }
  }

  // Map language IDs to Monaco language IDs
  const getLanguageId = (lang: string) => {
    switch (lang) {
      case "cpp":
        return "cpp"
      case "c":
        return "cpp"
      case "python":
        return "python"
      case "java":
        return "java"
      case "plaintext":
        return "plaintext"
      default:
        return "plaintext"
    }
  }

  // Don't render editor during SSR
  if (!isMounted) {
    return (
      <div className="w-full h-full bg-[#1e1e1e] p-4">
        <Skeleton className="w-full h-full bg-[#2d2d2d]" />
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e]">
          <div className="h-8 w-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}

      <Editor
        height="100%"
        defaultLanguage={getLanguageId(language)}
        language={getLanguageId(language)}
        value={value}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, 'Courier New', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          readOnly,
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          padding: { top: 16 },
        }}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
            <div className="h-8 w-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        }
      />
    </div>
  )
}

