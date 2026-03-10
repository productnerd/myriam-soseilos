
-- Create quest_conditions table for simple conditions
CREATE TABLE public.quest_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sidequest_id UUID NOT NULL REFERENCES public.sidequests(id) ON DELETE CASCADE,
  condition_type TEXT NOT NULL, -- 'grey_points', 'dark_points', 'topic_completed', 'course_completed', 'streak', etc.
  operator TEXT NOT NULL, -- 'gte', 'lte', 'eq', 'gt', 'lt'
  target_value TEXT NOT NULL, -- can be numeric value or UUID for topics/courses
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add condition_type and custom_handler to sidequests table
ALTER TABLE public.sidequests ADD COLUMN condition_type TEXT NOT NULL DEFAULT 'SIMPLE_CONDITIONS';
ALTER TABLE public.sidequests ADD COLUMN custom_handler TEXT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.sidequests.condition_type IS 'How to evaluate quest completion: SIMPLE_CONDITIONS, CUSTOM_CODE';
COMMENT ON COLUMN public.sidequests.custom_handler IS 'Function name for CUSTOM_CODE evaluation type (e.g., "checkSpecialQuestLogic")';
COMMENT ON TABLE public.quest_conditions IS 'Simple conditions for sidequest completion evaluation';

-- Create the "5000er" sidequest
INSERT INTO public.sidequests (
  id,
  title,
  description,
  grey_token_reward,
  dark_token_reward,
  status,
  condition_type,
  created_at
) VALUES (
  gen_random_uuid(),
  '5000er',
  'Reach 5000 wise points to unlock this achievement!',
  100,
  50,
  'ACTIVE',
  'SIMPLE_CONDITIONS',
  NOW()
);

-- Get the sidequest ID for creating conditions
DO $$
DECLARE
  quest_id UUID;
BEGIN
  -- Get the ID of the quest we just created
  SELECT id INTO quest_id 
  FROM public.sidequests 
  WHERE title = '5000er' 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- Create the condition for 5000+ grey points
  INSERT INTO public.quest_conditions (
    sidequest_id,
    condition_type,
    operator,
    target_value,
    created_at
  ) VALUES (
    quest_id,
    'grey_points',
    'gte',
    '5000',
    NOW()
  );
END $$;
