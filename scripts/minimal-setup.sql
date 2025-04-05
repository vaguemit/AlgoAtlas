-- Minimal Supabase setup script
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
  USING (true);

-- Simple function for diagnostics
CREATE OR REPLACE FUNCTION public.test_connection_check()
RETURNS TEXT AS $$
BEGIN
  RETURN 'Database connection is working!';
END;
$$ LANGUAGE plpgsql; 