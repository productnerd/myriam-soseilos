
-- Add the existing 5000er quest to mariatechmaniac@yahoo.com
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
