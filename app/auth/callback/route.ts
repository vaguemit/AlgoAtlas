import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the request URL and code parameter
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  try {
    // Create a Supabase client for server-side
    const supabase = createRouteHandlerClient({ cookies });
    
    // If we have a code, exchange it for a session
    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
    }
    
    // Redirect back to the home page
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    // If there's an error, redirect to login with error
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
    );
  }
} 