
-- Add the 11 Day Streak quest to all existing users
INSERT INTO user_sidequests (user_id, sidequest_id, state, created_at)
SELECT 
    p.id as user_id,
    s.id as sidequest_id,
    'LIVE' as state,
    NOW() as created_at
FROM profiles p
CROSS JOIN sidequests s
WHERE s.title = '11 Day Streak'
AND NOT EXISTS (
    SELECT 1 FROM user_sidequests us 
    WHERE us.user_id = p.id 
    AND us.sidequest_id = s.id
);

-- Add the Complete 22 Topics quest to all existing users
INSERT INTO user_sidequests (user_id, sidequest_id, state, created_at)
SELECT 
    p.id as user_id,
    s.id as sidequest_id,
    'LIVE' as state,
    NOW() as created_at
FROM profiles p
CROSS JOIN sidequests s
WHERE s.title = 'Complete 22 Topics'
AND NOT EXISTS (
    SELECT 1 FROM user_sidequests us 
    WHERE us.user_id = p.id 
    AND us.sidequest_id = s.id
);
