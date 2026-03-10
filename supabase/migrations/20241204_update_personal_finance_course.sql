
-- Update Personal Finance course with new title and tags
UPDATE courses 
SET 
  title = 'Master Your Finances',
  skill_tags = ARRAY['MONEY', 'BUDGETING', 'INVESTING', 'FINANCIAL PLANNING', 'NEW']
WHERE title = 'Personal Finance 2' OR title LIKE '%Personal Finance%' OR title LIKE '%Finance%';

-- Also update any existing course that might be the finance course based on description or other indicators
UPDATE courses 
SET 
  title = 'Master Your Finances',
  skill_tags = ARRAY['MONEY', 'BUDGETING', 'INVESTING', 'FINANCIAL PLANNING', 'NEW']
WHERE description ILIKE '%finance%' OR description ILIKE '%money%' OR description ILIKE '%budget%';
