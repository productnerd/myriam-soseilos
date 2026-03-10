
-- Add the quest to user mariatechmaniac@yahoo.com with LIVE status
INSERT INTO user_sidequests (user_id, sidequest_id, state, created_at)
SELECT 
    p.id as user_id,
    '77e70872-1ae4-4b4e-a48c-2975c84efc09'::uuid as sidequest_id,
    'LIVE' as state,
    NOW() as created_at
FROM profiles p
WHERE p.email = 'mariatechmaniac@yahoo.com'
AND NOT EXISTS (
    SELECT 1 FROM user_sidequests us 
    WHERE us.user_id = p.id 
    AND us.sidequest_id = '77e70872-1ae4-4b4e-a48c-2975c84efc09'::uuid
);

-- Let's also verify the quest exists in sidequests table and show all available quests
SELECT 
    'Quest Check' as query_type,
    id,
    title,
    description,
    status,
    grey_token_reward,
    dark_token_reward
FROM sidequests 
WHERE id = '77e70872-1ae4-4b4e-a48c-2975c84efc09'::uuid

UNION ALL

SELECT 
    'All Active Quests' as query_type,
    id,
    title,
    description,
    status,
    grey_token_reward,
    dark_token_reward
FROM sidequests 
WHERE status = 'ACTIVE'
ORDER BY query_type, title;
