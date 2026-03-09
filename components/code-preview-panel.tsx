"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { VSCodeEditor } from "./vscode-editor";
import { useMediaQuery } from "@/hooks/use-media-query";

// Custom scrollbar styles
const scrollbarStyles = `
  .vscode-scrollbar::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  .vscode-scrollbar::-webkit-scrollbar-track {
    background: #1e1e1e;
  }
  .vscode-scrollbar::-webkit-scrollbar-thumb {
    background: #3c3c3c;
    border-radius: 5px;
  }
  .vscode-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #4c4c4c;
  }
  .vscode-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #3c3c3c #1e1e1e;
  }
`;

// Sample code snippets
const codeSnippets = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

void fastIO() {
  ios_base.sync_with_stdio(false);
  cin.tie(NULL);
}

int binarySearch(vector<int>& arr, int target) {
  int left = 0, right = arr.size() - 1;
  
  while (left <= right) {
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target)
      return mid;
    
    if (arr[mid] < target)
      left = mid + 1;
    else
      right = mid - 1;
  }
  
  return -1;
}

int main() {
  fastIO();
  
  int n, q;
  cin >> n >> q;
  
  vector<int> arr(n);
  for (int i = 0; i < n; i++) {
    cin >> arr[i];
  }
  
  sort(arr.begin(), arr.end());
  
  while (q--) {
    int target;
    cin >> target;
    
    int result = binarySearch(arr, target);
    
    if (result != -1)
      cout << "YES\\n";
    else
      cout << "NO\\n";
  }
  
  return 0;
}`,
  python: `# AtCoder - Dynamic Programming Solution
def solve():
    n = int(input())
    heights = list(map(int, input().split()))
    
    dp = [float('inf')] * n
    dp[0] = 0
    
    for i in range(1, n):
        # Option 1: Jump from i-1
        dp[i] = min(dp[i], dp[i-1] + abs(heights[i] - heights[i-1]))
        
        if i > 1:
            dp[i] = min(dp[i], dp[i-2] + abs(heights[i] - heights[i-2]))
    
    print(dp[n-1])

t = int(input())
for _ in range(t):
    solve()`,
  java: `import java.util.*;

public class GraphAlgorithm {
    static class Edge {
        int src, dest, weight;
        
        Edge(int src, int dest, int weight) {
            this.src = src;
            this.dest = dest;
            this.weight = weight;
        }
    }
    
    static class Graph {
        int V, E;
        ArrayList<ArrayList<Edge>> adj;
        
        Graph(int v) {
            V = v;
            adj = new ArrayList<>();
            for (int i = 0; i < V; i++) {
                adj.add(new ArrayList<>());
            }
        }
        
        void addEdge(int src, int dest, int weight) {
            adj.get(src).add(new Edge(src, dest, weight));
        }
        
        // Dijkstra's algorithm
        void shortestPath(int src) {
            int[] dist = new int[V];
            Arrays.fill(dist, Integer.MAX_VALUE);
            dist[src] = 0;
            
            PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
            pq.add(new int[]{src, 0});
            
            while (!pq.isEmpty()) {
                int[] curr = pq.poll();
                int u = curr[0];
                
                for (Edge e : adj.get(u)) {
                    if (dist[e.dest] > dist[u] + e.weight) {
                        dist[e.dest] = dist[u] + e.weight;
                        pq.add(new int[]{e.dest, dist[e.dest]});
                    }
                }
            }
            
            for (int i = 0; i < V; i++) {
                System.out.println("Distance from " + src + " to " + i + " is " + dist[i]);
            }
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int V = sc.nextInt();
        int E = sc.nextInt();
        
        Graph g = new Graph(V);
        
        for (int i = 0; i < E; i++) {
            int src = sc.nextInt();
            int dest = sc.nextInt();
            int weight = sc.nextInt();
            g.addEdge(src, dest, weight);
        }
        
        g.shortestPath(0);
    }
}`
};

interface CodePreviewPanelProps {
  height?: number;
}

export function CodePreviewPanel({ height = 600 }: CodePreviewPanelProps) {
  const [activeTab, setActiveTab] = useState("cpp");
  const [projectTitle, setProjectTitle] = useState("Binary Search - Codeforces");
  const [isTyping, setIsTyping] = useState(false);
  const [typewriterLine, setTypewriterLine] = useState(0);
  const [typingProgress, setTypingProgress] = useState(0);  // Track typing progress
  const [typedCode, setTypedCode] = useState("");  // Store current typed code
  const [originalCode, setOriginalCode] = useState("");  // Store the original code
  const [typingSpeed, setTypingSpeed] = useState(30);  // Milliseconds per character
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);  // Store timeout reference
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>("explorer");

  // Function to start typing animation
  const startTypingAnimation = (code: string, targetLine: number) => {
    // Cancel any existing typing animation
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Set up the typing animation
    setIsTyping(true);
    setTypewriterLine(targetLine);
    setOriginalCode(code);
    setTypedCode("");
    setTypingProgress(0);
    
    // Split code into lines to determine where to start typing
    const codeLines = code.split('\n');
    
    // Find starting and ending positions
    let startPos = 0;
    for (let i = 0; i < targetLine; i++) {
      if (i < codeLines.length) {
        startPos += codeLines[i].length + 1; // +1 for newline
      }
    }
    
    // Start the typing animation from the target line
    typeNextCharacter(code, startPos, 0);
  };
  
  // Function to type one character at a time
  const typeNextCharacter = (code: string, startPos: number, progress: number) => {
    // Continue typing until we reach the end of the code
    if (startPos + progress < code.length) {
      // Calculate the current position in the code
      const currentPos = startPos + progress;
      
      // Only show code up to the current typing position - preserve code before the target line
      const codeUpToTarget = code.slice(0, startPos);
      const typedPart = code.slice(startPos, currentPos + 1); // Include the current character
      
      // Set the typed code to what's been typed so far
      setTypedCode(codeUpToTarget + typedPart);
      setTypingProgress(progress);
      
      // Randomize typing speed to simulate human typing - faster for common characters, slower for special ones
      const char = code[currentPos];
      let nextDelay = typingSpeed;
      
      // Add natural typing rhythm variations
      if (char === ' ' || char === '\n') {
        // Slight pause at spaces and newlines
        nextDelay = Math.random() * 80 + 40;
      } else if (char === '(' || char === '{' || char === '[' || char === ':' || char === ';') {
        // Slower for opening symbols
        nextDelay = Math.random() * 100 + 50;
      } else if (/[A-Z]/.test(char)) {
        // Slower for capital letters
        nextDelay = Math.random() * 70 + 30;
      } else if (/[a-z]/.test(char)) {
        // Faster for lowercase letters
        nextDelay = Math.random() * 30 + 15;
      } else if (/[0-9]/.test(char)) {
        // Medium speed for numbers
        nextDelay = Math.random() * 50 + 25;
      } else if (progress % 10 === 0) {
        // Occasional longer pause every 10 characters to simulate thinking
        nextDelay = Math.random() * 200 + 100;
      }
      
      // Schedule the next character
      const timeout = setTimeout(() => {
        typeNextCharacter(code, startPos, progress + 1);
      }, nextDelay);
      
      setTypingTimeout(timeout);
    } else {
      // End typing animation after a delay
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setTypingTimeout(null);
        // Set the fully typed code
        setTypedCode(code);
      }, 1000);
      
      setTypingTimeout(timeout);
    }
  };
  
  // Update cursor styles for a more realistic effect
  const getCursorStyle = () => {
    return {
      animation: `cursorBlink 1s ${isTyping ? 'steps(1)' : 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'} infinite`,
      opacity: isTyping ? 1 : 0.7
    };
  };

  // Update project title based on active tab
  useEffect(() => {
    switch (activeTab) {
      case "cpp":
        setProjectTitle("Binary Search - Codeforces");
        startTypingAnimation(codeSnippets.cpp, 6);
        break;
      case "python":
        setProjectTitle("Frog Jump - AtCoder");
        startTypingAnimation(codeSnippets.python, 6);
        break;
      case "java":
        setProjectTitle("Dijkstra's Algorithm - ICPC");
        startTypingAnimation(codeSnippets.java, 6);
        break;
      default:
        setProjectTitle("Competitive Programming");
    }
    
    // Cleanup function
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [activeTab]);

  // This is the actual code to display - either the typing animation or the full code
  const displayCode = (language: string) => {
    // If typing, show the partially typed code, otherwise show full code
    if (isTyping && activeTab === language) {
      return typedCode;
    }
    return codeSnippets[language as keyof typeof codeSnippets];
  };

  return (
    <div className="h-full w-full relative overflow-hidden flex bg-transparent rounded-lg shadow-xl shadow-black/30">
      {/* Activity Bar / Left Sidebar */}
      <div className="w-10 bg-[#333333] flex flex-col items-center py-2 border-r border-[#252526]">
        {/* AlgoAtlas Logo */}
        <div className="w-full flex justify-center mb-4 mt-1">
          <div className="text-[#007acc] font-bold text-xl flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                 className="w-6 h-6 text-[#007acc]">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="text-[8px] mt-1 text-white">AlgoAtlas</span>
          </div>
        </div>
        
        <div 
          className={`w-full flex justify-center py-2 border-l-2 cursor-pointer ${activeSidebarItem === "explorer" ? "border-l-[#007acc] bg-[#252526]" : "border-l-transparent hover:bg-[#2a2a2a]"}`}
          onClick={() => setActiveSidebarItem("explorer")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               className={`w-5 h-5 ${activeSidebarItem === "explorer" ? "text-white" : "text-gray-400"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div 
          className={`w-full flex justify-center py-2 border-l-2 cursor-pointer ${activeSidebarItem === "search" ? "border-l-[#007acc] bg-[#252526]" : "border-l-transparent hover:bg-[#2a2a2a]"}`}
          onClick={() => setActiveSidebarItem("search")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               className={`w-5 h-5 ${activeSidebarItem === "search" ? "text-white" : "text-gray-400"}`}>
            <circle cx="11" cy="11" r="8" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <div 
          className={`w-full flex justify-center py-2 border-l-2 cursor-pointer ${activeSidebarItem === "git" ? "border-l-[#007acc] bg-[#252526]" : "border-l-transparent hover:bg-[#2a2a2a]"}`}
          onClick={() => setActiveSidebarItem("git")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               className={`w-5 h-5 ${activeSidebarItem === "git" ? "text-white" : "text-gray-400"}`}>
            <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v5a3 3 0 01-3 3h-2m-2-4l2 2 2-2" />
          </svg>
        </div>
        <div 
          className={`w-full flex justify-center py-2 border-l-2 cursor-pointer ${activeSidebarItem === "debug" ? "border-l-[#007acc] bg-[#252526]" : "border-l-transparent hover:bg-[#2a2a2a]"}`}
          onClick={() => setActiveSidebarItem("debug")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               className={`w-5 h-5 ${activeSidebarItem === "debug" ? "text-white" : "text-gray-400"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <div 
          className={`w-full flex justify-center py-2 border-l-2 cursor-pointer ${activeSidebarItem === "extensions" ? "border-l-[#007acc] bg-[#252526]" : "border-l-transparent hover:bg-[#2a2a2a]"}`}
          onClick={() => setActiveSidebarItem("extensions")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               className={`w-5 h-5 ${activeSidebarItem === "extensions" ? "text-white" : "text-gray-400"}`}>
            <rect x="3" y="3" width="7" height="7" strokeWidth={1.5} />
            <rect x="14" y="3" width="7" height="7" strokeWidth={1.5} />
            <rect x="3" y="14" width="7" height="7" strokeWidth={1.5} />
            <rect x="14" y="14" width="7" height="7" strokeWidth={1.5} />
          </svg>
        </div>
        
        <div className="flex-1"></div>
        <div 
          className={`w-full flex justify-center py-2 border-l-2 cursor-pointer ${activeSidebarItem === "account" ? "border-l-[#007acc] bg-[#252526]" : "border-l-transparent hover:bg-[#2a2a2a]"}`}
          onClick={() => setActiveSidebarItem("account")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               className={`w-5 h-5 ${activeSidebarItem === "account" ? "text-white" : "text-gray-400"}`}>
            <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
            <circle cx="12" cy="10" r="3" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.168 18.849A4 4 0 0110 16h4a4 4 0 013.834 2.855" />
          </svg>
        </div>
        <div 
          className={`w-full flex justify-center py-2 border-l-2 cursor-pointer ${activeSidebarItem === "settings" ? "border-l-[#007acc] bg-[#252526]" : "border-l-transparent hover:bg-[#2a2a2a]"}`}
          onClick={() => setActiveSidebarItem("settings")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               className={`w-5 h-5 ${activeSidebarItem === "settings" ? "text-white" : "text-gray-400"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
          </svg>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* VS Code-like header with menu bar */}
        <div className="flex items-center bg-[#252526] border-b border-[#1e1e1e] text-white">
        <div className="flex items-center space-x-2 px-3 py-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

          {/* VS Code menu items */}
          <div className="flex items-center text-xs text-gray-300 ml-2">
            <span className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">File</span>
            <span className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">Edit</span>
            <span className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">Selection</span>
            <span className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">View</span>
            <span className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">Go</span>
            <span className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">...</span>
          </div>
          
          {/* Search box */}
          <div className="flex-1 flex justify-center">
            <div className="relative max-w-md w-full mx-4">
              <input
                type="text"
                className="w-full bg-[#3c3c3c] text-white/70 text-xs rounded px-6 py-1 outline-none"
                placeholder="Search"
                disabled
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Window controls */}
          <div className="hidden md:flex items-center space-x-3 mr-2">
            <div className="text-gray-400 hover:text-white cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
            <div className="flex space-x-2">
              <span className="text-white/70 text-xs cursor-pointer hover:bg-[#3c3c3c] px-1">—</span>
              <span className="text-white/70 text-xs cursor-pointer hover:bg-[#3c3c3c] px-1">□</span>
              <span className="text-white/70 text-xs cursor-pointer hover:bg-[#3c3c3c] px-1">✕</span>
            </div>
          </div>
        </div>
        
        {/* Tabs section */}
        <div className="flex items-center bg-[#252526] border-b border-[#1e1e1e] text-white">
        <div className="flex-1 flex items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger
                value="cpp"
                className={cn(
                  "rounded-none px-2 sm:px-4 py-2 h-8 data-[state=active]:shadow-none transition-all text-xs",
                    "data-[state=active]:bg-[#1e1e1e] data-[state=active]:border-t-2 data-[state=active]:border-t-[#007acc]",
                  "data-[state=inactive]:bg-[#2d2d2d] data-[state=inactive]:text-[#8f8f8f]"
                )}
              >
                codeforces.cpp
              </TabsTrigger>
              <TabsTrigger
                value="python"
                className={cn(
                  "rounded-none px-2 sm:px-4 py-2 h-8 data-[state=active]:shadow-none transition-all text-xs",
                    "data-[state=active]:bg-[#1e1e1e] data-[state=active]:border-t-2 data-[state=active]:border-t-[#007acc]",
                  "data-[state=inactive]:bg-[#2d2d2d] data-[state=inactive]:text-[#8f8f8f]"
                )}
              >
                atcoder.py
              </TabsTrigger>
              <TabsTrigger
                value="java"
                className={cn(
                  "rounded-none px-2 sm:px-4 py-2 h-8 data-[state=active]:shadow-none transition-all text-xs",
                    "data-[state=active]:bg-[#1e1e1e] data-[state=active]:border-t-2 data-[state=active]:border-t-[#007acc]",
                  "data-[state=inactive]:bg-[#2d2d2d] data-[state=inactive]:text-[#8f8f8f]"
                )}
              >
                icpc.java
              </TabsTrigger>
            </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* File path breadcrumb */}
        <div className="bg-[#1e1e1e] px-3 py-1 text-xs text-gray-400 flex items-center border-b border-[#3c3c3c]/30">
          <span className="text-gray-500">C: &gt; Users &gt; AlgoAtlas &gt;</span>
          <span className="text-white ml-1">
            {activeTab === "cpp" && "codeforces.cpp"}
            {activeTab === "python" && "atcoder.py"}
            {activeTab === "java" && "icpc.java"}
          </span>
        </div>

            {/* Code content */}
        <Tabs value={activeTab} className="flex-1 flex flex-col overflow-hidden">
          <style jsx global>{scrollbarStyles}</style>
          <TabsContent value="cpp" className="mt-0 p-0 data-[state=inactive]:hidden h-full overflow-hidden">
              {!isMobile && (
              <div 
                className="overflow-auto relative bg-[#1e1e1e] vscode-scrollbar"
                style={{ height: `${height}px`, width: "100%" }}
              >
                  <VSCodeEditor language="cpp" code={displayCode("cpp")} />
                  {isTyping && activeTab === "cpp" && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div 
                      className="absolute left-0 h-5 bg-[#264f78]/30 w-full" 
                        style={{ top: `${typewriterLine * 24}px` }}
                      >
                        <div 
                        className="h-full w-2 bg-[#007acc] ml-4"
                          style={{ 
                            animation: "cursorBlink 0.8s steps(2) infinite",
                          boxShadow: "0 0 5px rgba(0, 122, 204, 0.5)"
                          }}
                        ></div>
                    </div>
                    
                    {/* Autocomplete dropdown - only show sometimes */}
                    {typingProgress > 20 && typingProgress < 40 && (
                      <div 
                        className="absolute bg-[#252526] border border-[#454545] shadow-lg rounded-sm z-10"
                        style={{ 
                          top: `${(typewriterLine * 24) + 24}px`, 
                          left: '150px',
                          width: '240px'
                        }}
                      >
                        <div className="px-1 py-1 bg-[#0e639c] text-white">Suggestions</div>
                        <div className="py-1">
                          <div className="flex items-center px-2 py-1 bg-[#0d3a58] text-white">
                            <svg className="w-4 h-4 mr-2 text-orange-400" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M5.5 3l.5.5V4h1v-.5L7.5 3h1l.5.5V4h1v-.5L10.5 3h1l.5.5V4h1v-.5L13.5 3h1l.5.5v9l-.5.5h-13l-.5-.5v-9l.5-.5h1l.5.5V4h1v-.5L3.5 3h2z"/>
                            </svg>
                            binarySearch(vector&lt;int&gt;&, int)
                          </div>
                          <div className="flex items-center px-2 py-1 hover:bg-[#0d3a58] text-gray-300">
                            <svg className="w-4 h-4 mr-2 text-blue-400" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M14 2.5V13H3v1h11.5l.5-.5V2h-1z"/>
                              <path d="M13 1.5V12H2v1h11.5l.5-.5V1h-1z"/>
                              <path d="M11 1H1.5l-.5.5v9l.5.5H11V1zm0 9H2V2h9v8z"/>
                            </svg>
                            binary_search
                          </div>
                          <div className="flex items-center px-2 py-1 hover:bg-[#0d3a58] text-gray-300">
                            <svg className="w-4 h-4 mr-2 text-purple-400" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M10 1.5V2h1v.5l.5.5H13v1h-1.5l-.5.5V5h-1v-.5L9.5 4H8v1H6V4H4.5l-.5.5V5H3v-.5l-.5-.5H1v-1h1.5l.5-.5V2h1v.5l.5.5H6V2h2V1h2v.5z"/>
                              <path d="M0 7v7.5l.5.5h15l.5-.5V7H0zm15 7H1V8h14v6z"/>
                            </svg>
                            binary_function
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          <TabsContent value="python" className="mt-0 p-0 data-[state=inactive]:hidden h-full overflow-hidden">
              {!isMobile && (
              <div 
                className="overflow-auto relative bg-[#1e1e1e] vscode-scrollbar"
                style={{ height: `${height}px`, width: "100%" }}
              >
                  <VSCodeEditor language="python" code={displayCode("python")} />
                  {isTyping && activeTab === "python" && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div 
                      className="absolute left-0 h-5 bg-[#264f78]/30 w-full" 
                        style={{ top: `${typewriterLine * 24}px` }}
                      >
                        <div 
                        className="h-full w-2 bg-[#007acc] ml-4"
                          style={{ 
                            animation: "cursorBlink 0.8s steps(2) infinite",
                          boxShadow: "0 0 5px rgba(0, 122, 204, 0.5)"
                          }}
                        ></div>
                    </div>
                    
                    {/* Autocomplete dropdown - only show sometimes */}
                    {typingProgress > 15 && typingProgress < 30 && (
                      <div 
                        className="absolute bg-[#252526] border border-[#454545] shadow-lg rounded-sm z-10"
                        style={{ 
                          top: `${(typewriterLine * 24) + 24}px`, 
                          left: '120px',
                          width: '220px'
                        }}
                      >
                        <div className="px-1 py-1 bg-[#0e639c] text-white">Suggestions</div>
                        <div className="py-1">
                          <div className="flex items-center px-2 py-1 bg-[#0d3a58] text-white">
                            <svg className="w-4 h-4 mr-2 text-yellow-400" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M4.5 2h-1V1h-1v1H1.5l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5zm-.5 3H2V3h2v2zm6.5-3h-1V1h-1v1H7.5l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5zm-.5 3H9V3h2v2zm-5 3h-1V8h-1v1H1.5l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5zm-.5 3H2v-2h2v2zm6.5-3h-1V8h-1v1H7.5l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5zm-.5 3H9v-2h2v2z"/>
                            </svg>
                            solve()
                          </div>
                          <div className="flex items-center px-2 py-1 hover:bg-[#0d3a58] text-gray-300">
                            <svg className="w-4 h-4 mr-2 text-blue-400" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M14 2.5V13H3v1h11.5l.5-.5V2h-1z"/>
                              <path d="M13 1.5V12H2v1h11.5l.5-.5V1h-1z"/>
                              <path d="M11 1H1.5l-.5.5v9l.5.5H11V1zm0 9H2V2h9v8z"/>
                            </svg>
                            sorted
                          </div>
                          <div className="flex items-center px-2 py-1 hover:bg-[#0d3a58] text-gray-300">
                            <svg className="w-4 h-4 mr-2 text-blue-400" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M14 2.5V13H3v1h11.5l.5-.5V2h-1z"/>
                              <path d="M13 1.5V12H2v1h11.5l.5-.5V1h-1z"/>
                              <path d="M11 1H1.5l-.5.5v9l.5.5H11V1zm0 9H2V2h9v8z"/>
                            </svg>
                            solution
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          <TabsContent value="java" className="mt-0 p-0 data-[state=inactive]:hidden h-full overflow-hidden">
              {!isMobile && (
              <div 
                className="overflow-auto relative bg-[#1e1e1e] vscode-scrollbar"
                style={{ height: `${height}px`, width: "100%" }}
              >
                  <VSCodeEditor language="java" code={displayCode("java")} />
                  {isTyping && activeTab === "java" && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div 
                      className="absolute left-0 h-5 bg-[#264f78]/30 w-full" 
                        style={{ top: `${typewriterLine * 24}px` }}
                      >
                        <div 
                        className="h-full w-2 bg-[#007acc] ml-4"
                          style={{ 
                            animation: "cursorBlink 0.8s steps(2) infinite",
                          boxShadow: "0 0 5px rgba(0, 122, 204, 0.5)"
                          }}
                        ></div>
                    </div>
                    
                    {/* Autocomplete dropdown - only show sometimes */}
                    {typingProgress > 25 && typingProgress < 45 && (
                      <div 
                        className="absolute bg-[#252526] border border-[#454545] shadow-lg rounded-sm z-10"
                        style={{ 
                          top: `${(typewriterLine * 24) + 24}px`, 
                          left: '180px',
                          width: '280px'
                        }}
                      >
                        <div className="px-1 py-1 bg-[#0e639c] text-white">Suggestions</div>
                        <div className="py-1">
                          <div className="flex items-center px-2 py-1 bg-[#0d3a58] text-white">
                            <svg className="w-4 h-4 mr-2 text-orange-400" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M5.5 3l.5.5V4h1v-.5L7.5 3h1l.5.5V4h1v-.5L10.5 3h1l.5.5V4h1v-.5L13.5 3h1l.5.5v9l-.5.5h-13l-.5-.5v-9l.5-.5h1l.5.5V4h1v-.5L3.5 3h2z"/>
                            </svg>
                            shortestPath(int)
                          </div>
                          <div className="flex items-center px-2 py-1 hover:bg-[#0d3a58] text-gray-300">
                            <svg className="w-4 h-4 mr-2 text-purple-400" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M10 1.5V2h1v.5l.5.5H13v1h-1.5l-.5.5V5h-1v-.5L9.5 4H8v1H6V4H4.5l-.5.5V5H3v-.5l-.5-.5H1v-1h1.5l.5-.5V2h1v.5l.5.5H6V2h2V1h2v.5z"/>
                              <path d="M0 7v7.5l.5.5h15l.5-.5V7H0zm15 7H1V8h14v6z"/>
                            </svg>
                            ShortestPathFirst
                          </div>
                          <div className="flex items-center px-2 py-1 hover:bg-[#0d3a58] text-gray-300">
                            <svg className="w-4 h-4 mr-2 text-green-400" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M4.5 2h-1V1h-1v1H1.5l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5zm-.5 3H2V3h2v2zm6.5-3h-1V1h-1v1H7.5l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5zm-.5 3H9V3h2v2zm-5 3h-1V8h-1v1H1.5l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5zm-.5 3H2v-2h2v2zm6.5-3h-1V8h-1v1H7.5l-.5.5v3l.5.5h3l.5-.5v-3l-.5-.5zm-.5 3H9v-2h2v2z"/>
                            </svg>
                            String
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
      
        {/* VS Code Status Bar */}
        <div className="bg-[#007acc] text-white text-xs px-3 py-1 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="mr-2">{projectTitle}</span>
              <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-white animate-pulse' : 'bg-white/70'}`}></span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
              <span>
                {activeTab === "cpp" && "C++"}
                {activeTab === "python" && "Python"}
                {activeTab === "java" && "Java"}
              </span>
            </div>
            <div>Ln 1, Col 1</div>
            <div>Spaces: 2</div>
            <div>UTF-8</div>
          </div>
        </div>
      </div>
    </div>
  );
} 