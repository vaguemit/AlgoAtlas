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

// Define file tab interface
interface FileTab {
  id: string;
  name: string;
  language: keyof typeof LANGUAGES;
  content: string;
}

// Update the output state type
interface OutputState {
  stdout: string;
  stderr: string;
  time: string;
  memory: string;
}

// Add error code mapping
const ONLINE_COMPILER_ERRORS = {
  400: 'Bad Request - Your request is invalid',
  401: 'Unauthorized - Your API key is wrong',
  403: 'Forbidden - The compiler is hidden for administrators only',
  404: 'Not Found - The specified compiler could not be found',
  405: 'Method Not Allowed - Invalid request method',
  406: 'Not Acceptable - Requested format is not supported',
  429: 'Too Many Requests - Please try again later',
  500: 'Internal Server Error - Try again later',
  503: 'Service Unavailable - We are temporarily offline'
};

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
  const [output, setOutput] = useState<OutputState>({
    stdout: '',
    stderr: '',
    time: '0.00',
    memory: '0'
  })
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

  // Add rate limiting state
  const [lastExecutionTime, setLastExecutionTime] = useState<number>(0);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);

  // Add new state for tracking API source
  const [apiSource, setApiSource] = useState<'judge0' | 'onlinecompiler'>('judge0');

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

  // Add rate limit helper function
  const checkRateLimit = () => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutionTime;
    const minTimeBetweenExecutions = 2000; // 2 seconds minimum between executions
    
    if (timeSinceLastExecution < minTimeBetweenExecutions) {
      const remainingTime = Math.ceil((minTimeBetweenExecutions - timeSinceLastExecution) / 1000);
      setIsRateLimited(true);
      setOutput(prev => ({
        ...prev,
        stdout: `Please wait ${remainingTime} seconds before running again.\nRate limiting is in place to prevent server overload.`,
        stderr: '',
        time: '0.00',
        memory: '0'
      }));
      return true;
    }
    
    setIsRateLimited(false);
    setLastExecutionTime(now);
    return false;
  };

  // Update handleRunCode function
  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput(prev => ({
        ...prev,
        stdout: 'Please enter some code to run.',
        stderr: '',
        time: '0.00',
        memory: '0'
      }));
      return;
    }

    if (checkRateLimit()) {
      return;
    }

    setIsRunning(true);
    setOutput(prev => ({
      ...prev,
      stdout: 'Running code...',
      stderr: '',
      time: '0.00',
      memory: '0'
    }));

    try {
      // Try Judge0 first
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: language,
          input: input
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          // Switch to onlinecompiler.io API
          setApiSource('onlinecompiler');
          setOutput(prev => ({
            ...prev,
            stdout: 'Switching to alternative compiler service...',
            stderr: '',
            time: '0.00',
            memory: '0'
          }));

          // Map our language to onlinecompiler.io's compiler names
          const compilerMap: Record<string, string> = {
            'cpp': 'g++-4.9',
            'python': 'python-3.9.7',
            'java': 'openjdk-11'
          };

          // Call onlinecompiler.io API
          const onlineCompilerResponse = await fetch('https://onlinecompiler.io/api/v2/run-code/', {
            method: 'POST',
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ONLINECOMPILER_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              code,
              input,
              compiler: compilerMap[language],
              callback_url: `${window.location.origin}/api/webhook`
            })
          });

          if (!onlineCompilerResponse.ok) {
            const errorCode = onlineCompilerResponse.status;
            const errorMessage = ONLINE_COMPILER_ERRORS[errorCode as keyof typeof ONLINE_COMPILER_ERRORS] || 'Unknown error occurred';
            throw new Error(`OnlineCompiler.io Error (${errorCode}): ${errorMessage}`);
          }

          const onlineCompilerData = await onlineCompilerResponse.json();
          
          setOutput(prev => ({
            ...prev,
            stdout: 'Code execution request sent. Waiting for results...',
            stderr: '',
            time: '0.00',
            memory: '0'
          }));

          // Start polling for results
          const pollInterval = setInterval(async () => {
            try {
              const resultResponse = await fetch('/api/webhook/result');
              if (resultResponse.ok) {
                const result = await resultResponse.json();
                if (result.status === 'completed') {
                  clearInterval(pollInterval);
                  setOutput({
                    stdout: result.stdout || '',
                    stderr: result.stderr || '',
                    time: result.time || '0.00',
                    memory: result.memory || '0'
                  });
                }
              }
            } catch (error) {
              console.error('Error polling for results:', error);
            }
          }, 2000);

          // Clear polling after 30 seconds
          setTimeout(() => {
            clearInterval(pollInterval);
            if (output.stdout === 'Code execution request sent. Waiting for results...') {
              setOutput(prev => ({
                ...prev,
                stdout: '',
                stderr: 'Timeout waiting for results. Please try again.',
                time: '0.00',
                memory: '0'
              }));
            }
          }, 30000);

          return;
        }
        throw new Error(errorData.error || 'Failed to execute code');
      }

      const data = await response.json();
      setOutput({
        stdout: data.stdout || '',
        stderr: data.stderr || '',
        time: data.time || '0.00',
        memory: data.memory || '0'
      });
      setApiSource('judge0');
    } catch (error: any) {
      setOutput(prev => ({
        ...prev,
        stdout: '',
        stderr: `Error: ${error.message || 'Failed to execute code'}`,
        time: '0.00',
        memory: '0'
      }));
    } finally {
      setIsRunning(false);
    }
  };

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setOutput((prev) => ({
      ...prev,
      stdout: prev.stdout + "\nCode copied to clipboard",
      stderr: prev.stderr,
      time: prev.time,
      memory: prev.memory
    }))
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
      setOutput((prev) => ({
        ...prev,
        stdout: prev.stdout + "\nCode, input, and settings saved to browser storage",
        stderr: prev.stderr,
        time: prev.time,
        memory: prev.memory
      }))
      
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
    setOutput({
      stdout: '',
      stderr: '',
      time: '0.00',
      memory: '0'
    })
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
    setOutput({
      stdout: '',
      stderr: '',
      time: '0.00',
      memory: '0'
    })
  }
  
  // Download code as a file
  const downloadCode = () => {
    try {
      const fileExt = language === 'cpp' ? '.cpp' : language === 'python' ? '.py' : '.java'
      const filename = `algoatlas_code${fileExt}`
      
      // Create a blob with the code content
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob)
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      
      // Append to body, click, and clean up
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
      
      setOutput((prev) => ({
        ...prev,
        stdout: prev.stdout + `\nCode downloaded as ${filename}`,
        stderr: prev.stderr,
        time: prev.time,
        memory: prev.memory
      }))
    } catch (error) {
      setOutput((prev) => ({
        ...prev,
        stdout: prev.stdout + "\nFailed to download code",
        stderr: prev.stderr,
        time: prev.time,
        memory: prev.memory
      }))
    }
  }

  // Function to analyze code with AI (Update to check whole code including boilerplate)
  const analyzeCodeWithAI = async () => {
    setIsAnalyzing(true)
    setAiAnalysis("")
    
    try {
      const response = await fetch("/api/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
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
                          setOutput((prev) => ({
                            ...prev,
                            stdout: `Loading file "${file.name}"...`,
                            stderr: '',
                            time: '0.00',
                            memory: '0'
                          }));
                          
                          const reader = new FileReader();
                          
                          reader.onload = (event) => {
                            try {
                              if (event.target?.result) {
                                const fileContent = event.target.result.toString();
                                const fileName = file.name.toLowerCase();
                                let newLang = language;
                                
                                if (fileName.endsWith('.cpp') || fileName.endsWith('.h') || fileName.endsWith('.c') || fileName.endsWith('.cc')) {
                                  newLang = 'cpp';
                                } else if (fileName.endsWith('.py') || fileName.endsWith('.python')) {
                                  newLang = 'python';
                                } else if (fileName.endsWith('.java')) {
                                  newLang = 'java';
                                }
                                
                                if (newLang !== language) {
                                  setLanguage(newLang as keyof typeof LANGUAGES);
                                }
                                
                                setCode(fileContent);
                                
                                setOutput((prev) => ({
                                  ...prev,
                                  stdout: `File "${file.name}" loaded successfully`,
                                  stderr: '',
                                  time: '0.00',
                                  memory: '0'
                                }));
                              }
                            } catch (error) {
                              setOutput((prev) => ({
                                ...prev,
                                stdout: `Error processing file: ${error instanceof Error ? error.message : "Unknown error"}`,
                                stderr: '',
                                time: '0.00',
                                memory: '0'
                              }));
                            }
                          };
                          
                          reader.onerror = () => {
                            setOutput((prev) => ({
                              ...prev,
                              stdout: "Failed to read file. Please try again.",
                              stderr: '',
                              time: '0.00',
                              memory: '0'
                            }));
                          };
                          
                          reader.readAsText(file);
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
                          setOutput({
                            stdout: '',
                            stderr: '',
                            time: '0.00',
                            memory: '0'
                          });
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
                      {output.stdout === '' && output.stderr === '' ? (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="text-[#8f8f8f] italic flex items-center"
                        >
                          <Play className="h-3 w-3 mr-2 text-[#8f8f8f]" />
                          Write code and click Run to execute it
                        </motion.div>
                      ) : (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-3 pb-2 border-b border-[#3c3c3c] last:border-b-0"
                          >
                            <div className="flex items-start">
                              {output.stderr !== '' && (
                                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              )}
                              <div
                                className={cn(
                                  "break-words whitespace-pre-wrap font-mono",
                                  output.stderr !== '' && "text-red-400",
                                )}
                              >
                                {output.stderr}
                              </div>
                            </div>
                            <div className="text-[#8f8f8f] text-[10px] mt-1 ml-6">{new Date(output.time).toLocaleTimeString()}</div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-3 pb-2 border-b border-[#3c3c3c] last:border-b-0"
                          >
                            <div className="flex items-start">
                              {output.stdout !== '' && (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              )}
                              <div
                                className={cn(
                                  "break-words whitespace-pre-wrap font-mono",
                                  output.stdout !== '' && "text-green-400",
                                )}
                              >
                                {output.stdout}
                              </div>
                            </div>
                            <div className="text-[#8f8f8f] text-[10px] mt-1 ml-6">{new Date(output.time).toLocaleTimeString()}</div>
                          </motion.div>
                        </>
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
                      onClick={handleRunCode}
                      disabled={isRunning || isRateLimited}
                      className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                        isRunning || isRateLimited
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      whileHover={isRunning ? {} : { scale: 1.02 }}
                      whileTap={isRunning ? {} : { scale: 0.98 }}
                    >
                      {isRunning ? 'Running...' : isRateLimited ? 'Wait...' : 'Run Code'}
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

