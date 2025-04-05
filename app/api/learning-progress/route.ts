import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET: Fetch learning progress for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pathId = searchParams.get('pathId');
    
    if (!pathId) {
      return NextResponse.json({ error: 'Path ID is required' }, { status: 400 });
    }

    // Create Supabase client with the correct Next.js App Router pattern
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Return empty data instead of error when not authenticated
      return NextResponse.json({ 
        items: [], 
        completion: 0,
        authenticated: false
      });
    }
    
    const userId = session.user.id;
    
    // Get all progress entries for this path
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('path_id', pathId);
    
    if (error) {
      console.error('Error fetching learning progress:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Calculate overall completion percentage
    const { data: completionData, error: completionError } = await supabase
      .rpc('calculate_path_completion', { p_user_id: userId, p_path_id: pathId });
    
    if (completionError) {
      console.error('Error calculating completion:', completionError);
      return NextResponse.json({ 
        items: data,
        completion: 0,
        error: 'Failed to calculate completion'
      });
    }
    
    return NextResponse.json({ 
      items: data, 
      completion: completionData || 0,
      authenticated: true
    });
    
  } catch (error) {
    console.error('Error in GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Update learning progress
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pathId, topicId, subtopicId, status } = body;
    
    // Validate required fields
    if (!pathId || !status) {
      return NextResponse.json({ error: 'Path ID and status are required' }, { status: 400 });
    }
    
    // Validate status
    const validStatuses = ['not-started', 'reading', 'practicing', 'complete', 'skipped', 'ignored'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    
    // Create Supabase client with the correct Next.js App Router pattern
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Upsert the progress (insert if not exists, update if exists)
    const { data, error } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: userId,
        path_id: pathId,
        topic_id: topicId || null,
        subtopic_id: subtopicId || null,
        status,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'user_id, path_id, topic_id, subtopic_id'
      });
    
    if (error) {
      console.error('Error updating learning progress:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Calculate the new completion percentage
    const { data: completionData, error: completionError } = await supabase
      .rpc('calculate_path_completion', { p_user_id: userId, p_path_id: pathId });
    
    if (completionError) {
      console.error('Error calculating completion:', completionError);
      return NextResponse.json({ 
        success: true, 
        completion: 0,
        error: 'Failed to calculate completion'
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      completion: completionData || 0
    });
    
  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 