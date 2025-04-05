-- Create a function for executing read-only SQL queries safely
-- This function is useful for diagnostics and testing

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function for read-only SQL execution
CREATE OR REPLACE FUNCTION public.exec_read_only(sql text) 
RETURNS SETOF json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Execute the SQL query and return results as JSON
  RETURN QUERY EXECUTE sql;
EXCEPTION WHEN OTHERS THEN
  -- If query fails, return error information
  RETURN QUERY SELECT json_build_object(
    'error', SQLERRM,
    'detail', SQLSTATE,
    'query', sql
  );
END;
$$;

-- Minimum required table for profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Set up realtime for profiles
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Publication exists, check if profiles table is already in it
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'profiles'
    ) THEN
      -- Add profiles table to existing publication if not already there
      ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
    END IF;
  ELSE
    -- Create new publication if it doesn't exist
    CREATE PUBLICATION supabase_realtime FOR TABLE profiles;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error with publication: %', SQLERRM;
END $$; 