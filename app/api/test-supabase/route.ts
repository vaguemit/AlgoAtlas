import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Test direct supabase client
    const clientTest = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact', head: true })
    
    // Test server-side client with auth using the correct pattern
    const supabaseServer = createRouteHandlerClient({ cookies: () => cookies() })
    const serverTest = await supabaseServer
      .from('profiles')
      .select('count(*)', { count: 'exact', head: true })
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection test successful',
      direct_client: {
        status: clientTest.error ? 'error' : 'success',
        error: clientTest.error?.message,
        count: clientTest.count
      },
      server_client: {
        status: serverTest.error ? 'error' : 'success',
        error: serverTest.error?.message,
        count: serverTest.count
      },
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Test Supabase API error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Supabase connection test failed',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 