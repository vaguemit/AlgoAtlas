import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const authHeader = headersList.get('authorization');
    
    // Verify the webhook is coming from onlinecompiler.io
    if (authHeader !== `Bearer ${process.env.ONLINECOMPILER_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    // Store the result in a database or cache for the frontend to fetch
    // For now, we'll just return the result
    return NextResponse.json({ 
      success: true,
      result: data 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 