"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, AlertCircle, CheckCircle, X, Copy, Maximize2, Code, Share, TerminalSquare, SplitSquareVertical, Save, Download, Activity, Lock, Brain, MessageSquare, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { CodeEditor } from "./code-editor-monaco"
import { PerformanceMetrics } from "./performance-metrics"
import { ComplexityResult } from "@/app/utils/big-o-analyzer"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LoginPrompt } from "@/components/login-prompt"

// Custom debounce function to avoid external dependencies
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Define supported languages and their sample code
const LANGUAGES = {
  cpp: {
    name: "C++",
    defaultCode: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    
    // Your code here
    
    return 0;
}`,
  },
  python: {
    name: "Python",
    defaultCode: `# Your Python code here
def solve():
    # Add your solution here
    pass

if __name__ == "__main__":
    solve()`,
  },
  java: {
    name: "Java",
    defaultCode: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Your code here
        
        sc.close();
    }
}`,
  },
  c: {
    name: "C",
    defaultCode: `#include <stdio.h>

int main() {
    // Your code here
    
    return 0;
}`,
  },
  rust: {
    name: "Rust",
    defaultCode: `fn main() {
    // Your code here
}`,
  },
  go: {
    name: "Go",
    defaultCode: `package main

import "fmt"

func main() {
    // Your code here
}`,
  },
  ruby: {
    name: "Ruby",
    defaultCode: `# Your Ruby code here
def solve
    # Add your solution here
end

solve`,
  },
  kotlin: {
    name: "Kotlin",
    defaultCode: `fun main() {
    // Your code here
}`,
  },
  swift: {
    name: "Swift",
    defaultCode: `// Your Swift code here
func solve() {
    // Add your solution here
}

solve()`,
  },
  php: {
    name: "PHP",
    defaultCode: `<?php
// Your PHP code here
function solve() {
    // Add your solution here
}

solve();`,
  },
  typescript: {
    name: "TypeScript",
    defaultCode: `function solve(): void {
    // Your code here
}

solve();`,
  },
  scala: {
    name: "Scala",
    defaultCode: `object Main extends App {
    // Your code here
}`,
  },
  csharp: {
    name: "C#",
    defaultCode: `using System;

class Program {
    static void Main(string[] args) {
        // Your code here
    }
}`,
  },
}

const defaultInput = ""

// Output types
type OutputType = "success" | "error" | "info"

interface OutputMessage {
  type: OutputType
  content: string
  timestamp: Date
}

interface SavedCode {
  language: string
  code: string
  input: string
  expectedOutput: string
}

interface OnlineCompilerProps {
  disableAutoFocus?: boolean
}

// Define file tab interface
interface FileTab {
  id: string;
  name: string;
  language: keyof typeof LANGUAGES;
  content: string;
}

export function OnlineCompiler({ disableAutoFocus = false }: OnlineCompilerProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  // File tabs state
  const [tabs, setTabs] = useState<FileTab[]>([
    {
      id: '1',
      name: 'main.cpp',
      language: 'cpp',
      content: LANGUAGES.cpp.defaultCode
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  
  // Panel visibility states
  const [inputPanelCollapsed, setInputPanelCollapsed] = useState(false);
  const [outputPanelCollapsed, setOutputPanelCollapsed] = useState(false);
  const [expectedOutputCollapsed, setExpectedOutputCollapsed] = useState(false);
  
  // Original states
  const [language, setLanguage] = useState<keyof typeof LANGUAGES>("cpp")
  const [code, setCode] = useState(LANGUAGES[language].defaultCode)
  const [input, setInput] = useState(defaultInput)
  const [expectedOutput, setExpectedOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<OutputMessage[]>([])
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)
  const [memoryUsed, setMemoryUsed] = useState(0)
  const [complexityAnalysis, setComplexityAnalysis] = useState<ComplexityResult | null>(null)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle')
  const [aiAnalysis, setAiAnalysis] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const compilerRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const consoleContainerRef = useRef<HTMLDivElement>(null)
  const editorSectionRef = useRef<HTMLDivElement>(null)

  // Auto-save code changes with debounce
  const debouncedSaveCode = useCallback(
    debounce((codeToSave: string, codeLanguage: keyof typeof LANGUAGES) => {
      if (typeof window !== 'undefined') {
        setSaveStatus('saving')
        localStorage.setItem(`compiler_code_${codeLanguage}`, codeToSave)
        setTimeout(() => setSaveStatus('saved'), 500)
      }
    }, 1000),
    []
  )
  
  // Auto-save input changes with debounce
  const debouncedSaveInput = useCallback(
    debounce((inputToSave: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('compiler_input', inputToSave)
      }
    }, 1000),
    []
  )
  
  // Auto-save expected output changes with debounce
  const debouncedSaveExpectedOutput = useCallback(
    debounce((outputToSave: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('compiler_expected_output', outputToSave)
      }
    }, 1000),
    []
  )
  
  // Watch for code changes and auto-save
  useEffect(() => {
    setSaveStatus('saving')
    debouncedSaveCode(code, language)
  }, [code, language, debouncedSaveCode])
  
  // Watch for input changes and auto-save
  useEffect(() => {
    debouncedSaveInput(input)
  }, [input, debouncedSaveInput])
  
  // Watch for expected output changes and auto-save
  useEffect(() => {
    debouncedSaveExpectedOutput(expectedOutput)
  }, [expectedOutput, debouncedSaveExpectedOutput])
  
  // Save language preference when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('compiler_language', language)
    }
  }, [language])

  // Update code when language changes
  useEffect(() => {
    // First clear local variables
    setCode("")
    setInput("")
    setExpectedOutput("")
    
    // Then check local storage or use default
    const savedCode = localStorage.getItem(`compiler_code_${language}`)
    if (savedCode) {
      setCode(savedCode)
    } else {
      setCode(LANGUAGES[language].defaultCode)
    }
    
    const savedInput = localStorage.getItem('compiler_input')
    if (savedInput) {
      setInput(savedInput)
    }
    
    const savedExpectedOutput = localStorage.getItem('compiler_expected_output')
    if (savedExpectedOutput) {
      setExpectedOutput(savedExpectedOutput)
    }
  }, [language])

  // Scroll to bottom of output when new messages are added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  // Function to run code
  const runCode = async () => {
    setIsRunning(true)
    setOutput([])
    setOutput([{ type: "info", content: "Running code...", timestamp: new Date() }])
    
    // Reset performance metrics
    setExecutionTime(0)
    setMemoryUsed(0)
    setComplexityAnalysis(null)

    try {
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, input, analyzeComplexity: true }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Execution failed")
      }

      // Set performance metrics - ensure they're treated as numbers
      const execTime = typeof data.executionTime === 'string' 
        ? parseFloat(data.executionTime) 
        : data.executionTime || 0;
      
      const memUsed = typeof data.memoryUsed === 'string'
        ? parseFloat(data.memoryUsed)
        : data.memoryUsed || 0;
      
      setExecutionTime(execTime)
      setMemoryUsed(memUsed)
      
      if (data.complexityAnalysis) {
        setComplexityAnalysis(data.complexityAnalysis)
      }

      if (data.output) {
        setOutput((prev) => [...prev, { type: "success", content: data.output, timestamp: new Date() }])
        
        // Compare actual output with expected output if provided
        if (expectedOutput.trim()) {
          const actualOutput = data.output.trim();
          const expected = expectedOutput.trim();
          
          if (actualOutput === expected) {
            setOutput((prev) => [...prev, { 
              type: "success", 
              content: "✓ Output matches expected result", 
              timestamp: new Date() 
            }])
          } else {
            // Add a detailed comparison message
            setOutput((prev) => [...prev, { 
              type: "error", 
              content: "✗ Output does not match expected result", 
              timestamp: new Date() 
            }])
            
            // Add detailed visual comparison
            const comparisonMessage = `
Comparison:
--------------------------
Expected: 
${expected}
--------------------------
Actual: 
${actualOutput}
--------------------------`;
            
            setOutput((prev) => [...prev, { 
              type: "info", 
              content: comparisonMessage, 
              timestamp: new Date() 
            }])
          }
        }
      }
      
      if (data.error) {
        setOutput((prev) => [...prev, { type: "error", content: data.error, timestamp: new Date() }])
      }
      
      if (!data.output && !data.error) {
        setOutput((prev) => [...prev, { type: "success", content: "Program executed successfully with no output", timestamp: new Date() }])
        
        // Check if expected output was provided but program produced no output
        if (expectedOutput.trim()) {
          setOutput((prev) => [...prev, { 
            type: "error", 
            content: "✗ Expected output was provided, but program produced no output", 
            timestamp: new Date() 
          }])
        }
      }
    } catch (error) {
      setOutput((prev) => [
        ...prev,
        { type: "error", content: error instanceof Error ? error.message : "An unknown error occurred", timestamp: new Date() },
      ])
    } finally {
      setIsRunning(false)
    }
  }

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setOutput((prev) => [...prev, { type: "info", content: "Code copied to clipboard", timestamp: new Date() }])
  }
  
  // Manual save function
  const saveCode = () => {
    if (typeof window !== 'undefined') {
      setSaveStatus('saving')
      // Save code for current language
      localStorage.setItem(`compiler_code_${language}`, code)
      localStorage.setItem('compiler_language', language)
      localStorage.setItem('compiler_input', input)
      localStorage.setItem('compiler_expected_output', expectedOutput)
      
      // Show success message
      setOutput([
        ...output,
        {
          type: "success",
          content: "Code, input, and settings saved to browser storage",
          timestamp: new Date()
        }
      ])
      
      setTimeout(() => setSaveStatus('saved'), 500)
    }
  }
  
  // Reset compiler state and clear local storage
  const resetCompiler = () => {
    // Clear local storage for current language
    localStorage.removeItem(`compiler_code_${language}`)
    
    // Reset state
    setCode(LANGUAGES[language].defaultCode)
    setInput("")
    setExpectedOutput("")
    setOutput([{ type: "info", content: "Compiler reset. All saved data cleared.", timestamp: new Date() }])
  }
  
  // Clear all compiler data from local storage
  const clearAllCompilerData = () => {
    // Clear all compiler-related local storage
    Object.keys(LANGUAGES).forEach(lang => {
      localStorage.removeItem(`compiler_code_${lang}`);
    });
    
    // Reset state for current language
    setCode(LANGUAGES[language].defaultCode)
    setInput("")
    setExpectedOutput("")
    setOutput([{ type: "info", content: "All compiler data cleared for all languages.", timestamp: new Date() }])
  }
  
  // Download code as a file
  const getFileExtension = (language: string): string => {
    const extensionMap: Record<string, string> = {
      'cpp': 'cpp',
      'python': 'py',
      'java': 'java',
      'javascript': 'js',
      'c': 'c',
      'rust': 'rs',
      'go': 'go',
      'ruby': 'rb',
      'kotlin': 'kt',
      'swift': 'swift',
      'php': 'php',
      'typescript': 'ts',
      'scala': 'scala',
      'csharp': 'cs'
    };
    return extensionMap[language] || 'txt';
  };

  const downloadCode = () => {
    try {
      const fileExt = getFileExtension(language);
      const filename = `main.${fileExt}`;
      
      // Create a blob with the code content
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      setOutput([
        ...output,
        {
          type: "success",
          content: `Code downloaded as ${filename}`,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      setOutput([
        ...output,
        {
          type: "error",
          content: "Failed to download code",
          timestamp: new Date()
        }
      ]);
    }
  };

  // Function to analyze code with AI (Update to check whole code including boilerplate)
  const analyzeCodeWithAI = async () => {
    setIsAnalyzing(true)
    setAiAnalysis("")
    
    try {
      const response = await fetch("/api/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          language, 
          code,
          languageName: LANGUAGES[language].name // Send the full language name
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      setAiAnalysis(data.analysis)
    } catch (error) {
      setAiAnalysis(`<h3 class="text-red-400">Analysis Error</h3><p>${error instanceof Error ? error.message : "An unknown error occurred"}</p>`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Function to add a new tab
  const addNewTab = () => {
    const newTabId = (tabs.length + 1).toString();
    
    // Default to cpp but can be changed
    const newTab: FileTab = {
      id: newTabId,
      name: `file${newTabId}.cpp`,
      language: 'cpp',
      content: LANGUAGES.cpp.defaultCode
    };
    
    setTabs([...tabs, newTab]);
    setActiveTabId(newTabId);
  };
  
  // Function to remove a tab
  const removeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (tabs.length <= 1) {
      return; // Don't remove the last tab
    }
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    // If we're removing the active tab, activate another one
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };
  
  // Function to handle tab changes
  const changeTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      setLanguage(tab.language);
      setCode(tab.content);
    }
  };
  
  // Update active tab content when code changes
  useEffect(() => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, content: code } 
          : tab
      )
    );
  }, [code, activeTabId]);
  
  // Update tab language when language changes
  useEffect(() => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, language } 
          : tab
      )
    );
  }, [language, activeTabId]);

  // Update the file upload handling
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // Map file extension to language
      const extensionToLanguage: Record<string, string> = {
        'cpp': 'cpp',
        'c': 'c',
        'py': 'python',
        'java': 'java',
        'js': 'javascript',
        'rs': 'rust',
        'go': 'go',
        'rb': 'ruby',
        'kt': 'kotlin',
        'swift': 'swift',
        'php': 'php',
        'ts': 'typescript',
        'scala': 'scala',
        'cs': 'csharp'
      };
      
      if (extension && extensionToLanguage[extension]) {
        setLanguage(extensionToLanguage[extension] as keyof typeof LANGUAGES);
        setCode(content);
        setOutput([
          ...output,
          {
            type: "success",
            content: `File ${file.name} loaded successfully`,
            timestamp: new Date()
          }
        ]);
      } else {
        setOutput([
          ...output,
          {
            type: "error",
            content: `Unsupported file type: ${extension}`,
            timestamp: new Date()
          }
        ]);
      }
    };
    reader.readAsText(file);
  };

  return (
    <section className="fixed inset-0 w-screen h-screen z-50 overflow-auto bg-[#1e1e1e]">
      <div className="h-full w-full flex flex-col">
        <div
              ref={compilerRef}
          className="bg-[#1e1e1e] flex flex-col h-full w-full"
        >
          {/* Toolbar - Make more compact - Always visible */}
          <div className="bg-[#252526] px-3 py-1.5 flex items-center justify-between border-b border-[#3c3c3c] flex-shrink-0 sticky top-0 z-20">
            {/* Left side with logo and language selector */}
            <div className="flex items-center space-x-3">
              {/* Exit button */}
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-1 mr-2 text-purple-400 hover:text-purple-300 transition-colors"
                title="Exit to AlgoAtlas Home"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">Exit</span>
              </button>
            
              <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
                AlgoAtlas Compiler
              </div>
              {user && (
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as keyof typeof LANGUAGES)}
                  className="bg-[#3c3c3c] text-white text-sm rounded-md border-0 py-1 pl-3 pr-8 focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(LANGUAGES).map(([key, { name }]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
              )}

              {/* File open button - Only shown when logged in */}
              {user && (
                <div className="relative md:block hidden">
                    <input
                      type="file"
                      id="file-upload"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setOutput([{ type: "info", content: `Loading file "${file.name}"...`, timestamp: new Date() }]);
                          
                          handleFileUpload(file);
                        }
                        e.target.value = '';
                      }}
                      accept=".cpp,.py,.java,.txt,.js,.html,.css,.c,.h,.cc"
                    />
                    <button
                    className="flex items-center space-x-1 px-2 py-1 bg-[#3c3c3c] text-white text-sm rounded-md hover:bg-[#4c4c4c] transition-colors"
                      title="Open file from your computer"
                    >
                    <Download className="h-3.5 w-3.5 rotate-180" />
                    <span className="hidden sm:inline">Open</span>
                    </button>
                  </div>
              )}
                </div>

            {/* Actions - Only shown when logged in */}
            {user && (
              <div className="flex space-x-1.5 items-center">
                {/* Auto-save status indicator */}
                <div className="text-[10px] mr-1 hidden md:flex items-center">
                  {saveStatus === 'saving' && (
                    <span className="text-[#8f8f8f] flex items-center">
                      <div className="h-2 w-2 border-2 border-[#8f8f8f]/30 border-t-[#8f8f8f] rounded-full animate-spin mr-1"></div>
                      Saving...
                    </span>
                  )}
                  {saveStatus === 'saved' && (
                    <span className="text-green-400 flex items-center">
                      <CheckCircle className="h-2 w-2 mr-1" />
                      Auto-saved
                    </span>
                  )}
                </div>
                
                  <button
                  onClick={analyzeCodeWithAI}
                  className="p-1 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-purple-400 transition-colors flex items-center"
                  title="Analyze Code with AI"
                >
                  <Brain className="h-4 w-4" />
                  </button>
                
                  <button
                    onClick={downloadCode}
                  className="p-1 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors flex items-center"
                    title="Download code as file"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={copyCode}
                  className="p-1 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors flex items-center"
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={resetCompiler}
                  className="p-1 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors flex items-center"
                    title="Reset current language"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={clearAllCompilerData}
                  className="p-1 rounded-md text-red-500/70 hover:bg-[#3c3c3c] hover:text-red-500 transition-colors flex items-center"
                    title="Clear ALL compiler data"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </button>
              </div>
            )}
          </div>

          {/* Content area */}
          {!loading && !user ? (
            <div className="flex-1 flex items-center justify-center">
              <LoginPrompt feature="Online Compiler" embedded={true} />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row flex-1 overflow-auto">
              {/* LEFT SIDE: Code editor with tabs */}
              <div className="flex flex-col h-auto md:h-auto" style={{ flex: "1 1 70%" }}>
                {/* Tabs bar */}
                <div className="flex items-center bg-[#252526] border-b border-[#3c3c3c] sticky top-[46px] md:top-0 z-10">
                  <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-[#3c3c3c] scrollbar-track-transparent">
                    <div className="flex">
                      {tabs.map(tab => (
                        <div 
                          key={tab.id}
                          onClick={() => changeTab(tab.id)}
                          className={cn(
                            "flex items-center px-3 py-1.5 border-r border-[#3c3c3c] cursor-pointer group",
                            activeTabId === tab.id 
                              ? "bg-[#1e1e1e] text-white" 
                              : "bg-[#2d2d2d] text-[#8f8f8f] hover:bg-[#252526]"
                          )}
                        >
                          <span className="text-xs mr-2">{tab.name}</span>
                          {tabs.length > 1 && (
                  <button
                              onClick={(e) => removeTab(tab.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-[#3c3c3c]"
                  >
                              <X className="h-3 w-3" />
                  </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={addNewTab}
                    className="p-1 mx-1 rounded-sm text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white"
                    title="New file"
                  >
                    <span className="text-lg">+</span>
                  </button>
                </div>
                
                {/* Code editor - Full height */}
                <div className="h-[40vh] md:flex-1 overflow-hidden">
                  <CodeEditor 
                    value={code} 
                    language={language} 
                    onChange={setCode} 
                    disableAutoFocus={disableAutoFocus} 
                  />
              </div>

                {/* Bottom analysis panels - Always visible on desktop, collapsible on mobile */}
                <div className="h-[200px] md:h-[200px] border-t border-[#3c3c3c] bg-[#1e1e1e] overflow-auto">
                  <div className="flex h-full flex-col md:flex-row">
                    {/* AI Analysis panel */}
                    <div className="flex-1 flex flex-col border-r border-[#3c3c3c]">
                      <div className="px-3 py-1.5 bg-[#252526] border-b border-[#3c3c3c] flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center">
                          <Brain className="h-3.5 w-3.5 mr-2 text-purple-400" />
                          <span className="text-xs text-[#f0f0f0] font-medium">AI Code Analysis</span>
                        </div>
                        <button
                          onClick={analyzeCodeWithAI}
                          className="p-1 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors"
                          title="Refresh analysis"
                        >
                          <svg 
                            className="h-3.5 w-3.5" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                            <path d="M16 21h5v-5" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex-1 overflow-auto p-4 max-h-[calc(200px-32px)]">
                        {isAnalyzing ? (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="h-8 w-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-[#8f8f8f]">Analyzing your code...</p>
                          </div>
                        ) : aiAnalysis ? (
                          <div className="prose prose-invert max-w-none">
                            <div className="flex-1 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: aiAnalysis }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <button
                              onClick={analyzeCodeWithAI}
                              className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-md hover:bg-purple-600/30 transition-colors text-sm"
                            >
                              Analyze Code
                            </button>
                          </div>
                        )}
                      </div>
                  </div>

                    {/* Performance Metrics panel */}
                    <div className="flex-1 flex flex-col hidden md:flex">
                      <div className="px-3 py-1.5 bg-[#252526] border-b border-[#3c3c3c] flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center">
                          <Activity className="h-3.5 w-3.5 mr-2 text-purple-400" />
                          <span className="text-xs text-[#f0f0f0] font-medium">Performance</span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto p-3 max-h-[calc(200px-32px)]">
                        <PerformanceMetrics
                          executionTime={executionTime}
                          memoryUsed={memoryUsed}
                          complexityAnalysis={complexityAnalysis}
                          showChart={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Vertical sidebar with stacked panels */}
              <div className="border-t md:border-t-0 md:border-l border-[#3c3c3c] flex flex-col 
                             md:h-auto overflow-auto" style={{ flex: "0 0 30%" }}>
                {/* Input panel - Collapsible */}
                <div className={cn(
                  "flex flex-col border-b border-[#3c3c3c] transition-all duration-300",
                  inputPanelCollapsed ? "h-[32px]" : "flex-1 h-[33%]"
                )}>
                  <div 
                    className="px-3 py-1.5 bg-[#252526] flex items-center justify-between cursor-pointer sticky top-0 z-10"
                    onClick={() => setInputPanelCollapsed(!inputPanelCollapsed)}
                  >
                    <div className="flex items-center">
                        <TerminalSquare className="h-3.5 w-3.5 mr-2 text-purple-400" />
                        <span className="text-xs text-[#f0f0f0] font-medium">Input</span>
                      </div>
                    <div className="flex items-center">
                      <button className="p-1 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white">
                        {inputPanelCollapsed ? (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        ) : (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {!inputPanelCollapsed && (
                    <div className="flex-1 overflow-hidden min-h-0">
                      <CodeEditor
                        value={input}
                        language="plaintext"
                        onChange={setInput}
                        disableAutoFocus={disableAutoFocus}
                      />
                    </div>
                  )}
                </div>

                {/* Console Output panel */}
                <div className={cn(
                  "flex flex-col border-b border-[#3c3c3c] transition-all duration-300",
                  outputPanelCollapsed ? "h-[32px]" : "flex-1 h-[33%]"
                )}>
                  <div 
                    className="px-3 py-1.5 bg-[#252526] border-b border-[#3c3c3c] flex items-center justify-between sticky top-0 z-10 cursor-pointer"
                    onClick={() => setOutputPanelCollapsed(!outputPanelCollapsed)}
                  >
                    <div className="flex items-center">
                      <TerminalSquare className="h-3.5 w-3.5 mr-2 text-purple-400" />
                      <span className="text-xs text-[#f0f0f0] font-medium">Console Output</span>
                    </div>
                    <div className="flex items-center space-x-1">
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOutput([]);
                        }}
                        className="p-0.5 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors"
                      title="Clear console"
                    >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white">
                        {outputPanelCollapsed ? (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        ) : (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                    </button>
                  </div>
                  </div>
                  {!outputPanelCollapsed && (
                  <div
                    ref={outputRef}
                      className="flex-1 bg-[#1e1e1e] p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3c3c3c] scrollbar-track-transparent font-mono text-xs"
                  >
                    <AnimatePresence>
                      {output.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="text-[#8f8f8f] italic flex items-center"
                        >
                          <Play className="h-3 w-3 mr-2 text-[#8f8f8f]" />
                          Write code and click Run to execute it
                        </motion.div>
                      ) : (
                        output.map((msg, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-3 pb-2 border-b border-[#3c3c3c] last:border-b-0"
                          >
                            <div className="flex items-start">
                              {msg.type === "success" && (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              )}
                              {msg.type === "error" && (
                                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              )}
                              {msg.type === "info" && (
                                <span className="flex-shrink-0 text-blue-400 mr-2">{">"}</span>
                              )}
                              <div
                                className={cn(
                                  "break-words whitespace-pre-wrap font-mono",
                                  msg.type === "success" && "text-green-400",
                                  msg.type === "error" && "text-red-400",
                                  msg.type === "info" && "text-blue-400",
                                )}
                              >
                                {msg.content}
                              </div>
                            </div>
                            <div className="text-[#8f8f8f] text-[10px] mt-1 ml-6">{msg.timestamp.toLocaleTimeString()}</div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                    </div>
                  )}
                </div>
                
                {/* Expected Output panel */}
                <div className={cn(
                  "flex flex-col transition-all duration-300",
                  expectedOutputCollapsed ? "h-[32px]" : "flex-1 h-[33%]"
                )}>
                  <div 
                    className="px-3 py-1.5 bg-[#252526] border-b border-[#3c3c3c] flex items-center justify-between sticky top-0 z-10 cursor-pointer"
                    onClick={() => setExpectedOutputCollapsed(!expectedOutputCollapsed)}
                  >
                    <div className="flex items-center">
                      <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-400" />
                      <span className="text-xs text-[#f0f0f0] font-medium">Expected Output</span>
                    </div>
                    <button className="p-1 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white">
                      {expectedOutputCollapsed ? (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {!expectedOutputCollapsed && (
                    <div className="flex-1 overflow-hidden min-h-0">
                      <CodeEditor
                        value={expectedOutput}
                        language="plaintext"
                        onChange={setExpectedOutput}
                        disableAutoFocus={disableAutoFocus}
                        />
                      </div>
                    )}
                  </div>

                {/* Run button - Fixed at bottom */}
                <div className="p-3 bg-[#252526] border-t border-[#3c3c3c] sticky bottom-0 z-10">
                    <motion.button
                      onClick={runCode}
                      disabled={isRunning}
                      className={cn(
                      "w-full flex items-center justify-center py-2 px-3 rounded-md text-white font-medium transition-all",
                        isRunning
                          ? "bg-purple-700/50 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-600/20",
                      )}
                      whileHover={isRunning ? {} : { scale: 1.02 }}
                      whileTap={isRunning ? {} : { scale: 0.98 }}
                    >
                      {isRunning ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Code
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
        )}
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-purple-500/20 p-6 rounded-lg hover:border-purple-500/30 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  )
}

function CodeHighlighter(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m8 3 4 2v14l-4 2z"></path>
      <path d="m16 7-4-2"></path>
      <path d="m16 7 4 2v10l-4 2"></path>
      <path d="m16 21v-4"></path>
      <path d="m12 19-4 2"></path>
      <path d="m16 17-4 2"></path>
    </svg>
  )
}

