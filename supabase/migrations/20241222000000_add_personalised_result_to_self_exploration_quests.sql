
-- Add personalised_result column to self_exploration_quests table
ALTER TABLE self_exploration_quests 
ADD COLUMN personalised_result text;

-- Add comment for documentation
COMMENT ON COLUMN self_exploration_quests.personalised_result IS 'Description of the personalised result the user will get by completing this quest (e.g., personalised nutrition plan, personality assessment)';
