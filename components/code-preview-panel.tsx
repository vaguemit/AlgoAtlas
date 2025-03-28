"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { VSCodeEditor } from "./vscode-editor";
import { useMediaQuery } from "@/hooks/use-media-query";

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

export function CodePreviewPanel() {
  const [activeTab, setActiveTab] = useState("cpp");
  const [projectTitle, setProjectTitle] = useState("Binary Search - Codeforces");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Update project title based on active tab
  useEffect(() => {
    switch (activeTab) {
      case "cpp":
        setProjectTitle("Binary Search - Codeforces");
        break;
      case "python":
        setProjectTitle("Frog Jump - AtCoder");
        break;
      case "java":
        setProjectTitle("Dijkstra's Algorithm - ICPC");
        break;
      default:
        setProjectTitle("Competitive Programming");
    }
  }, [activeTab]);

  return (
    <div className="h-full w-full relative overflow-hidden flex flex-col bg-navy-950 rounded-lg">
      {/* VS Code-like header with window controls */}
      <div className="flex items-center bg-[#252526] border-b border-[#3c3c3c]">
        <div className="flex items-center space-x-2 px-3 py-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        <div className="flex-1 flex items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger
                value="cpp"
                className={cn(
                  "rounded-none px-2 sm:px-4 py-2 h-8 data-[state=active]:shadow-none transition-all text-xs",
                  "data-[state=active]:bg-[#1e1e1e] data-[state=active]:border-t-2 data-[state=active]:border-t-purple-500",
                  "data-[state=inactive]:bg-[#2d2d2d] data-[state=inactive]:text-[#8f8f8f]"
                )}
              >
                codeforces.cpp
              </TabsTrigger>
              <TabsTrigger
                value="python"
                className={cn(
                  "rounded-none px-2 sm:px-4 py-2 h-8 data-[state=active]:shadow-none transition-all text-xs",
                  "data-[state=active]:bg-[#1e1e1e] data-[state=active]:border-t-2 data-[state=active]:border-t-purple-500",
                  "data-[state=inactive]:bg-[#2d2d2d] data-[state=inactive]:text-[#8f8f8f]"
                )}
              >
                atcoder.py
              </TabsTrigger>
              <TabsTrigger
                value="java"
                className={cn(
                  "rounded-none px-2 sm:px-4 py-2 h-8 data-[state=active]:shadow-none transition-all text-xs",
                  "data-[state=active]:bg-[#1e1e1e] data-[state=active]:border-t-2 data-[state=active]:border-t-purple-500",
                  "data-[state=inactive]:bg-[#2d2d2d] data-[state=inactive]:text-[#8f8f8f]"
                )}
              >
                icpc.java
              </TabsTrigger>
            </TabsList>

            {/* Code content */}
            <TabsContent value="cpp" className="mt-0 p-0 data-[state=inactive]:hidden">
              {!isMobile && (
                <div className="max-h-[400px] overflow-auto">
                  <VSCodeEditor language="cpp" code={codeSnippets.cpp} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="python" className="mt-0 p-0 data-[state=inactive]:hidden">
              {!isMobile && (
                <div className="max-h-[400px] overflow-auto">
                  <VSCodeEditor language="python" code={codeSnippets.python} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="java" className="mt-0 p-0 data-[state=inactive]:hidden">
              {!isMobile && (
                <div className="max-h-[400px] overflow-auto">
                  <VSCodeEditor language="java" code={codeSnippets.java} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* VS Code-like status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#007acc] text-white text-xs">
        <div className="flex items-center space-x-3">
          <span>{activeTab === "cpp" ? "C++" : activeTab === "python" ? "Python" : "Java"}</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
} 