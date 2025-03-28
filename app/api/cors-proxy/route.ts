import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  
  try {
    // Fetch the data from the external API
    const response = await fetch(url);
    
    // Read the response as text (we'll parse it later if needed)
    const data = await response.json();
    
    // Return the data
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('CORS proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch from the provided URL' },
      { status: 500 }
    );
  }
} 