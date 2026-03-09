-- Create required tables for learning path functionality

-- Learning paths
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Learning modules
CREATE TABLE IF NOT EXISTS public.learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  estimated_time_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Learning items (content within modules)
CREATE TABLE IF NOT EXISTS public.learning_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('article', 'video', 'quiz', 'exercise')),
  content TEXT,
  order_index INTEGER NOT NULL,
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Enable Row Level Security on all tables
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- Create security policies for learning paths
DROP POLICY IF EXISTS "Anyone can view learning paths" ON public.learning_paths;
CREATE POLICY "Anyone can view learning paths"
  ON public.learning_paths
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage learning paths" ON public.learning_paths;
CREATE POLICY "Anyone can manage learning paths"
  ON public.learning_paths
  FOR ALL
  USING (true);

-- Create security policies for learning modules
DROP POLICY IF EXISTS "Anyone can view learning modules" ON public.learning_modules;
CREATE POLICY "Anyone can view learning modules"
  ON public.learning_modules
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage learning modules" ON public.learning_modules;
CREATE POLICY "Anyone can manage learning modules"
  ON public.learning_modules
  FOR ALL
  USING (true);

-- Create security policies for learning items
DROP POLICY IF EXISTS "Anyone can view learning items" ON public.learning_items;
CREATE POLICY "Anyone can view learning items"
  ON public.learning_items
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage learning items" ON public.learning_items;
CREATE POLICY "Anyone can manage learning items"
  ON public.learning_items
  FOR ALL
  USING (true);

-- Create security policies for learning progress
DROP POLICY IF EXISTS "Users can view their own progress" ON public.learning_progress;
CREATE POLICY "Users can view their own progress"
  ON public.learning_progress
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own progress" ON public.learning_progress;
CREATE POLICY "Users can manage their own progress"
  ON public.learning_progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample data for testing
INSERT INTO public.learning_paths (title, description, difficulty, tags)
VALUES 
  ('Introduction to Algorithms', 'Learn the basics of algorithms and data structures', 'beginner', ARRAY['algorithms', 'data structures']),
  ('Competitive Programming 101', 'Get started with competitive programming', 'beginner', ARRAY['competitive', 'codeforces'])
ON CONFLICT DO NOTHING;

-- Insert sample modules
WITH path_ids AS (
  SELECT id FROM public.learning_paths WHERE title IN ('Introduction to Algorithms', 'Competitive Programming 101')
)
INSERT INTO public.learning_modules (path_id, title, description, order_index, estimated_time_minutes)
VALUES 
  ((SELECT id FROM path_ids LIMIT 1 OFFSET 0), 'Big O Notation', 'Understanding time and space complexity', 1, 30),
  ((SELECT id FROM path_ids LIMIT 1 OFFSET 0), 'Basic Data Structures', 'Arrays, linked lists, stacks, and queues', 2, 45),
  ((SELECT id FROM path_ids LIMIT 1 OFFSET 1), 'Getting Started with Codeforces', 'How to use Codeforces platform', 1, 20)
ON CONFLICT DO NOTHING;

-- Insert sample learning items
WITH module_ids AS (
  SELECT id FROM public.learning_modules ORDER BY created_at LIMIT 3
)
INSERT INTO public.learning_items (module_id, title, type, content, order_index)
VALUES 
  ((SELECT id FROM module_ids LIMIT 1 OFFSET 0), 'What is Big O?', 'article', 'Big O notation is used to describe the performance of an algorithm...', 1),
  ((SELECT id FROM module_ids LIMIT 1 OFFSET 0), 'Time Complexity Quiz', 'quiz', 'Test your knowledge of time complexity analysis', 2),
  ((SELECT id FROM module_ids LIMIT 1 OFFSET 1), 'Arrays vs Linked Lists', 'article', 'Understanding the differences between arrays and linked lists...', 1),
  ((SELECT id FROM module_ids LIMIT 1 OFFSET 2), 'Creating a Codeforces Account', 'article', 'Step-by-step guide to creating a Codeforces account', 1)
ON CONFLICT DO NOTHING;

-- Add is_admin column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false; 