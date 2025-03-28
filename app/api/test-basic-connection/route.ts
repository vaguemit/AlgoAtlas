import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    // Create a fresh Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Get Supabase health check
    const { error: pingError } = await supabase.from('_pgrst_reserved_ping').select('*').limit(1)
    
    // Variables for table data
    let tables = []
    let tablesError = null
    
    try {
      // Basic query to public schema (doesn't require tables to exist)
      const { data, error } = await supabase.rpc('exec_read_only', { 
        sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      })
      
      if (error) {
        tablesError = error.message
      } else {
        tables = data || []
      }
    } catch (err: any) {
      // Fallback to direct query if RPC fails
      try {
        const { data, error } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')
          
        if (error) {
          tablesError = `RPC failed and pg_tables query failed: ${error.message}`
        } else {
          tables = (data || []).map(row => ({ table_name: row.tablename }))
        }
      } catch (innerErr: any) {
        tablesError = `Multiple methods failed: ${innerErr.message}`
      }
    }
    
    // Return connection status and env info
    return NextResponse.json({
      status: 'success',
      connection: pingError ? 'error' : 'success',
      pingError: pingError ? pingError.message : null,
      url: supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'Not set',
      keyProvided: !!supabaseAnonKey,
      keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
      tables,
      tablesError,
      timestamp: new Date().toISOString()
    })
    
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Critical error in connection test',
      error: err.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 