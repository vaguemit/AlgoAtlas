'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle, RefreshCw, Book, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function TestLearningProgressPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [learningPaths, setLearningPaths] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [currentProgress, setCurrentProgress] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [message, setMessage] = useState<{type: string, text: string} | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const supabase = createClientComponentClient()

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    
    loadUser()
  }, [supabase])
  
  // Load learning data
  const loadLearningData = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      // Load learning paths
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select('*')
        .order('created_at')
      
      if (pathsError) throw pathsError
      setLearningPaths(pathsData || [])
      
      // Load modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('learning_modules')
        .select('*')
        .order('order_index')
      
      if (modulesError) throw modulesError
      setModules(modulesData || [])
      
      // Load items
      const { data: itemsData, error: itemsError } = await supabase
        .from('learning_items')
        .select('*')
        .order('order_index')
      
      if (itemsError) throw itemsError
      setItems(itemsData || [])
      
      // Load user progress if logged in
      if (currentUser) {
        const { data: progressData, error: progressError } = await supabase
          .from('learning_progress')
          .select('*')
          .eq('user_id', currentUser.id)
        
        if (progressError) throw progressError
        setCurrentProgress(progressData || [])
      }
      
      setMessage({
        type: 'success',
        text: 'Learning data loaded successfully!'
      })
    } catch (error: any) {
      console.error('Error loading learning data:', error)
      setMessage({
        type: 'error',
        text: `Error loading data: ${error.message}`
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Update progress for a learning item
  const updateProgress = async (itemId: string, status: string, percentage: number) => {
    if (!currentUser) {
      setMessage({
        type: 'warning',
        text: 'You need to be logged in to track progress'
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      // Check if progress entry exists
      const { data: existingProgress } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('item_id', itemId)
        .maybeSingle()
      
      if (existingProgress) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('learning_progress')
          .update({
            status,
            progress_percentage: percentage,
            last_accessed: new Date().toISOString(),
            completion_date: status === 'completed' ? new Date().toISOString() : null
          })
          .eq('id', existingProgress.id)
        
        if (updateError) throw updateError
      } else {
        // Create new entry
        const { error: insertError } = await supabase
          .from('learning_progress')
          .insert({
            user_id: currentUser.id,
            item_id: itemId,
            status,
            progress_percentage: percentage,
            last_accessed: new Date().toISOString(),
            completion_date: status === 'completed' ? new Date().toISOString() : null
          })
        
        if (insertError) throw insertError
      }
      
      // Reload progress
      const { data: refreshedProgress, error: refreshError } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', currentUser.id)
      
      if (refreshError) throw refreshError
      setCurrentProgress(refreshedProgress || [])
      
      setMessage({
        type: 'success',
        text: `Progress updated to ${status} (${percentage}%)`
      })
    } catch (error: any) {
      console.error('Error updating progress:', error)
      setMessage({
        type: 'error',
        text: `Error updating progress: ${error.message}`
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Get progress for an item
  const getProgressForItem = (itemId: string) => {
    return currentProgress.find(p => p.item_id === itemId)
  }
  
  // Get module for an item
  const getModuleForItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    return item ? modules.find(m => m.id === item.module_id) : null
  }
  
  // Get path for a module
  const getPathForModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId)
    return module ? learningPaths.find(p => p.id === module.path_id) : null
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }
  
  // Load data on initial render
  useEffect(() => {
    loadLearningData()
  }, [currentUser])
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Learning Progress Test</h1>
      <p className="text-center mb-8 text-sm text-gray-400">
        Test your learning progress functionality with sample data
      </p>
      
      {/* Status message */}
      {message && (
        <div className={`p-4 mb-6 rounded-md ${
          message.type === 'success' ? 'bg-green-500/10 border border-green-500/20' :
          message.type === 'error' ? 'bg-red-500/10 border border-red-500/20' :
          'bg-yellow-500/10 border border-yellow-500/20'
        }`}>
          <div className="flex items-start">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : message.type === 'error' ? (
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            )}
            <p className={`${
              message.type === 'success' ? 'text-green-400' :
              message.type === 'error' ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {message.text}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Learning items list */}
        <div className="w-full md:w-1/2">
          <Card className="border-blue-500/20 bg-black/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Learning Items</span>
                <Button variant="outline" size="sm" onClick={loadLearningData} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reload
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-4 text-gray-400">
                  No learning items found. Run the SQL setup script first.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => {
                    const module = getModuleForItem(item.id)
                    const path = module ? getPathForModule(module.id) : null
                    const progress = getProgressForItem(item.id)
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedItem === item.id ? 'bg-blue-500/20 border border-blue-500/40' : 'bg-black/30 hover:bg-black/40'
                        }`}
                        onClick={() => setSelectedItem(item.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-xs text-gray-400">
                              {path?.title} → {module?.title}
                            </p>
                          </div>
                          <Badge variant="outline" className={`${
                            item.type === 'article' ? 'bg-blue-500/10 text-blue-400' :
                            item.type === 'video' ? 'bg-red-500/10 text-red-400' :
                            item.type === 'quiz' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-green-500/10 text-green-400'
                          }`}>
                            {item.type}
                          </Badge>
                        </div>
                        
                        {progress && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className={`${
                                progress.status === 'completed' ? 'text-green-400' :
                                progress.status === 'in_progress' ? 'text-blue-400' :
                                'text-gray-400'
                              }`}>
                                {progress.status.replace('_', ' ')}
                              </span>
                              <span>{progress.progress_percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  progress.status === 'completed' ? 'bg-green-500' :
                                  progress.status === 'in_progress' ? 'bg-blue-500' :
                                  'bg-gray-500'
                                }`} 
                                style={{ width: `${progress.progress_percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Selected item details and progress controls */}
        <div className="w-full md:w-1/2">
          <Card className="border-purple-500/20 bg-black/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                Item Details & Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItem ? (
                <>
                  {items.filter(item => item.id === selectedItem).map(item => {
                    const module = getModuleForItem(item.id)
                    const path = module ? getPathForModule(module.id) : null
                    const progress = getProgressForItem(item.id)
                    
                    return (
                      <div key={item.id} className="space-y-4">
                        <div>
                          <h2 className="text-xl font-bold">{item.title}</h2>
                          <div className="flex items-center mt-1 text-sm">
                            <Book className="h-4 w-4 mr-1" />
                            <span>{path?.title} → {module?.title}</span>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-black/30 rounded-md">
                          <h3 className="font-medium mb-1">Content Preview</h3>
                          <p className="text-sm text-gray-300">{item.content}</p>
                        </div>
                        
                        {currentUser ? (
                          <>
                            <Separator />
                            
                            <div>
                              <h3 className="font-medium mb-2">Current Progress</h3>
                              {progress ? (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center">
                                      <span className="text-gray-400">Status:</span>
                                    </div>
                                    <div>
                                      <Badge variant="outline" className={`${
                                        progress.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                        progress.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-gray-500/10 text-gray-400'
                                      }`}>
                                        {progress.status.replace('_', ' ')}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex items-center">
                                      <span className="text-gray-400">Progress:</span>
                                    </div>
                                    <div>{progress.progress_percentage}%</div>
                                    
                                    <div className="flex items-center">
                                      <span className="text-gray-400">Last accessed:</span>
                                    </div>
                                    <div className="text-xs">{formatDate(progress.last_accessed)}</div>
                                    
                                    {progress.completion_date && (
                                      <>
                                        <div className="flex items-center">
                                          <span className="text-gray-400">Completed on:</span>
                                        </div>
                                        <div className="text-xs">{formatDate(progress.completion_date)}</div>
                                      </>
                                    )}
                                  </div>
                                  
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        progress.status === 'completed' ? 'bg-green-500' :
                                        progress.status === 'in_progress' ? 'bg-blue-500' :
                                        'bg-gray-500'
                                      }`} 
                                      style={{ width: `${progress.progress_percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400">No progress recorded yet</div>
                              )}
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="font-medium mb-3">Update Progress</h3>
                              <div className="space-y-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full bg-gray-500/10 hover:bg-gray-500/20"
                                  onClick={() => updateProgress(item.id, 'not_started', 0)}
                                  disabled={isLoading}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Mark as Not Started (0%)
                                </Button>
                                
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                                  onClick={() => updateProgress(item.id, 'in_progress', 50)}
                                  disabled={isLoading}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Mark as In Progress (50%)
                                </Button>
                                
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400"
                                  onClick={() => updateProgress(item.id, 'completed', 100)}
                                  disabled={isLoading}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Completed (100%)
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="p-4 mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                            <div className="flex items-start">
                              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium text-yellow-400">Authentication Required</p>
                                <p className="text-sm mt-1">
                                  You need to be logged in to track your learning progress.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Select a learning item from the list to view details and update progress
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 