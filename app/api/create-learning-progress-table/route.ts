import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Initialize Supabase client with the correct pattern
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });
    
    // Create learning_progress table to track user progress on learning paths
    const createLearningProgressTableQuery = `
      CREATE TABLE IF NOT EXISTS learning_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        path_id TEXT NOT NULL,
        topic_id TEXT,
        subtopic_id TEXT,
        status TEXT NOT NULL CHECK (status IN ('not-started', 'reading', 'practicing', 'complete', 'skipped', 'ignored')),
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Create a unique constraint to prevent duplicate entries
        UNIQUE(user_id, path_id, topic_id, subtopic_id)
      );
      
      ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
      
      -- Create policies for security
      CREATE POLICY "Users can view their own learning progress"
        ON learning_progress FOR SELECT
        USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own learning progress"
        ON learning_progress FOR UPDATE
        USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can insert their own learning progress"
        ON learning_progress FOR INSERT
        WITH CHECK (auth.uid() = user_id);
        
      CREATE POLICY "Users can delete their own learning progress"
        ON learning_progress FOR DELETE
        USING (auth.uid() = user_id);
    `;
    
    // Execute the query
    const { error } = await supabase.rpc('exec_sql', { query: createLearningProgressTableQuery });
    
    if (error) {
      console.error('Error creating learning_progress table:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    // Create functions to calculate learning path completion
    const createFunctionsQuery = `
      -- Function to calculate overall completion percentage for a path
      CREATE OR REPLACE FUNCTION calculate_path_completion(p_user_id UUID, p_path_id TEXT)
      RETURNS NUMERIC AS $$
      DECLARE
        total INT;
        completed INT;
      BEGIN
        -- Get total items (topics and subtopics) for this path
        SELECT COUNT(*) INTO total 
        FROM learning_progress 
        WHERE user_id = p_user_id AND path_id = p_path_id;
        
        -- Get completed items
        SELECT COUNT(*) INTO completed 
        FROM learning_progress 
        WHERE user_id = p_user_id AND path_id = p_path_id AND status = 'complete';
        
        -- Calculate and return percentage
        IF total = 0 THEN
          RETURN 0;
        ELSE
          RETURN ROUND((completed::NUMERIC / total::NUMERIC) * 100);
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Execute the functions query
    const { error: functionsError } = await supabase.rpc('exec_sql', { query: createFunctionsQuery });
    
    if (functionsError) {
      console.error('Error creating functions:', functionsError);
      return NextResponse.json({ success: false, error: functionsError.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Learning progress table and functions created successfully'
    });
    
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 