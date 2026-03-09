import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;
    
    // Create a Supabase client with the cookies
    const supabase = createRouteHandlerClient({ cookies });
    
    if (code) {
        await supabase.auth.exchangeCodeForSession(code);
    }
    
    // After successful authentication, redirect to home page
    return NextResponse.redirect(new URL('/', origin));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
    );
  }
}