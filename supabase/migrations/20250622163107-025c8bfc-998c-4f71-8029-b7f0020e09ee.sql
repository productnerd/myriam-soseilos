
-- First, fix existing negative completion counts
UPDATE sidequests 
SET completion_count = 0 
WHERE completion_count < 0;

UPDATE self_exploration_quests 
SET completion_count = 0 
WHERE completion_count < 0;

-- Add constraints to prevent negative completion counts
ALTER TABLE sidequests 
ADD CONSTRAINT sidequests_completion_count_non_negative 
CHECK (completion_count >= 0);

ALTER TABLE self_exploration_quests 
ADD CONSTRAINT self_exploration_quests_completion_count_non_negative 
CHECK (completion_count >= 0);

-- Check for functions that might be causing negative completion counts
-- This query will help identify any functions that update completion_count
SELECT 
    proname as function_name,
    prosrc as function_body
FROM pg_proc 
WHERE prosrc ILIKE '%completion_count%' 
   OR prosrc ILIKE '%completion count%';
