
-- Fix image URLs to use proper Supabase storage paths
-- Update any external URLs to use storage paths

UPDATE public.user_messages 
SET image_url = CASE 
  WHEN image_url LIKE '%unsplash%' OR image_url LIKE 'http%' THEN 
    CASE 
      WHEN title = 'Welcome to Image Messages!' THEN 'sample-message-1.jpg'
      WHEN title = 'Learning Tips & Inspiration' THEN 'sample-message-2.jpg'
      WHEN title = 'Course Update Available' THEN 'sample-message-3.jpg'
      ELSE 'sample-message-1.jpg'
    END
  ELSE image_url 
END
WHERE image_url IS NOT NULL;

-- Ensure we have the correct sample messages for mariatechmaniac@yahoo.com
WITH user_info AS (
  SELECT id FROM public.profiles WHERE email = 'mariatechmaniac@yahoo.com'
)
-- Update existing messages or insert new ones
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
)
ON CONFLICT DO NOTHING;

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
)
ON CONFLICT DO NOTHING;

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
)
ON CONFLICT DO NOTHING;
