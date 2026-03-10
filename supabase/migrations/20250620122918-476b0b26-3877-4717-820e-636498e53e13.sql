
-- Update user progress to Level 2, Leadership Skills topic for mariatechmaniach@yahoo.com
UPDATE user_progress 
SET 
  current_level_id = 'a1d3e94f-75a2-42b6-b1c8-e7f248962e0d',
  current_topic_id = 'dcd14bf4-7887-4542-8df9-f7e0fb055c14',
  current_activity_id = (SELECT id FROM activities WHERE topic_id = 'dcd14bf4-7887-4542-8df9-f7e0fb055c14' ORDER BY order_number LIMIT 1),
  updated_at = NOW()
WHERE user_id = (SELECT id FROM profiles WHERE email = 'mariatechmaniach@yahoo.com')
  AND course_id = 'd5e87c1a-6f34-42d9-9811-3e85b1b19a28';
