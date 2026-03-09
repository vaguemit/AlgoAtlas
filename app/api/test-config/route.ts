import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const serverUrl = process.env.SUPABASE_URL || ''
    const serverKey = process.env.SUPABASE_ANON_KEY || ''
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    // Mask keys for security
    const maskKey = (key: string) => {
      if (!key) return 'Not set'
      if (key.length <= 8) return '********'
      return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
    }
    
    // Return environment information
    return NextResponse.json({
      status: 'success',
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl || 'Not set',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: maskKey(supabaseAnonKey),
        SUPABASE_URL: serverUrl || 'Not set',
        SUPABASE_ANON_KEY: maskKey(serverKey),
        SUPABASE_SERVICE_ROLE_KEY: maskKey(serviceRoleKey)
      },
      // Additional info about the environment
      info: {
        clientUrlSet: !!supabaseUrl,
        clientKeySet: !!supabaseAnonKey,
        clientKeyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
        serverUrlSet: !!serverUrl,
        serverKeySet: !!serverKey,
        serverKeyLength: serverKey ? serverKey.length : 0,
        serviceRoleKeySet: !!serviceRoleKey,
        serviceRoleKeyLength: serviceRoleKey ? serviceRoleKey.length : 0,
        nodeEnv: process.env.NODE_ENV || 'Not set',
        runningEnvironment: process.env.VERCEL ? 'Vercel' : 'Local'
      },
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Error checking configuration',
      error: err.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 