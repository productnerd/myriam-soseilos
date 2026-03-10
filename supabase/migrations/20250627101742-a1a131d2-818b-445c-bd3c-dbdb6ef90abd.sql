
-- Check if the quest exists for user mariatechmaniac
SELECT 
    us.id,
    us.user_id,
    us.sidequest_id,
    us.state,
    us.created_at,
    p.name as user_name,
    p.email as user_email,
    s.title as quest_title
FROM user_sidequests us
JOIN profiles p ON us.user_id = p.id
JOIN sidequests s ON us.sidequest_id = s.id
WHERE p.email = 'mariatechmaniac@yahoo.com'
AND us.sidequest_id = '77e70872-1ae4-4b4e-a48c-2975c84efc09'::uuid;

-- Also check if the quest exists in sidequests table
SELECT 
    id,
    title,
    description,
    status,
    condition_type,
    grey_token_reward,
    dark_token_reward
FROM sidequests 
WHERE id = '77e70872-1ae4-4b4e-a48c-2975c84efc09'::uuid;

-- Check all quests for this user to see what's there
SELECT 
    us.id,
    us.sidequest_id,
    us.state,
    s.title as quest_title,
    s.status as quest_status
FROM user_sidequests us
JOIN profiles p ON us.user_id = p.id
JOIN sidequests s ON us.sidequest_id = s.id
WHERE p.email = 'mariatechmaniac@yahoo.com'
ORDER BY us.created_at DESC;
