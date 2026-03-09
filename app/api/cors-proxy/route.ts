import { NextRequest, NextResponse } from 'next/server';

// Allowlisted domains for CORS proxy
const ALLOWED_DOMAINS = [
  'codeforces.com',
  'api.codeforces.com',
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Validate URL to prevent SSRF
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return NextResponse.json({ error: 'Only HTTP(S) URLs are allowed' }, { status: 400 });
  }

  if (!ALLOWED_DOMAINS.some(domain => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith('.' + domain))) {
    return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
  }
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('CORS proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch from the provided URL' },
      { status: 500 }
    );
  }
} 