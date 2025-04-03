"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ComplexityResult } from "@/app/utils/big-o-analyzer"

interface PerformanceMetricsProps {
  executionTime: number | string
  memoryUsed: number | string
  complexityAnalysis: ComplexityResult | null
  showChart: boolean
}

export function PerformanceMetrics({
  executionTime,
  memoryUsed,
  complexityAnalysis,
  showChart = true
}: PerformanceMetricsProps) {
  const [memoryData, setMemoryData] = useState<any[]>([])
  const [timeData, setTimeData] = useState<any[]>([])
  
  // Convert params to numbers to ensure proper handling
  const execTime = typeof executionTime === 'string' ? parseFloat(executionTime) : executionTime
  const memUsed = typeof memoryUsed === 'string' ? parseFloat(memoryUsed) : memoryUsed
  
  useEffect(() => {
    // Prepare memory usage data for visualization
    if (memUsed > 0) {
      // Convert to KB for better visualization
      const memoryKB = memUsed / 1024
      
      // Create memory usage categories
      setMemoryData([
        { name: 'Current', value: memoryKB, fill: '#4ade80' },
        { name: 'Max Allowed', value: 512000 / 1024, fill: '#94a3b8' }
      ])
    }
    
    // Prepare execution time data for visualization
    if (execTime > 0) {
      // Categorize execution time for comparison
      let category = 'Excellent'
      let color = '#4ade80' // Green
      
      if (execTime > 1.0) {
        category = 'Slow'
        color = '#f87171' // Red
      } else if (execTime > 0.5) {
        category = 'Average'
        color = '#fbbf24' // Yellow
      } else if (execTime > 0.1) {
        category = 'Good'
        color = '#60a5fa' // Blue
      }
      
      setTimeData([
        { name: 'Execution Time', value: execTime, category, color }
      ])
    }
  }, [execTime, memUsed])
  
  // Helper function to format bytes to readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Safe number formatter with fallback
  const safeNumberFormat = (value: number | string | null | undefined, decimals = 3, suffix = ''): string => {
    if (value === null || value === undefined) return 'N/A'
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue) || numValue === 0) return 'N/A'
    return `${numValue.toFixed(decimals)}${suffix}`
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="text-xs"
    >
      <h3 className="text-purple-400 font-semibold mb-3">Performance Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Execution Time */}
        <div className="bg-[#252526] rounded-md p-3 border border-[#3c3c3c]">
          <h4 className="text-[11px] text-[#8f8f8f] mb-1">Execution Time</h4>
          <p className="text-lg font-bold text-white">
            {safeNumberFormat(execTime, 3, ' s')}
          </p>
          {timeData.length > 0 && timeData[0].category && (
            <span 
              className="inline-block px-2 py-0.5 mt-1 rounded-sm text-[10px] font-medium"
              style={{ backgroundColor: timeData[0].color + '20', color: timeData[0].color }}
            >
              {timeData[0].category}
            </span>
          )}
        </div>
        
        {/* Memory Usage */}
        <div className="bg-[#252526] rounded-md p-3 border border-[#3c3c3c]">
          <h4 className="text-[11px] text-[#8f8f8f] mb-1">Memory Usage</h4>
          <p className="text-lg font-bold text-white">
            {memUsed > 0 ? formatBytes(memUsed) : 'N/A'}
          </p>
          {memUsed > 0 && (
            <div className="mt-1 text-[10px] text-[#8f8f8f]">
              {((memUsed / 512000) * 100).toFixed(2)}% of limit
            </div>
          )}
        </div>
      </div>
      
      {/* Complexity Analysis */}
      {complexityAnalysis && (
        <div className="mb-4 bg-[#252526] rounded-md p-3 border border-[#3c3c3c]">
          <h4 className="text-[11px] text-[#8f8f8f] mb-2">Algorithm Complexity</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-[10px] text-[#8f8f8f]">Time Complexity</p>
              <p className="text-sm font-mono font-bold text-blue-400">{complexityAnalysis.timeComplexity}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#8f8f8f]">Space Complexity</p>
              <p className="text-sm font-mono font-bold text-green-400">{complexityAnalysis.spaceComplexity}</p>
            </div>
          </div>
          
          {complexityAnalysis.details.length > 0 && (
            <div className="mt-3 border-t border-[#3c3c3c] pt-3">
              <h5 className="text-[10px] text-[#8f8f8f] mb-2">Detected Patterns</h5>
              <ul className="text-[11px] space-y-1.5">
                {complexityAnalysis.details.map((detail, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-[#e0e0e0]">{detail.pattern}</span>
                    <span className="font-mono text-purple-300">
                      {detail.complexity} {detail.count > 1 ? `(${detail.count})` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Memory Usage Chart */}
      {showChart && memoryData.length > 0 && (
        <div className="bg-[#252526] rounded-md p-3 border border-[#3c3c3c]">
          <h4 className="text-[11px] text-[#8f8f8f] mb-2">Memory Usage Chart</h4>
          <div className="h-28 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memoryData} layout="vertical">
                <XAxis 
                  type="number" 
                  domain={[0, 512000 / 1024]} 
                  tickFormatter={(value) => `${value} KB`} 
                  stroke="#8f8f8f"
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#8f8f8f"
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)} KB`, 'Memory']}
                  contentStyle={{ 
                    backgroundColor: '#252526', 
                    border: '1px solid #3c3c3c',
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}
                />
                <Bar dataKey="value" radius={[2, 2, 2, 2]}>
                  {memoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.div>
  )
} 