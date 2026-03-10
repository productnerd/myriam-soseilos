
-- Create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    thumbnail TEXT,
    email TEXT,
    grey_points INTEGER DEFAULT 0,
    dark_points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    poll_sharing BOOLEAN DEFAULT true,
    score_sharing BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies to the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Allow service role to manage all profiles
CREATE POLICY "Service role can do anything with profiles"
ON public.profiles
USING (auth.jwt()->>'role' = 'service_role');

-- Allow new users to insert their profile
CREATE POLICY "New users can insert their profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Fix for the "user_sidequests" error by creating the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_sidequests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sidequest_id UUID, -- Reference to your sidequest table
    status TEXT DEFAULT 'not_started',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_sidequests
ALTER TABLE public.user_sidequests ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own sidequests
CREATE POLICY "Users can view their own sidequests"
ON public.user_sidequests
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to update their own sidequests
CREATE POLICY "Users can update their own sidequests"
ON public.user_sidequests
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow service role to manage all sidequests
CREATE POLICY "Service role can do anything with user_sidequests"
ON public.user_sidequests
USING (auth.jwt()->>'role' = 'service_role');

-- Allow users to insert their own sidequests
CREATE POLICY "Users can insert their own sidequests"
ON public.user_sidequests
FOR INSERT
WITH CHECK (auth.uid() = user_id);
