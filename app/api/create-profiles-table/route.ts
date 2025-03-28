import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // SQL to create profiles table if it doesn't exist
    const { error } = await supabase.rpc('create_profiles_table_if_not_exists');
    
    if (error) {
      // If the RPC doesn't exist, create the table directly
      const { error: createError } = await supabase.from('profiles').select('id').limit(1);
      
      if (createError && createError.code === '42P01') { // Table doesn't exist error
        // Create the table
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
            username TEXT UNIQUE,
            full_name TEXT,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Public profiles are viewable by everyone."
            ON profiles FOR SELECT
            USING (true);
          
          CREATE POLICY "Users can insert their own profile."
            ON profiles FOR INSERT
            WITH CHECK (auth.uid() = id);
          
          CREATE POLICY "Users can update own profile."
            ON profiles FOR UPDATE
            USING (auth.uid() = id);
        `;
        
        const { error: sqlError } = await supabase.rpc('exec_sql', { query: createTableQuery });
        
        if (sqlError) {
          console.error('Error creating profiles table:', sqlError);
          return NextResponse.json({ success: false, error: sqlError.message }, { status: 500 });
        }
        
        return NextResponse.json({ success: true, message: 'Profiles table created successfully' });
      }
      
      if (createError) {
        return NextResponse.json({ success: false, error: createError.message }, { status: 500 });
      }
      
      // Table exists and we could query it
      return NextResponse.json({ success: true, message: 'Profiles table already exists' });
    }
    
    return NextResponse.json({ success: true, message: 'Profiles table setup completed successfully' });
    
  } catch (error: any) {
    console.error('Error setting up profiles table:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 