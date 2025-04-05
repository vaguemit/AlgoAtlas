import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // First check if the table already exists
    const { error: checkError } = await supabase
      .from('test_entries')
      .select('id')
      .limit(1)
    
    // If no error, the table exists
    if (!checkError) {
      return NextResponse.json({
        status: 'success',
        message: 'The test_entries table already exists.',
        timestamp: new Date().toISOString()
      })
    }
    
    // If the error code is not a missing table error, return that error
    if (checkError.code !== '42P01') {
      throw new Error(`Unexpected error checking table: ${checkError.message}`)
    }
    
    // Table doesn't exist, so create it
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.test_entries (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at timestamp with time zone DEFAULT now(),
        message text
      );
      
      -- Add RLS policies
      ALTER TABLE public.test_entries ENABLE ROW LEVEL SECURITY;
      
      -- Allow anonymous and authenticated users to read all entries
      CREATE POLICY "Anyone can read test_entries" ON public.test_entries
        FOR SELECT USING (true);
        
      -- Allow authenticated users to insert their own entries
      CREATE POLICY "Authenticated users can insert test_entries" ON public.test_entries
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    `
    
    const { error: createError } = await supabase.rpc('exec', { query: createTableQuery })
    
    if (createError) {
      // Try a simpler approach if the RPC doesn't work
      try {
        // Just create the table without RLS for testing
        const simpleCreateQuery = `
          CREATE TABLE IF NOT EXISTS public.test_entries (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            created_at timestamp with time zone DEFAULT now(),
            message text
          );
        `
        
        await supabase.rpc('exec', { query: simpleCreateQuery })
        
        return NextResponse.json({
          status: 'success',
          message: 'Created test_entries table with limited permissions (no RLS).',
          timestamp: new Date().toISOString()
        })
      } catch (simpleFallbackError: any) {
        throw new Error(`Failed to create table: ${createError.message}. Simple fallback also failed: ${simpleFallbackError.message}`)
      }
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Created test_entries table successfully with appropriate permissions.',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Error creating test table:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create test table',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 