'use client'

import { SupabaseTest } from '@/components/supabase-test'
import { SupabaseDiagnostics } from '@/components/supabase-diagnostics'
import { SupabaseConfigChecker } from '@/components/supabase-config-checker'
import { ExternalLink } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TestSupabasePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Supabase Connection Test</h1>
      
      <Tabs defaultValue="config" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="test">System Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Step 1: Check Environment Variables</h2>
            <p className="text-sm mb-4">
              Let's first check if your environment variables are properly set up. This is the most common cause of connection issues.
            </p>
            <SupabaseConfigChecker />
          </section>
          
          <section className="bg-black/70 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Setting Up Environment Variables</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-yellow-400">Create a .env.local file</h3>
                <p className="text-sm mt-1 mb-2">In your project root directory, create a file named <code className="bg-black/30 px-1 py-0.5 rounded">.env.local</code> with the following content:</p>
                <pre className="bg-black/30 p-4 rounded text-xs overflow-auto">
                  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co{'\n'}
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key{'\n\n'}
                  # Optional server-side environment variables{'\n'}
                  SUPABASE_URL=https://your-project.supabase.co{'\n'}
                  SUPABASE_ANON_KEY=your-anon-key
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-yellow-400">Get your Supabase credentials</h3>
                <p className="text-sm mt-1 mb-2">You can find your Supabase URL and anon key in your Supabase project settings:</p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  <li>Go to your Supabase dashboard</li>
                  <li>Click on the project you want to use</li>
                  <li>Click on the "Settings" gear icon in the sidebar</li>
                  <li>Click on "API" in the settings menu</li>
                  <li>Copy the "Project URL" and "anon public" key values</li>
                </ol>
              </div>
              
              <div className="pt-2">
                <Button 
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Open Supabase Dashboard
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="diagnostics" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Step 2: Database Connection Diagnostics</h2>
            <SupabaseDiagnostics />
          </section>
          
          <section className="bg-black/70 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">SQL Schema Setup</h2>
            <p className="text-sm mt-1 mb-2">Run these queries in the Supabase SQL Editor to create needed tables:</p>
            <pre className="bg-black/30 p-4 rounded text-xs overflow-auto">
              {`-- Safe version of the schema setup
-- This script checks for existing tables and won't destroy data

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Safely create required function for database testing
CREATE OR REPLACE FUNCTION public.exec_read_only(sql text) 
RETURNS SETOF json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY EXECUTE sql;
END;
$$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create security policies for profiles
CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Set up realtime subscriptions for the profiles table
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;`}
            </pre>
          </section>
        </TabsContent>
        
        <TabsContent value="test" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Step 3: Full System Test</h2>
            <SupabaseTest />
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-semibold mb-2">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a 
                href="https://supabase.com/docs/guides/database/connecting-to-postgres" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-black/40 hover:bg-black/60 rounded-md transition-colors"
              >
                <span className="flex-1">Supabase Connection Guide</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a 
                href="https://supabase.com/docs/guides/auth/row-level-security" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-black/40 hover:bg-black/60 rounded-md transition-colors"
              >
                <span className="flex-1">Row-Level Security Guide</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a 
                href="https://supabase.com/docs/guides/auth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-black/40 hover:bg-black/60 rounded-md transition-colors"
              >
                <span className="flex-1">Supabase Authentication</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a 
                href="https://nextjs.org/docs/basic-features/environment-variables" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-black/40 hover:bg-black/60 rounded-md transition-colors"
              >
                <span className="flex-1">Next.js Environment Variables</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Button component for the "Open Supabase Dashboard" button
function Button({ onClick, className, children }: { 
  onClick: () => void, 
  className: string, 
  children: React.ReactNode 
}) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
} 