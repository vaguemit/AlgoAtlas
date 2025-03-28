'use client'

import { BasicConnectionTest } from '@/components/basic-connection-test'
import { ExternalLink } from 'lucide-react'

export default function SimpleTestPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Supabase Simple Connection Test</h1>
      <p className="text-center mb-8 text-sm text-gray-400">
        A simplified test to verify your Supabase connection with minimal requirements
      </p>
      
      <div className="space-y-8">
        <BasicConnectionTest />
        
        <div className="bg-black/70 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Minimal SQL Setup</h2>
          <p className="text-sm mb-2">
            Run this minimal SQL script in your Supabase SQL Editor to create a basic test table:
          </p>
          <pre className="bg-black/30 p-4 rounded text-xs overflow-auto">
{`-- Minimal Supabase setup script
-- Only creates the bare essentials needed for testing

-- Create a simple test table that doesn't rely on auth or any other tables
CREATE TABLE IF NOT EXISTS public.test_connection (
  id SERIAL PRIMARY KEY,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add a test record
INSERT INTO public.test_connection (message)
VALUES ('Connection successful!')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security but with a policy that allows public access
ALTER TABLE public.test_connection ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anonymous access to read this table
-- This ensures we can test connections without authentication
CREATE POLICY IF NOT EXISTS "Allow public read access to test_connection"
  ON public.test_connection
  FOR SELECT
  USING (true);`}
          </pre>
        </div>
        
        <div className="bg-black/70 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Setup</h2>
          <p className="text-sm mb-2">
            Create a <code className="bg-black/30 px-1 py-0.5 rounded">.env.local</code> file in your project root with these variables:
          </p>
          <pre className="bg-black/30 p-4 rounded text-xs overflow-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
          
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-blue-400">Where to find these values:</h3>
            <ol className="list-decimal pl-5 text-xs space-y-1">
              <li>Go to the <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Supabase Dashboard</a></li>
              <li>Open your project</li>
              <li>Go to Project Settings → API</li>
              <li>Copy the "Project URL" for NEXT_PUBLIC_SUPABASE_URL</li>
              <li>Copy the "anon public" API key for NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ol>
            
            <div className="mt-4">
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-fit"
              >
                Open Supabase Dashboard
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 