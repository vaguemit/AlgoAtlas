"use client"

import { useRef, useEffect, useState } from "react"
import { Editor, type OnMount } from "@monaco-editor/react"
import { Skeleton } from "@/components/ui/skeleton"
import { FileCode, ChevronRight, Coffee, GitBranch, Check, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  language: string
  onChange: (value: string) => void
  readOnly?: boolean
  disableAutoFocus?: boolean
  filename?: string
}

export function CodeEditor({ 
  value, 
  language, 
  onChange, 
  readOnly = false, 
  disableAutoFocus = false,
  filename
}: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [activeLine, setActiveLine] = useState(1)
  const [activeColumn, setActiveColumn] = useState(1)
  const [currentTab, setCurrentTab] = useState(getFilename())

  function getFilename() {
    if (filename) return filename;
    
    // Generate filename based on language
    const extensions: Record<string, string> = {
      cpp: 'main.cpp',
      python: 'main.py',
      java: 'Main.java',
      plaintext: 'untitled.txt'
    };
    
    return extensions[language] || 'code.txt';
  }

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Update cursor position tracking
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
    setIsLoaded(true)

    // Focus editor only if auto-focus is not disabled
    if (!disableAutoFocus) {
      editor.focus()
    }

    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setActiveLine(e.position.lineNumber);
      setActiveColumn(e.position.column);
    });
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
      case "javascript":
        return "javascript"
      case "typescript":
        return "typescript"
      case "plaintext":
        return "plaintext"
      default:
        return "plaintext"
    }
  }

  // Get language icon
  const getLanguageIcon = (lang: string) => {
    switch (lang) {
      case "cpp":
        return "🇨"
      case "python":
        return "🐍"
      case "java":
        return "☕"
      case "javascript":
        return "JS"
      case "typescript":
        return "TS"
      default:
        return "📄"
    }
  }

  // Don't render editor during SSR
  if (!isMounted) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="h-9 bg-[#252526] border-b border-[#1e1e1e]">
          <Skeleton className="w-full h-full bg-[#2d2d2d]" />
        </div>
        <div className="flex-1 bg-[#1e1e1e] p-4">
          <Skeleton className="w-full h-full bg-[#2d2d2d]" />
        </div>
        <div className="h-6 bg-[#007acc]">
          <Skeleton className="w-full h-full bg-[#2d2d2d]" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col border border-[#1e1e1e] shadow-lg overflow-hidden">
      {/* Tab bar */}
      <div className="h-9 bg-[#252526] flex items-center border-b border-[#1e1e1e]">
        <div className="flex h-full">
          <div className="flex items-center h-full bg-[#1e1e1e] px-3 gap-2 text-xs text-white border-r border-[#3c3c3c]">
            <span className="text-[11px] flex items-center gap-1.5">
              <span className="opacity-70">{getLanguageIcon(language)}</span>
              {currentTab}
            </span>
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="flex px-2 gap-2">
          <button className="text-[#8f8f8f] hover:text-white p-1 rounded-sm hover:bg-white/10">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Editor container */}
      <div className="flex-1 flex relative">
        {/* Explorer gutter */}
        <div className="w-12 bg-[#252526] border-r border-[#1e1e1e] shrink-0 hidden sm:block">
          <div className="flex flex-col items-center pt-3 gap-5">
            <button className="flex flex-col items-center group text-[#8f8f8f] hover:text-white">
              <FileCode size={22} />
              <div className="absolute left-0 w-[2px] h-6 bg-white transform -translate-y-1/2 top-[11.5%]"></div>
            </button>
            <button className="flex flex-col items-center group text-[#8f8f8f] hover:text-white">
              <GitBranch size={22} />
            </button>
            <button className="flex flex-col items-center group text-[#8f8f8f] hover:text-white">
              <Sparkles size={22} />
            </button>
          </div>
        </div>

        {/* Main editor */}
        <div className="flex-1 relative">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
              <div className="h-8 w-8 border-2 border-[#007acc]/30 border-t-[#007acc] rounded-full animate-spin"></div>
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
              fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, 'Courier New', monospace",
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
              lineNumbers: "on",
              glyphMargin: true,
              folding: true,
              renderWhitespace: "selection",
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              guides: {
                indentation: true,
                bracketPairs: true
              },
              bracketPairColorization: {
                enabled: true
              }
            }}
            onMount={handleEditorDidMount}
            loading={null}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-2 text-xs justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <GitBranch size={12} />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check size={12} className="text-green-400" />
            <span>0</span>
            <X size={12} className="text-red-400" />
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>{getLanguageId(language)}</div>
          <div>UTF-8</div>
          <div>LF</div>
          <div className="flex items-center gap-1">
            <span>Ln {activeLine}</span>
            <span>Col {activeColumn}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

