import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()
    const { pathId, topicId, subtopicId } = body
    
    // Get user from server-side auth using the correct pattern
    const supabaseServer = createRouteHandlerClient({ cookies: () => cookies() })
    const { data: { session } } = await supabaseServer.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    
    // Required fields validation
    if (!pathId || !topicId) {
      return NextResponse.json(
        { error: 'Path ID and Topic ID are required' },
        { status: 400 }
      )
    }
    
    // Query to check if entry exists
    const { data, error } = await supabase
      .from('learning_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('path_id', pathId)
      .eq('topic_id', topicId)
      .eq('subtopic_id', subtopicId || null)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "Results contain 0 rows"
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ id: data?.id || null })
  } catch (err) {
    console.error('Error checking learning progress:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 