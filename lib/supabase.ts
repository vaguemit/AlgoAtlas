import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
});

// Database types
export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CodeforcesProfile = {
  id: string;
  handle: string;
  rating: number | null;
  max_rating: number | null;
  rank: string | null;
  max_rank: string | null;
  contribution: number | null;
  last_updated: string;
};

export type GymLevel = {
  id: string;
  current_level: number;
  total_solved: number;
  last_updated: string;
};

export type LearningProgress = {
  id: string;
  user_id: string;
  path_id: string;
  topic_id: string;
  subtopic_id: string;
  status: 'not-started' | 'reading' | 'practicing' | 'complete' | 'skipped' | 'ignored';
  last_updated: string;
};