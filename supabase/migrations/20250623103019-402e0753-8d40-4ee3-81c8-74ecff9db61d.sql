
-- Let's investigate the "Interview Ace" sidequest and why it might be appearing locked
-- First, let's find the sidequest
SELECT 
    s.id,
    s.title,
    s.status,
    s.grey_unlock,
    s.dark_token_reward,
    s.grey_token_reward,
    s.topic_id,
    t.title as topic_title,
    l.title as level_title,
    c.title as course_title
FROM sidequests s
LEFT JOIN topics t ON s.topic_id = t.id
LEFT JOIN levels l ON t.level_id = l.id
LEFT JOIN courses c ON l.course_id = c.id
WHERE s.title ILIKE '%interview%ace%' OR s.title ILIKE '%interview%' OR s.title ILIKE '%ace%';

-- Also check user_sidequests table for this quest
SELECT 
    us.id,
    us.user_id,
    us.sidequest_id,
    us.state,
    us.is_hidden,
    us.progress,
    us.rewards_claimed,
    s.title as sidequest_title,
    s.grey_unlock,
    s.status as sidequest_status
FROM user_sidequests us
JOIN sidequests s ON us.sidequest_id = s.id
WHERE s.title ILIKE '%interview%ace%' OR s.title ILIKE '%interview%' OR s.title ILIKE '%ace%'
LIMIT 10;

-- Check profiles table to see grey_points distribution
SELECT 
    COUNT(*) as user_count,
    AVG(grey_points) as avg_grey_points,
    MIN(grey_points) as min_grey_points,
    MAX(grey_points) as max_grey_points
FROM profiles
WHERE grey_points IS NOT NULL;
