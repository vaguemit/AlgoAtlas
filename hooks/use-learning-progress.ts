'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

export type ProgressStatus = 'not-started' | 'reading' | 'practicing' | 'complete' | 'skipped' | 'ignored'

export interface ProgressItem {
  id: string
  user_id: string
  path_id: string
  topic_id: string | null
  subtopic_id: string | null
  status: ProgressStatus
  last_updated: string
}

interface UseLearningProgressOptions {
  pathId: string
  fallbackToLocalStorage?: boolean
}

interface UseLearningProgressResult {
  progress: ProgressItem[]
  completionPercentage: number
  isLoading: boolean
  error: string | null
  updateProgress: (topicId: string | null, subtopicId: string | null, status: ProgressStatus) => Promise<void>
  getStatusFor: (topicId?: string | null, subtopicId?: string | null) => ProgressStatus
}

export function useLearningProgress({ 
  pathId, 
  fallbackToLocalStorage = true 
}: UseLearningProgressOptions): UseLearningProgressResult {
  const { user, loading: authLoading } = useAuth()
  const [progress, setProgress] = useState<ProgressItem[]>([])
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Function to build localStorage keys for fallback
  const getLocalStorageKey = useCallback((type: 'topic' | 'subtopic') => {
    return `${pathId}-${type}-progress`
  }, [pathId])
  
  // Function to fetch progress data
  const fetchProgress = useCallback(async () => {
    if (authLoading) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      if (user) {
        // User is authenticated, fetch from API
        const response = await fetch(`/api/learning-progress?pathId=${pathId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch learning progress')
        }
        
        const data = await response.json()
        
        // Check the authenticated flag from the updated API
        if (data.authenticated === false) {
          console.log('User not authenticated for progress, using fallback storage')
          // Fall back to local storage if the API indicates not authenticated
          if (fallbackToLocalStorage) {
            handleLocalStorageFallback()
          } else {
            setProgress([])
            setCompletionPercentage(0)
          }
        } else {
          setProgress(data.items || [])
          setCompletionPercentage(data.completion || 0)
        }
      } else if (fallbackToLocalStorage) {
        // User is not authenticated, use localStorage (if available)
        handleLocalStorageFallback()
      }
    } catch (err) {
      console.error('Error fetching learning progress:', err)
      // More descriptive error message
      setError('Failed to load progress data. Please try refreshing the page or logging in again.')
    } finally {
      setIsLoading(false)
    }
  }, [authLoading, user, pathId, fallbackToLocalStorage, getLocalStorageKey])
  
  // Helper function for localStorage fallback to avoid code duplication
  const handleLocalStorageFallback = useCallback(() => {
    if (typeof window === 'undefined') return
    
    // Retrieve data from localStorage
    const topicProgress = localStorage.getItem(getLocalStorageKey('topic'))
    const subtopicProgress = localStorage.getItem(getLocalStorageKey('subtopic'))
    
    const items: ProgressItem[] = []
    let total = 0
    let completed = 0
    
    // Process topic progress
    if (topicProgress) {
      const topics = JSON.parse(topicProgress) as Record<string, ProgressStatus>
      Object.entries(topics).forEach(([topicId, status]) => {
        items.push({
          id: `local-topic-${topicId}`,
          user_id: 'local',
          path_id: pathId,
          topic_id: topicId,
          subtopic_id: null,
          status,
          last_updated: new Date().toISOString()
        })
        
        total++
        if (status === 'complete') completed++
      })
    }
    
    // Process subtopic progress
    if (subtopicProgress) {
      const subtopics = JSON.parse(subtopicProgress) as Record<string, ProgressStatus>
      Object.entries(subtopics).forEach(([key, status]) => {
        const [topicId, subtopicId] = key.split('::')
        
        items.push({
          id: `local-subtopic-${key}`,
          user_id: 'local',
          path_id: pathId,
          topic_id: topicId,
          subtopic_id: subtopicId,
          status,
          last_updated: new Date().toISOString()
        })
        
        total++
        if (status === 'complete') completed++
      })
    }
    
    setProgress(items)
    setCompletionPercentage(total > 0 ? Math.round((completed / total) * 100) : 0)
  }, [pathId, getLocalStorageKey])
  
  // Function to update progress
  const updateProgress = useCallback(async (
    topicId: string | null, 
    subtopicId: string | null, 
    status: ProgressStatus
  ) => {
    try {
      if (user) {
        // User is authenticated, update via API
        const response = await fetch('/api/learning-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pathId,
            topicId,
            subtopicId,
            status
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to update learning progress')
        }
        
        const data = await response.json()
        
        // Update local state with new completion percentage
        setCompletionPercentage(data.completion || 0)
        
        // Refresh the progress data
        fetchProgress()
      } else if (fallbackToLocalStorage && typeof window !== 'undefined') {
        // User is not authenticated, use localStorage
        if (subtopicId) {
          // Update subtopic progress
          const key = getLocalStorageKey('subtopic')
          const existing = localStorage.getItem(key)
          const progressObj = existing ? JSON.parse(existing) : {}
          
          const subtopicKey = `${topicId}::${subtopicId}`
          progressObj[subtopicKey] = status
          
          localStorage.setItem(key, JSON.stringify(progressObj))
        } else if (topicId) {
          // Update topic progress
          const key = getLocalStorageKey('topic')
          const existing = localStorage.getItem(key)
          const progressObj = existing ? JSON.parse(existing) : {}
          
          progressObj[topicId] = status
          
          localStorage.setItem(key, JSON.stringify(progressObj))
        }
        
        // Refresh progress from localStorage
        fetchProgress()
      }
      
      // Show success toast
      toast.success('Progress updated', {
        description: 'Your learning progress has been saved'
      })
    } catch (err) {
      console.error('Error updating progress:', err)
      
      // Show error toast
      toast.error('Failed to update progress', {
        description: 'Please try again later'
      })
    }
  }, [user, pathId, fetchProgress, fallbackToLocalStorage, getLocalStorageKey])
  
  // Function to get status for a specific topic/subtopic
  const getStatusFor = useCallback((topicId?: string | null, subtopicId?: string | null): ProgressStatus => {
    if (!topicId) return 'not-started'
    
    // Find the relevant progress item
    const item = progress.find(p => {
      if (subtopicId) {
        return p.topic_id === topicId && p.subtopic_id === subtopicId
      } else {
        return p.topic_id === topicId && p.subtopic_id === null
      }
    })
    
    return item?.status || 'not-started'
  }, [progress])
  
  // Fetch progress data when component mounts or dependencies change
  useEffect(() => {
    fetchProgress()
  }, [fetchProgress, user])
  
  return {
    progress,
    completionPercentage,
    isLoading,
    error,
    updateProgress,
    getStatusFor
  }
} 