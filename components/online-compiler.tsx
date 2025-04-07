"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, AlertCircle, CheckCircle, X, Copy, Maximize2, Code, Share, TerminalSquare, SplitSquareVertical, Save, Download, Activity, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { CodeEditor } from "./code-editor-monaco"
import { PerformanceMetrics } from "./performance-metrics"
import { ComplexityResult } from "@/app/utils/big-o-analyzer"
import { useAuth } from "@/contexts/AuthContext"
import { LoginPrompt } from "./login-prompt"

// Define supported languages and their sample code
const LANGUAGES = {
  cpp: {
    name: "C++",
    defaultCode: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`,
  },
  python: {
    name: "Python",
    defaultCode: "",
  },
  java: {
    name: "Java",
    defaultCode: "",
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

export function OnlineCompiler({ disableAutoFocus = false }: OnlineCompilerProps) {
  const { user } = useAuth()
  const [language, setLanguage] = useState<keyof typeof LANGUAGES>("cpp")
  const [code, setCode] = useState(LANGUAGES[language].defaultCode)
  const [input, setInput] = useState(defaultInput)
  const [expectedOutput, setExpectedOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<OutputMessage[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)
  const [memoryUsed, setMemoryUsed] = useState(0)
  const [complexityAnalysis, setComplexityAnalysis] = useState<ComplexityResult | null>(null)
  const compilerRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Update code when language changes
  useEffect(() => {
    // First clear local variables
    setCode("")
    setInput("")
    setExpectedOutput("")
    
    // Then check local storage or use default
    const savedCode = localStorage.getItem(`algoatlas_compiler_${language}`)
    if (savedCode) {
      try {
        const parsed = JSON.parse(savedCode) as SavedCode
        setCode(parsed.code)
        setInput(parsed.input)
        setExpectedOutput(parsed.expectedOutput || "")
      } catch (error) {
        // If there's an error parsing stored data, use default
        setCode(LANGUAGES[language].defaultCode)
      }
    } else {
      setCode(LANGUAGES[language].defaultCode)
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
    setShowPerformanceMetrics(false)

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
        setShowPerformanceMetrics(true)
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
  
  // Save code to local storage
  const saveCode = () => {
    try {
      const codeData: SavedCode = { language, code, input, expectedOutput }
      localStorage.setItem(`algoatlas_compiler_${language}`, JSON.stringify(codeData))
      setOutput((prev) => [...prev, { type: "info", content: "Code saved to browser storage", timestamp: new Date() }])
    } catch (error) {
      setOutput((prev) => [...prev, { type: "error", content: "Failed to save code", timestamp: new Date() }])
    }
  }
  
  // Reset compiler state and clear local storage
  const resetCompiler = () => {
    // Clear local storage for current language
    localStorage.removeItem(`algoatlas_compiler_${language}`)
    
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
      localStorage.removeItem(`algoatlas_compiler_${lang}`);
    });
    
    // Reset state for current language
    setCode(LANGUAGES[language].defaultCode)
    setInput("")
    setExpectedOutput("")
    setOutput([{ type: "info", content: "All compiler data cleared for all languages.", timestamp: new Date() }])
  }
  
  // Download code to file
  const downloadCode = () => {
    try {
      // Get appropriate file extension based on language
      let fileExtension = "";
      switch (language) {
        case "cpp":
          fileExtension = ".cpp";
          break;
        case "python":
          fileExtension = ".py";
          break;
        case "java":
          fileExtension = ".java";
          break;
        default:
          fileExtension = ".txt";
      }
      
      // Create file name
      const fileName = `algoatlas_code${fileExtension}`;
      
      // Create blob and download link
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setOutput((prev) => [...prev, { type: "info", content: `Downloaded as "${fileName}"`, timestamp: new Date() }]);
    } catch (error) {
      setOutput((prev) => [...prev, { type: "error", content: "Failed to download file", timestamp: new Date() }]);
    }
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      compilerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Toggle performance metrics
  const togglePerformanceMetrics = () => {
    setShowPerformanceMetrics(prev => !prev)
  }

  return (
    <section className={cn(
      "py-20 relative overflow-hidden",
      isFullscreen && "fixed inset-0 z-50 !p-0 bg-navy-950"
    )}>
      {/* Background elements */}
      {!isFullscreen && (
        <>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        </>
      )}

      <div className={cn(
        "container mx-auto px-4 sm:px-6",
        isFullscreen && "!p-0 !m-0 !max-w-none h-full"
      )}>
        {/* Check if user is logged in */}
        {!user ? (
          <LoginPrompt feature="compiler" />
        ) : (
          <>
            {/* Section heading */}
            {!isFullscreen && (
              <>
                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Online Compiler
                </motion.h2>
                <motion.p
                  className="text-lg text-center text-blue-100/80 max-w-3xl mx-auto mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Write, run, and debug your code directly in the browser
                </motion.p>
              </>
            )}

            {/* Features list - moved above compiler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              <FeatureCard
                title="Multiple Languages"
                description="Write and run code in C++, Python, Java, and more programming languages."
                icon={<Code className="h-6 w-6" />}
              />
              <FeatureCard
                title="Real-time Syntax Highlighting"
                description="Enjoy code highlighting and auto-indentation for a better coding experience."
                icon={<CodeHighlighter className="h-6 w-6" />}
              />
              <FeatureCard
                title="Save & Share"
                description="Save your code snippets and share them with others with a simple link."
                icon={<Share className="h-6 w-6" />}
              />
            </div>

            {/* Compiler container */}
            <motion.div
              ref={compilerRef}
              className={cn(
                "bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg shadow-2xl overflow-hidden flex flex-col",
                isFullscreen ? "h-full rounded-none border-0" : "h-[800px]"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Toolbar */}
              <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-[#3c3c3c] flex-shrink-0">
                {/* Language selector */}
                <div className="flex items-center space-x-4">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as keyof typeof LANGUAGES)}
                    className="bg-[#3c3c3c] text-white text-sm rounded-md border-0 py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(LANGUAGES).map(([key, { name }]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>

                  {/* File open button */}
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Show loading message
                          setOutput([{ type: "info", content: `Loading file "${file.name}"...`, timestamp: new Date() }]);
                          
                          const reader = new FileReader();
                          
                          reader.onload = (event) => {
                            try {
                              if (event.target?.result) {
                                // Successfully read file content
                                const fileContent = event.target.result.toString();
                                
                                // Detect language based on file extension
                                const fileName = file.name.toLowerCase();
                                let newLang = language;
                                
                                if (fileName.endsWith('.cpp') || fileName.endsWith('.h') || fileName.endsWith('.c') || fileName.endsWith('.cc')) {
                                  newLang = 'cpp';
                                } else if (fileName.endsWith('.py') || fileName.endsWith('.python')) {
                                  newLang = 'python';
                                } else if (fileName.endsWith('.java')) {
                                  newLang = 'java';
                                }
                                
                                // Set language first if it's changed
                                if (newLang !== language) {
                                  setLanguage(newLang as keyof typeof LANGUAGES);
                                }
                                
                                // Set code content directly
                                setCode(fileContent);
                                
                                setOutput([{ 
                                  type: "success", 
                                  content: `File "${file.name}" loaded successfully`, 
                                  timestamp: new Date() 
                                }]);
                              }
                            } catch (error) {
                              setOutput([{ 
                                type: "error", 
                                content: `Error processing file: ${error instanceof Error ? error.message : "Unknown error"}`, 
                                timestamp: new Date() 
                              }]);
                            }
                          };
                          
                          reader.onerror = () => {
                            setOutput([{ 
                              type: "error", 
                              content: "Failed to read file. Please try again.", 
                              timestamp: new Date() 
                            }]);
                          };
                          
                          // Read the file as text
                          reader.readAsText(file);
                        }
                        // Reset file input so the same file can be selected again
                        e.target.value = '';
                      }}
                      accept=".cpp,.py,.java,.txt,.js,.html,.css,.c,.h,.cc"
                    />
                    <button
                      className="flex items-center space-x-1 px-3 py-1.5 bg-[#3c3c3c] text-white text-sm rounded-md hover:bg-[#4c4c4c] transition-colors"
                      title="Open file from your computer"
                    >
                      <Download className="h-4 w-4 rotate-180" />
                      <span>Open File</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={saveCode}
                    className="p-1.5 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors flex items-center"
                    title="Save code to browser storage"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={downloadCode}
                    className="p-1.5 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors flex items-center"
                    title="Download code as file"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={copyCode}
                    className="p-1.5 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors flex items-center"
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={resetCompiler}
                    className="p-1.5 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors flex items-center"
                    title="Reset current language"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={clearAllCompilerData}
                    className="p-1.5 rounded-md text-red-500/70 hover:bg-[#3c3c3c] hover:text-red-500 transition-colors flex items-center"
                    title="Clear ALL compiler data"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors flex items-center"
                    title="Toggle fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={togglePerformanceMetrics}
                    className={cn(
                      "p-1.5 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors flex items-center",
                      showPerformanceMetrics && "bg-purple-500"
                    )}
                    title="Performance metrics"
                  >
                    <Activity className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className={cn(
                "flex flex-col md:flex-row flex-1 min-h-0",
                isFullscreen ? "h-[calc(100vh-48px)]" : "h-full"
              )}>
                {/* Main content */}
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Code editor */}
                  <div className="flex-1 overflow-hidden border-b border-[#3c3c3c] min-h-0">
                    <CodeEditor value={code} language={language} onChange={setCode} disableAutoFocus={disableAutoFocus} />
                  </div>

                  {/* Input and Expected Output panels */}
                  <div className="h-[200px] border-t border-[#3c3c3c] flex-shrink-0 flex">
                    {/* Input panel */}
                    <div className="h-full w-1/2 border-r border-[#3c3c3c]">
                      <div className="px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] flex items-center">
                        <TerminalSquare className="h-3.5 w-3.5 mr-2 text-purple-400" />
                        <span className="text-xs text-[#f0f0f0] font-medium">Input</span>
                      </div>
                      <CodeEditor
                        value={input}
                        language="plaintext"
                        onChange={setInput}
                        disableAutoFocus={disableAutoFocus}
                      />
                    </div>
                    
                    {/* Expected Output panel */}
                    <div className="h-full w-1/2">
                      <div className="px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] flex items-center">
                        <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-400" />
                        <span className="text-xs text-[#f0f0f0] font-medium">Expected Output</span>
                      </div>
                      <CodeEditor
                        value={expectedOutput}
                        language="plaintext"
                        onChange={setExpectedOutput}
                        disableAutoFocus={disableAutoFocus}
                      />
                    </div>
                  </div>
                </div>

                {/* Output console */}
                <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-[#3c3c3c] flex flex-col min-h-0">
                  {/* Console header */}
                  <div className="flex items-center justify-between bg-[#252526] px-4 py-2 border-b border-[#3c3c3c]">
                    <div className="flex items-center">
                      <TerminalSquare className="h-3.5 w-3.5 mr-2 text-purple-400" />
                      <span className="text-xs text-[#f0f0f0] font-medium">Console Output</span>
                    </div>
                    <button
                      onClick={() => setOutput([])}
                      className="p-1 rounded-md text-[#8f8f8f] hover:bg-[#3c3c3c] hover:text-white transition-colors"
                      title="Clear console"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Console output */}
                  <div
                    ref={outputRef}
                    className="flex-1 bg-[#1e1e1e] p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3c3c3c] scrollbar-track-transparent font-mono text-xs"
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
                    
                    {/* Add Performance Metrics Component directly in console output */}
                    {showPerformanceMetrics && (
                      <div className="mt-4 border-t border-[#3c3c3c] pt-4">
                        <PerformanceMetrics
                          executionTime={executionTime}
                          memoryUsed={memoryUsed}
                          complexityAnalysis={complexityAnalysis}
                          showChart={true}
                        />
                      </div>
                    )}
                  </div>

                  {/* Run button */}
                  <div className="p-4 bg-[#252526] border-t border-[#3c3c3c]">
                    <motion.button
                      onClick={runCode}
                      disabled={isRunning}
                      className={cn(
                        "w-full flex items-center justify-center py-3 px-4 rounded-md text-white font-medium transition-all",
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
            </motion.div>
          </>
        )}
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

