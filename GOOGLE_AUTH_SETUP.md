# Setting Up Google Authentication with Supabase

This guide will help you configure your Supabase project to work with Google authentication.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project and note your project URL and anon key

## 2. Set Up Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Set the application type to "Web application"
6. Add the following redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback` (replace with your actual Supabase URL)
   - `http://localhost:3000/auth/callback` (for local development)
7. Click "Create" and note your Client ID and Client Secret

## 3. Configure Supabase Auth

1. In your Supabase dashboard, go to "Authentication" > "Providers"
2. Scroll down to "Google" and enable it
3. Enter your Google Client ID and Client Secret
4. **Important**: Make sure "Implicit Grant Flow" is enabled in your OAuth settings

## 4. Configure Your Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```
   cp .env.example .env.local
   ```
2. Update the values in `.env.local` with your actual Supabase URL and anon key:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 5. Create the Required Database Tables

Run the following SQL in the Supabase SQL Editor to create the profiles table:

```sql
-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

-- Create policies
-- Allow public read access
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- Allow authenticated users to update their own profile
create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- Allow authenticated users to insert their own profile
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

-- Set up realtime subscriptions
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table profiles;
```

## 6. Understanding OAuth Flows

There are two main OAuth flows used for authentication:

1. **Authorization Code Flow** - This is the default and more secure flow where a temporary code is exchanged for tokens.
2. **Implicit Flow** - This returns tokens directly in the URL fragment (#). 

The current implementation is designed to handle both flows, but primarily uses the implicit flow because it works more consistently across different browsers and devices.

## 7. Test Your Authentication

1. Start your development server:
   ```
   npm run dev
   ```
2. Navigate to the login page at `http://localhost:3000/login`
3. Click "Continue with Google" and complete the authentication flow

## Troubleshooting

If you encounter issues with the Google authentication:

1. Check your browser console for errors
2. Verify your redirect URIs in the Google Cloud Console
3. Make sure your Supabase project URL and anon key are correct
4. Check the Supabase authentication logs in the dashboard
5. Verify that your environment variables are properly loaded
6. Ensure the OAuth callback route (`app/auth/callback/route.ts`) is properly handling the authentication response
7. If you see a "no_code" error but have a token in the URL fragment, ensure your callback handler is configured to handle implicit flow

### Specific Error: Login redirects with error=no_code but has access_token in URL

If you see a URL like: 
```
/login?error=no_code#access_token=eyJhb...
```

This means:
1. Google OAuth returned a token in the URL fragment (after #)
2. The callback handler couldn't find a code parameter

Solution: The callback has been updated to check for existing sessions when this happens, as the Supabase client automatically processes tokens in URL fragments. Just make sure that in your Supabase settings for Google Auth, you have enabled "Implicit Grant Flow". 