
-- Add unique constraint to self_exploration_results table
-- This allows us to use ON CONFLICT in INSERT statements
ALTER TABLE self_exploration_results 
ADD CONSTRAINT unique_user_quest_result 
UNIQUE (user_id, quest_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_self_exploration_results_user_quest 
ON self_exploration_results(user_id, quest_id);
