import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  // Get environment variables directly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  // Check if environment variables are set
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      status: 'error',
      message: 'Missing Supabase environment variables',
      details: {
        urlSet: !!supabaseUrl,
        keySet: !!supabaseKey
      }
    }, { status: 400 })
  }
  
  try {
    // Create a new Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Try a very simple query that should work even with no setup
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey
      }
    })
    
    // Check if the connection worked
    if (response.ok) {
      // Try to get the test_connection table if it exists
      const { data, error } = await supabase
        .from('test_connection')
        .select('*')
        .limit(1)
        .maybeSingle()
      
      // Return success
      return NextResponse.json({
        status: 'success',
        message: 'Connected to Supabase successfully',
        rawConnection: 'working',
        testTableExists: !error,
        testData: data || null,
        testError: error ? error.message : null,
        env: {
          url: supabaseUrl.substring(0, 10) + '...' + supabaseUrl.substring(supabaseUrl.length - 5),
          keyLength: supabaseKey.length
        }
      })
    } else {
      // Return error with status
      return NextResponse.json({
        status: 'error',
        message: 'Connection to Supabase failed',
        statusCode: response.status,
        statusText: response.statusText,
        env: {
          url: supabaseUrl.substring(0, 10) + '...',
          keyLength: supabaseKey.length
        }
      }, { status: 500 })
    }
  } catch (error: any) {
    // Return any unexpected error
    return NextResponse.json({
      status: 'error',
      message: 'Error connecting to Supabase',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
} 