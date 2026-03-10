
-- Create the 22 Day Streak sidequest
INSERT INTO sidequests (
  title,
  description,
  dark_token_reward,
  grey_token_reward,
  grey_unlock,
  status,
  condition_type,
  require_image,
  require_description
) VALUES (
  '22 Day Streak',
  'Maintain a learning streak for 22 consecutive days',
  2,
  80,
  0,
  'ACTIVE',
  'SIMPLE_CONDITIONS',
  false,
  false
);

-- Create the 33 Day Streak sidequest
INSERT INTO sidequests (
  title,
  description,
  dark_token_reward,
  grey_token_reward,
  grey_unlock,
  status,
  condition_type,
  require_image,
  require_description
) VALUES (
  '33 Day Streak',
  'Maintain a learning streak for 33 consecutive days',
  3,
  110,
  0,
  'ACTIVE',
  'SIMPLE_CONDITIONS',
  false,
  false
);

-- Add the streak condition for the 22 Day Streak quest
INSERT INTO quest_conditions (
  sidequest_id,
  condition_type,
  operator,
  target_value
) VALUES (
  (SELECT id FROM sidequests WHERE title = '22 Day Streak' ORDER BY created_at DESC LIMIT 1),
  'STREAK',
  'EQUALS',
  '22'
);

-- Add the streak condition for the 33 Day Streak quest
INSERT INTO quest_conditions (
  sidequest_id,
  condition_type,
  operator,
  target_value
) VALUES (
  (SELECT id FROM sidequests WHERE title = '33 Day Streak' ORDER BY created_at DESC LIMIT 1),
  'STREAK',
  'EQUALS',
  '33'
);

-- Add the 22 Day Streak quest to all existing users in LOCKED state
INSERT INTO user_sidequests (user_id, sidequest_id, state, created_at)
SELECT 
    p.id as user_id,
    s.id as sidequest_id,
    'LOCKED' as state,
    NOW() as created_at
FROM profiles p
CROSS JOIN sidequests s
WHERE s.title = '22 Day Streak'
AND NOT EXISTS (
    SELECT 1 FROM user_sidequests us 
    WHERE us.user_id = p.id 
    AND us.sidequest_id = s.id
);

-- Add the 33 Day Streak quest to all existing users in LOCKED state
INSERT INTO user_sidequests (user_id, sidequest_id, state, created_at)
SELECT 
    p.id as user_id,
    s.id as sidequest_id,
    'LOCKED' as state,
    NOW() as created_at
FROM profiles p
CROSS JOIN sidequests s
WHERE s.title = '33 Day Streak'
AND NOT EXISTS (
    SELECT 1 FROM user_sidequests us 
    WHERE us.user_id = p.id 
    AND us.sidequest_id = s.id
);
