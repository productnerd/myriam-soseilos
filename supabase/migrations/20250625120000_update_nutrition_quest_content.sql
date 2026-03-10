
-- Update the "discover your ideal nutrition plan" quest with sample icon, image, and personalised result
UPDATE self_exploration_quests 
SET 
  icon = 'photo-1618160702438-9b02ab6515c9',
  image = 'photo-1465146344425-f00d5f5c8f07',
  personalised_result = 'Get a comprehensive nutrition analysis based on your lifestyle, preferences, and health goals. Discover personalized meal plans and dietary recommendations.'
WHERE title = 'discover your ideal nutrition plan';
