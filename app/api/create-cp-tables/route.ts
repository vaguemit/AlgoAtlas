import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Initialize Supabase client with the correct pattern
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });
    
    // Create CodeForces profiles table
    const createCodeforcesTableQuery = `
      CREATE TABLE IF NOT EXISTS codeforces_profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        handle TEXT NOT NULL,
        rating INTEGER,
        max_rating INTEGER,
        rank TEXT,
        max_rank TEXT,
        contribution INTEGER,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE codeforces_profiles ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view any Codeforces profile"
        ON codeforces_profiles FOR SELECT
        USING (true);
      
      CREATE POLICY "Users can update own Codeforces profile"
        ON codeforces_profiles FOR UPDATE
        USING (auth.uid() = id);
      
      CREATE POLICY "Users can insert own Codeforces profile"
        ON codeforces_profiles FOR INSERT
        WITH CHECK (auth.uid() = id);
    `;
    
    // Create CodeChef profiles table
    const createCodechefTableQuery = `
      CREATE TABLE IF NOT EXISTS codechef_profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        handle TEXT NOT NULL,
        rating INTEGER,
        max_rating INTEGER,
        stars TEXT,
        country_rank INTEGER,
        global_rank INTEGER,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE codechef_profiles ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view any CodeChef profile"
        ON codechef_profiles FOR SELECT
        USING (true);
      
      CREATE POLICY "Users can update own CodeChef profile"
        ON codechef_profiles FOR UPDATE
        USING (auth.uid() = id);
      
      CREATE POLICY "Users can insert own CodeChef profile"
        ON codechef_profiles FOR INSERT
        WITH CHECK (auth.uid() = id);
    `;
    
    // Create Rating History table for storing rating changes over time
    const createRatingHistoryTableQuery = `
      CREATE TABLE IF NOT EXISTS rating_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        platform TEXT NOT NULL CHECK (platform IN ('codeforces', 'codechef')),
        rating INTEGER NOT NULL,
        contest_name TEXT,
        contest_id TEXT,
        rank INTEGER,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        
        UNIQUE(user_id, platform, contest_id)
      );
      
      ALTER TABLE rating_history ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view any rating history"
        ON rating_history FOR SELECT
        USING (true);
      
      CREATE POLICY "Users can update own rating history"
        ON rating_history FOR UPDATE
        USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can insert own rating history"
        ON rating_history FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    `;
    
    // Execute the queries
    const { error: cfError } = await supabase.rpc('exec_sql', { query: createCodeforcesTableQuery });
    if (cfError) {
      console.error('Error creating Codeforces table:', cfError);
      // Try alternative method if the RPC doesn't exist
      try {
        await supabase.from('codeforces_profiles').select('id').limit(1);
      } catch (e) {
        // Table doesn't exist, but we can't create it without proper access
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to create Codeforces table. Please run the SQL directly in Supabase dashboard.' 
        }, { status: 500 });
      }
    }
    
    const { error: ccError } = await supabase.rpc('exec_sql', { query: createCodechefTableQuery });
    if (ccError) {
      console.error('Error creating CodeChef table:', ccError);
      // Check if table exists
      try {
        await supabase.from('codechef_profiles').select('id').limit(1);
      } catch (e) {
        // Table doesn't exist
        return NextResponse.json({
          success: false,
          error: 'Failed to create CodeChef table. Please run the SQL directly in Supabase dashboard.'
        }, { status: 500 });
      }
    }
    
    const { error: rhError } = await supabase.rpc('exec_sql', { query: createRatingHistoryTableQuery });
    if (rhError) {
      console.error('Error creating Rating History table:', rhError);
      // Check if table exists
      try {
        await supabase.from('rating_history').select('id').limit(1);
      } catch (e) {
        // Table doesn't exist
        return NextResponse.json({
          success: false,
          error: 'Failed to create Rating History table. Please run the SQL directly in Supabase dashboard.'
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Competitive programming tables setup completed successfully' 
    });
    
  } catch (error: any) {
    console.error('Error setting up CP tables:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 