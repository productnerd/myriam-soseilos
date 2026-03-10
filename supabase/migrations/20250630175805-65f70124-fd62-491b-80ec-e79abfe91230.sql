
-- Create the 11 Day Streak sidequest
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
  '11 Day Streak',
  'Maintain a learning streak for 11 consecutive days',
  1,
  60,
  0,
  'ACTIVE',
  'SIMPLE_CONDITIONS',
  false,
  false
);

-- Create the Complete 22 Topics sidequest  
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
  'Complete 22 Topics',
  'Complete 22 learning topics across any courses',
  0,
  40,
  0,
  'ACTIVE',
  'SIMPLE_CONDITIONS',
  false,
  false
);

-- Add the streak condition for the 11 Day Streak quest
INSERT INTO quest_conditions (
  sidequest_id,
  condition_type,
  operator,
  target_value
) VALUES (
  (SELECT id FROM sidequests WHERE title = '11 Day Streak' ORDER BY created_at DESC LIMIT 1),
  'STREAK',
  'EQUALS',
  '11'
);

-- Add the topics completion condition for the Complete 22 Topics quest
INSERT INTO quest_conditions (
  sidequest_id,
  condition_type,
  operator,
  target_value
) VALUES (
  (SELECT id FROM sidequests WHERE title = 'Complete 22 Topics' ORDER BY created_at DESC LIMIT 1),
  'TOPICS_COMPLETED',
  'GREATER_THAN_OR_EQUAL',
  '22'
);
