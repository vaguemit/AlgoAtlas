import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Initialize Supabase client with the correct pattern
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });
    
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
        
        // Also create a trigger to automatically create a profile for new users
        const createTriggerQuery = `
          -- Create function to handle new user creation
          CREATE OR REPLACE FUNCTION public.handle_new_user() 
          RETURNS TRIGGER AS $$
          BEGIN
            INSERT INTO public.profiles (id, username, full_name, avatar_url)
            VALUES (
              NEW.id, 
              LOWER(SPLIT_PART(NEW.email, '@', 1)), -- Default username from email
              '', -- Empty full name
              '' -- Empty avatar url
            );
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
          
          -- Create trigger on auth.users table
          DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
          CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        `;
        
        const { error: triggerError } = await supabase.rpc('exec_sql', { query: createTriggerQuery });
        
        if (triggerError) {
          console.error('Error creating user trigger:', triggerError);
          return NextResponse.json({ success: false, error: triggerError.message }, { status: 500 });
        }
      } else if (createError) {
        // Some other error occurred
        console.error('Error checking profiles table:', createError);
        return NextResponse.json({ success: false, error: createError.message }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profiles table and user trigger created or already exists'
    });
    
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 