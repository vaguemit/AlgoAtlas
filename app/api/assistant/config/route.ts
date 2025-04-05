import { NextResponse } from 'next/server';
import * as fs from 'fs';
import path from 'path';

// Types for the configuration request
interface ConfigRequest {
  model: string;
  allowFallback: boolean;
}

// Simple in-memory store for current settings
// In a production environment, this would be stored in a database
export const currentConfig = {
  model: 'llama3-70b-8192',
  allowFallback: true
};

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { model, allowFallback } = await req.json() as ConfigRequest;
    
    // Validate the model parameter
    if (model && typeof model === 'string') {
      if (model !== 'llama3-70b-8192' && model !== 'llama3-8b-8192') {
        return NextResponse.json(
          { error: 'Invalid model. Must be either llama3-70b-8192 or llama3-8b-8192' },
          { status: 400 }
        );
      }
      
      // Update the model
      currentConfig.model = model;
    }
    
    // Validate and update the allowFallback parameter
    if (allowFallback !== undefined && typeof allowFallback === 'boolean') {
      currentConfig.allowFallback = allowFallback;
    }
    
    // Return the updated configuration
    return NextResponse.json({
      success: true,
      config: currentConfig
    });
  } catch (error: any) {
    console.error('Error updating assistant configuration:', error);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating configuration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return the current configuration
    return NextResponse.json({
      success: true,
      config: currentConfig
    });
  } catch (error: any) {
    console.error('Error retrieving assistant configuration:', error);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred while retrieving configuration' },
      { status: 500 }
    );
  }
} 