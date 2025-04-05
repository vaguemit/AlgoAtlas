'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface LearningItem {
  id: string
  title: string
  type: string
  content: string | null
  external_url: string | null
  module_id: string
  module_title: string
}

// Structure of Supabase response
interface SupabaseItemResponse {
  id: string
  title: string
  type: string
  content: string | null
  external_url: string | null
  module_id: string
  learning_modules: {
    title: string
  }
}

export default function LearningPathItemPage({ params }: { params: { id: string, itemId: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<LearningItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    async function fetchItemDetails() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch the item details
        const { data, error } = await supabase
          .from('learning_items')
          .select(`
            id, 
            title, 
            type, 
            content, 
            external_url, 
            module_id, 
            learning_modules(title)
          `)
          .eq('id', params.itemId)
          .single()
          
        if (error) {
          throw error
        }
        
        if (!data) {
          throw new Error('Item not found')
        }
        
        // Cast the response to our expected type
        const itemData = data as unknown as SupabaseItemResponse;
        
        setItem({
          id: itemData.id,
          title: itemData.title,
          type: itemData.type,
          content: itemData.content,
          external_url: itemData.external_url,
          module_id: itemData.module_id,
          module_title: itemData.learning_modules?.title || 'Unknown Module'
        })
      } catch (err) {
        console.error('Error fetching item details:', err)
        setError('Failed to load item details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchItemDetails()
  }, [params.itemId, supabase])
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-6" />
          <p className="text-lg text-white/70">Loading learning content...</p>
        </div>
      </div>
    )
  }
  
  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-black/40 border border-red-500/20 rounded-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Content</h2>
          <p className="text-white/70 mb-6">{error || 'Item not found'}</p>
          <Button asChild>
            <Link href={`/learning-paths/${params.id}`}>Return to Learning Path</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Path navigation */}
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2 text-white/70 hover:text-white">
            <Link href={`/learning-paths/${params.id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Path
            </Link>
          </Button>
          <span className="text-white/50 mx-2">/</span>
          <span className="text-white/70">{item.module_title}</span>
        </div>
        
        {/* Item content */}
        <div className="bg-black/40 border border-purple-500/20 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">{item.title}</h1>
          
          {/* Content based on type */}
          <div className="prose prose-invert max-w-none">
            {item.content ? (
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            ) : item.external_url ? (
              <div>
                <p className="mb-4">This content is available at an external resource:</p>
                <Button asChild className="mb-8">
                  <a href={item.external_url} target="_blank" rel="noopener noreferrer">
                    View Resource
                  </a>
                </Button>
              </div>
            ) : (
              <p className="text-white/70">No content available for this item.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 