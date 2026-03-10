
-- First, let's see what quests exist that might be the 5000er quest
SELECT 
    id,
    title,
    description,
    status,
    grey_token_reward,
    dark_token_reward,
    topic_id
FROM sidequests 
WHERE status = 'ACTIVE'
AND (
    title ILIKE '%5000%' 
    OR description ILIKE '%5000%'
    OR grey_token_reward = 5000
    OR dark_token_reward = 5000
)
ORDER BY created_at DESC;

-- If no 5000 quest exists, let's see all active quests
SELECT 
    'All Active Quests' as section,
    id,
    title,
    SUBSTRING(description, 1, 100) as description_preview,
    status,
    grey_token_reward,
    dark_token_reward
FROM sidequests 
WHERE status = 'ACTIVE'
ORDER BY created_at DESC
LIMIT 10;

-- Check your current quests
SELECT 
    'Your Current Quests' as section,
    us.id,
    us.state,
    s.title,
    s.grey_token_reward,
    s.dark_token_reward
FROM user_sidequests us
JOIN profiles p ON us.user_id = p.id
JOIN sidequests s ON us.sidequest_id = s.id
WHERE p.email = 'mariatechmaniac@yahoo.com'
ORDER BY us.created_at DESC;
