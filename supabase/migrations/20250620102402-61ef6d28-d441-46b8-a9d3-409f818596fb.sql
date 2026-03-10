
-- Create the new self_exploration_quests table
CREATE TABLE public.self_exploration_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  dark_token_reward INTEGER NOT NULL DEFAULT 0,
  grey_token_reward INTEGER NOT NULL DEFAULT 0,
  topic_id UUID,
  image TEXT,
  icon TEXT,
  grey_unlock INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Copy self-exploration quests from sidequests to the new table
INSERT INTO public.self_exploration_quests (
  id, title, description, dark_token_reward, grey_token_reward, 
  topic_id, image, icon, grey_unlock, completion_count, status, created_at
)
SELECT 
  id, title, description, dark_token_reward, grey_token_reward,
  topic_id, image, icon, grey_unlock, completion_count, status, created_at
FROM public.sidequests
WHERE type = 'self-exploration-quiz';

-- Create a new table for user self-exploration quest progress
CREATE TABLE public.user_self_exploration_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  self_exploration_quest_id UUID NOT NULL REFERENCES public.self_exploration_quests(id),
  state TEXT NOT NULL DEFAULT 'LIVE',
  progress INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  rewards_claimed BOOLEAN NOT NULL DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  UNIQUE(user_id, self_exploration_quest_id)
);

-- Copy user progress for self-exploration quests
INSERT INTO public.user_self_exploration_quests (
  user_id, self_exploration_quest_id, state, progress, created_at, 
  completed_at, rewards_claimed, is_hidden
)
SELECT 
  us.user_id, us.sidequest_id, us.state, us.progress, us.created_at,
  us.completed_at, us.rewards_claimed, us.is_hidden
FROM public.user_sidequests us
JOIN public.sidequests s ON us.sidequest_id = s.id
WHERE s.type = 'self-exploration-quiz';

-- Delete self-exploration quests from sidequests table
DELETE FROM public.user_sidequests 
WHERE sidequest_id IN (
  SELECT id FROM public.sidequests WHERE type = 'self-exploration-quiz'
);

DELETE FROM public.sidequests WHERE type = 'self-exploration-quiz';

-- Remove the type column from sidequests table
ALTER TABLE public.sidequests DROP COLUMN type;

-- Add Row Level Security for the new tables
ALTER TABLE public.self_exploration_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_self_exploration_quests ENABLE ROW LEVEL SECURITY;

-- Create policies for self_exploration_quests (read-only for users)
CREATE POLICY "Users can view active self exploration quests" 
  ON public.self_exploration_quests 
  FOR SELECT 
  USING (status = 'ACTIVE');

-- Create policies for user_self_exploration_quests
CREATE POLICY "Users can view their own self exploration quest progress" 
  ON public.user_self_exploration_quests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own self exploration quest progress" 
  ON public.user_self_exploration_quests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own self exploration quest progress" 
  ON public.user_self_exploration_quests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own self exploration quest progress" 
  ON public.user_self_exploration_quests 
  FOR DELETE 
  USING (auth.uid() = user_id);
