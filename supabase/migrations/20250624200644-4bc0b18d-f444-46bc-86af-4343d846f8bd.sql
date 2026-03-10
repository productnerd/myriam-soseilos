
-- First, let's check if there are any messages for the user mariatechmaniac@yahoo.com
-- and update them to use proper Supabase storage paths

-- Get the user ID for mariatechmaniac@yahoo.com
WITH user_info AS (
  SELECT id FROM public.profiles WHERE email = 'mariatechmaniac@yahoo.com'
)
-- Update existing messages to use proper storage paths and add some sample messages with storage images
UPDATE public.user_messages 
SET image_url = CASE 
  WHEN image_url LIKE '%unsplash%' THEN 'sample-message-1.jpg'
  ELSE image_url 
END
WHERE user_id IN (SELECT id FROM user_info);

-- Insert sample messages with proper storage paths for the user
INSERT INTO public.user_messages (user_id, title, payload, tag, is_read, image_url)
SELECT 
  p.id as user_id,
  'Welcome to Image Messages!' as title,
  'We''re excited to introduce image support in your inbox! Now you can receive visual content along with your messages. This feature makes communication more engaging and informative.' as payload,
  'Feature' as tag,
  false as is_read,
  'sample-message-1.jpg' as image_url
FROM public.profiles p
WHERE p.email = 'mariatechmaniac@yahoo.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_messages um 
  WHERE um.user_id = p.id AND um.title = 'Welcome to Image Messages!'
);

INSERT INTO public.user_messages (user_id, title, payload, tag, is_read, image_url)
SELECT 
  p.id as user_id,
  'Learning Tips & Inspiration' as title,
  'Here are some great learning tips to boost your productivity! Remember to take breaks, stay consistent, and celebrate small wins. The image below shows an ideal learning environment.' as payload,
  'Tips' as tag,
  false as is_read,
  'sample-message-2.jpg' as image_url
FROM public.profiles p
WHERE p.email = 'mariatechmaniac@yahoo.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_messages um 
  WHERE um.user_id = p.id AND um.title = 'Learning Tips & Inspiration'
);

INSERT INTO public.user_messages (user_id, title, payload, tag, is_read, image_url)
SELECT 
  p.id as user_id,
  'Course Update Available' as title,
  'A new course has been added to your learning path! Check out the latest content we''ve prepared for you. The attached image gives you a preview of what to expect.' as payload,
  'Course' as tag,
  false as is_read,
  'sample-message-3.jpg' as image_url
FROM public.profiles p
WHERE p.email = 'mariatechmaniac@yahoo.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_messages um 
  WHERE um.user_id = p.id AND um.title = 'Course Update Available'
);

-- Now drop the test_activities table since we're not using it anymore
DROP TABLE IF EXISTS public.test_activities;
