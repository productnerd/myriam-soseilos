
-- Add foreign key relationship between self_exploration_quests and topics
ALTER TABLE self_exploration_quests 
ADD CONSTRAINT fk_self_exploration_quests_topic 
FOREIGN KEY (topic_id) REFERENCES topics(id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_self_exploration_quests_topic_id 
ON self_exploration_quests(topic_id);
