-- AlgoAtlas Supabase Database Setup
-- This script creates all necessary tables and functions for the AlgoAtlas application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create utility function for executing dynamic SQL
CREATE OR REPLACE FUNCTION public.exec(query text) 
RETURNS void AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================================
-- Core Tables
-- ======================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  bio TEXT,
  is_admin BOOLEAN DEFAULT false
);

-- Create RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view any profile
CREATE POLICY "Anyone can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ======================================================
-- Competitive Programming Platform Profiles
-- ======================================================

-- Codeforces profiles
CREATE TABLE IF NOT EXISTS public.codeforces_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  handle TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_fetched TIMESTAMP WITH TIME ZONE,
  current_rating INTEGER,
  max_rating INTEGER,
  UNIQUE(user_id, handle)
);

-- Create RLS policies for codeforces_profiles
ALTER TABLE public.codeforces_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view codeforces profiles
CREATE POLICY "Anyone can view codeforces profiles"
  ON public.codeforces_profiles
  FOR SELECT
  USING (true);

-- Allow users to insert/update/delete their own codeforces profiles
CREATE POLICY "Users can manage their own codeforces profiles"
  ON public.codeforces_profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Codechef profiles
CREATE TABLE IF NOT EXISTS public.codechef_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  handle TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_fetched TIMESTAMP WITH TIME ZONE,
  current_rating INTEGER,
  max_rating INTEGER,
  UNIQUE(user_id, handle)
);

-- Create RLS policies for codechef_profiles
ALTER TABLE public.codechef_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view codechef profiles
CREATE POLICY "Anyone can view codechef profiles"
  ON public.codechef_profiles
  FOR SELECT
  USING (true);

-- Allow users to insert/update/delete their own codechef profiles
CREATE POLICY "Users can manage their own codechef profiles"
  ON public.codechef_profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ======================================================
-- Rating History
-- ======================================================

CREATE TABLE IF NOT EXISTS public.rating_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL,
  platform TEXT NOT NULL, -- 'codeforces', 'codechef', etc.
  contest_id TEXT,
  contest_name TEXT,
  contest_date TIMESTAMP WITH TIME ZONE,
  rating INTEGER,
  rank INTEGER,
  rating_change INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(profile_id, platform, contest_id)
);

-- Create RLS policies for rating_history
ALTER TABLE public.rating_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view rating history
CREATE POLICY "Anyone can view rating history"
  ON public.rating_history
  FOR SELECT
  USING (true);

-- Allow admins to manage all rating history
CREATE POLICY "Admins can manage all rating history"
  ON public.rating_history
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ======================================================
-- Learning Path System
-- ======================================================

-- Learning paths
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create RLS policies for learning_paths
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view learning paths
CREATE POLICY "Anyone can view learning paths"
  ON public.learning_paths
  FOR SELECT
  USING (true);

-- Allow admins to manage learning paths
CREATE POLICY "Admins can manage learning paths"
  ON public.learning_paths
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Learning modules
CREATE TABLE IF NOT EXISTS public.learning_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  estimated_time_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for learning_modules
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view learning modules
CREATE POLICY "Anyone can view learning modules"
  ON public.learning_modules
  FOR SELECT
  USING (true);

-- Allow admins to manage learning modules
CREATE POLICY "Admins can manage learning modules"
  ON public.learning_modules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Learning items (content within modules)
CREATE TABLE IF NOT EXISTS public.learning_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('article', 'video', 'quiz', 'exercise')),
  content TEXT,
  order_index INTEGER NOT NULL,
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for learning_items
ALTER TABLE public.learning_items ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view learning items
CREATE POLICY "Anyone can view learning items"
  ON public.learning_items
  FOR SELECT
  USING (true);

-- Allow admins to manage learning items
CREATE POLICY "Admins can manage learning items"
  ON public.learning_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- User progress tracking
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.learning_items(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage INTEGER CHECK (progress_percentage BETWEEN 0 AND 100),
  last_accessed TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Create RLS policies for learning_progress
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own progress
CREATE POLICY "Users can view their own progress"
  ON public.learning_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to manage their own progress
CREATE POLICY "Users can manage their own progress"
  ON public.learning_progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ======================================================
-- Test Tables for Diagnostics
-- ======================================================

-- Create test table function for diagnostics
CREATE OR REPLACE FUNCTION public.create_test_entries_table() 
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.test_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    message TEXT
  );
  
  -- Add RLS policies
  ALTER TABLE public.test_entries ENABLE ROW LEVEL SECURITY;
  
  -- Allow anonymous and authenticated users to read all entries
  DROP POLICY IF EXISTS "Anyone can read test_entries" ON public.test_entries;
  CREATE POLICY "Anyone can read test_entries" ON public.test_entries
    FOR SELECT USING (true);
    
  -- Allow authenticated users to insert their own entries
  DROP POLICY IF EXISTS "Authenticated users can insert test_entries" ON public.test_entries;
  CREATE POLICY "Authenticated users can insert test_entries" ON public.test_entries
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create test entries table
SELECT public.create_test_entries_table();

-- ======================================================
-- Function to create database/trigger profile on signup
-- ======================================================

-- automatically create a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 