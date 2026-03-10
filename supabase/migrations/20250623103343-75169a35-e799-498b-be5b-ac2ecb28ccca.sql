
-- Let's check all active sidequests to see what's available
SELECT 
    s.id,
    s.title,
    s.status,
    s.grey_unlock,
    s.dark_token_reward,
    s.grey_token_reward,
    s.topic_id,
    t.title as topic_title
FROM sidequests s
LEFT JOIN topics t ON s.topic_id = t.id
WHERE s.status = 'ACTIVE'
ORDER BY s.title;

-- Also check self-exploration quests
SELECT 
    seq.id,
    seq.title,
    seq.status,
    seq.grey_unlock,
    seq.dark_token_reward,
    seq.grey_token_reward,
    seq.topic_id,
    t.title as topic_title
FROM self_exploration_quests seq
LEFT JOIN topics t ON seq.topic_id = t.id
WHERE seq.status = 'ACTIVE'
ORDER BY seq.title;

-- Check what the current user's grey points are
SELECT 
    id,
    email,
    grey_points,
    dark_points
FROM profiles
ORDER BY created_at DESC
LIMIT 5;
