
-- Add prerequisite_sidequest_id column to sidequests table
ALTER TABLE sidequests ADD COLUMN prerequisite_sidequest_id UUID REFERENCES sidequests(id);

-- Set up the prerequisite chain: 11-day → 22-day → 33-day streak quests
-- Update 22 Day Streak to require 11 Day Streak as prerequisite
UPDATE sidequests 
SET prerequisite_sidequest_id = (
    SELECT id FROM sidequests WHERE title = '11 Day Streak' LIMIT 1
)
WHERE title = '22 Day Streak';

-- Update 33 Day Streak to require 22 Day Streak as prerequisite  
UPDATE sidequests 
SET prerequisite_sidequest_id = (
    SELECT id FROM sidequests WHERE title = '22 Day Streak' LIMIT 1
)
WHERE title = '33 Day Streak';

-- Update existing users' quest states based on prerequisites
-- First, set all prerequisite-dependent quests to LOCKED
UPDATE user_sidequests 
SET state = 'LOCKED'
WHERE sidequest_id IN (
    SELECT id FROM sidequests WHERE prerequisite_sidequest_id IS NOT NULL
);

-- Then unlock quests where the prerequisite has been completed
UPDATE user_sidequests us1
SET state = 'LIVE'
WHERE us1.sidequest_id IN (
    SELECT s.id 
    FROM sidequests s 
    WHERE s.prerequisite_sidequest_id IS NOT NULL
) 
AND EXISTS (
    SELECT 1 
    FROM user_sidequests us2 
    JOIN sidequests s ON s.id = us1.sidequest_id
    WHERE us2.user_id = us1.user_id 
    AND us2.sidequest_id = s.prerequisite_sidequest_id 
    AND us2.state = 'COMPLETED'
);
