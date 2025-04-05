import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface TableInfo {
  table_name: string;
}

export async function GET() {
  let status = 'success'
  let message = 'Database connection successful'
  let profilesCount = 0
  let profilesError = null
  let tables: TableInfo[] = []
  let tablesError = null

  // Try a simple query to check profiles table
  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .limit(0)
    
    if (error) {
      throw error
    }
    
    profilesCount = count || 0
  } catch (err: any) {
    profilesError = err.message || 'Failed to query profiles table'
    
    // If we failed, we still want to try to get tables
    status = 'error'
    message = 'Error querying profiles table'
  }

  // Get list of tables using a raw query
  try {
    const { data, error } = await supabase.rpc('get_all_tables')
    
    if (error) {
      throw error
    }
    
    tables = data as TableInfo[] || []
  } catch (err: any) {
    // Try another approach if the RPC fails
    try {
      // Direct query to information_schema (not in public schema)
      const { data, error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
      
      if (error) {
        throw error
      }
      
      // Map pg_tables format to our table_name format
      tables = (data || []).map(row => ({ table_name: row.tablename })) as TableInfo[]
    } catch (pgErr: any) {
      tablesError = `${err.message}. Then tried pg_tables: ${pgErr.message}`
      
      // This is a more serious error if we can't even get the schema
      status = 'error'
      message = 'Error connecting to database'
    }
  }

  return NextResponse.json({
    status,
    message,
    profilesCount,
    profilesError,
    tables,
    tablesError,
    timestamp: new Date().toISOString()
  })
} 