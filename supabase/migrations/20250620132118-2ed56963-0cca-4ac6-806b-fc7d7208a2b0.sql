
-- First, let's find your user ID and the Level 2 test ID for "Use Tech Like a Pro" course
WITH user_info AS (
  SELECT id as user_id 
  FROM profiles 
  WHERE email = 'mariatechmaniac@yahoo.com'
),
course_info AS (
  SELECT id as course_id 
  FROM courses 
  WHERE title ILIKE '%tech like a pro%'
),
level_info AS (
  SELECT l.id as level_id
  FROM levels l
  JOIN course_info c ON l.course_id = c.course_id
  WHERE l.order_number = 2
),
test_info AS (
  SELECT t.id as test_id
  FROM tests t
  JOIN level_info l ON t.level_id = l.level_id
  WHERE t.test_type = 'level'
)
-- Insert the new test score record
INSERT INTO user_test_scores (
  user_id,
  test_id,
  score,
  passed,
  completed_at
)
SELECT 
  u.user_id,
  t.test_id,
  96,
  true,
  NOW()
FROM user_info u, test_info t
ON CONFLICT (user_id, test_id) 
DO UPDATE SET 
  score = 96,
  passed = true,
  completed_at = NOW();

-- Verify the update
SELECT 
  p.email,
  c.title as course_title,
  l.order_number as level_number,
  uts.score,
  uts.passed,
  uts.completed_at
FROM user_test_scores uts
JOIN profiles p ON uts.user_id = p.id
JOIN tests t ON uts.test_id = t.id
JOIN levels l ON t.level_id = l.id
JOIN courses c ON l.course_id = c.id
WHERE p.email = 'mariatechmaniac@yahoo.com'
  AND c.title ILIKE '%tech like a pro%'
  AND l.order_number = 2;
