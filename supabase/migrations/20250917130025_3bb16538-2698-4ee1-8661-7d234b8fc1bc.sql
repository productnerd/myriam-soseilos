-- Fix RLS issues by enabling RLS on tables without it
-- This addresses the "RLS Disabled in Public" errors

-- Enable RLS on skill_vote_counts table
ALTER TABLE public.skill_vote_counts ENABLE ROW LEVEL SECURITY;

-- Add policy for skill_vote_counts - allow public read access since this is aggregated data
CREATE POLICY "Allow public read access to skill vote counts" ON public.skill_vote_counts
FOR SELECT USING (true);

-- Enable RLS on quest_conditions table  
ALTER TABLE public.quest_conditions ENABLE ROW LEVEL SECURITY;

-- Add policy for quest_conditions - allow authenticated users to read quest conditions
CREATE POLICY "Allow authenticated users to read quest conditions" ON public.quest_conditions
FOR SELECT USING (auth.role() = 'authenticated');