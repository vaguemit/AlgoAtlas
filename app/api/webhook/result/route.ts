import { NextResponse } from 'next/server';

// Simple in-memory store for results
// In a production environment, you should use a proper database
const resultStore = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const resultId = data.id || Date.now().toString();
    
    resultStore.set(resultId, data);
    
    return NextResponse.json({ 
      success: true,
      id: resultId
    });
  } catch (error) {
    console.error('Error storing result:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Missing result ID' 
      }, { status: 400 });
    }
    
    const result = resultStore.get(id);
    
    if (!result) {
      return NextResponse.json({ 
        error: 'Result not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error retrieving result:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 