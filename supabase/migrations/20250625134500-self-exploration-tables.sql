
-- Add new columns to self_exploration_quests table
ALTER TABLE public.self_exploration_quests 
ADD COLUMN IF NOT EXISTS custom_prompt text,
ADD COLUMN IF NOT EXISTS questions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS show_quest_social_stats boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS quest_type text DEFAULT 'general';

-- Create table for storing user responses to self-exploration questions
CREATE TABLE IF NOT EXISTS public.self_exploration_responses (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_id uuid NOT NULL REFERENCES public.self_exploration_quests(id) ON DELETE CASCADE,
    question_index integer NOT NULL,
    question_text text NOT NULL,
    response_value text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    session_id uuid NOT NULL
);

-- Create table for storing AI-generated results (versioned)
CREATE TABLE IF NOT EXISTS public.self_exploration_results (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_id uuid NOT NULL REFERENCES public.self_exploration_quests(id) ON DELETE CASCADE,
    ai_response text NOT NULL,
    prompt_used text NOT NULL,
    responses_data jsonb NOT NULL,
    version_number integer NOT NULL DEFAULT 1,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    session_id uuid NOT NULL
);

-- Create table for tracking retake attempts
CREATE TABLE IF NOT EXISTS public.self_exploration_retakes (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_id uuid NOT NULL REFERENCES public.self_exploration_quests(id) ON DELETE CASCADE,
    retake_date date NOT NULL DEFAULT CURRENT_DATE,
    retake_count integer NOT NULL DEFAULT 1
);

-- Create table for quest-level social stats (for grouping quests)
CREATE TABLE IF NOT EXISTS public.self_exploration_quest_stats (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    quest_id uuid NOT NULL REFERENCES public.self_exploration_quests(id) ON DELETE CASCADE,
    result_category text NOT NULL,
    user_count integer NOT NULL DEFAULT 0,
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(quest_id, result_category)
);

-- Add current_question_index to track progress
ALTER TABLE public.user_self_exploration_quests 
ADD COLUMN IF NOT EXISTS current_question_index integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS session_id uuid;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_self_exploration_responses_user_quest ON public.self_exploration_responses(user_id, quest_id);
CREATE INDEX IF NOT EXISTS idx_self_exploration_responses_session ON public.self_exploration_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_self_exploration_results_user_quest ON public.self_exploration_results(user_id, quest_id);
CREATE INDEX IF NOT EXISTS idx_self_exploration_retakes_user_date ON public.self_exploration_retakes(user_id, retake_date);

-- Enable RLS on new tables
ALTER TABLE public.self_exploration_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.self_exploration_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.self_exploration_retakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.self_exploration_quest_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for self_exploration_responses
CREATE POLICY "Users can view their own responses" 
    ON public.self_exploration_responses 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses" 
    ON public.self_exploration_responses 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for self_exploration_results
CREATE POLICY "Users can view their own results" 
    ON public.self_exploration_results 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results" 
    ON public.self_exploration_results 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for self_exploration_retakes
CREATE POLICY "Users can view their own retakes" 
    ON public.self_exploration_retakes 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own retakes" 
    ON public.self_exploration_retakes 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own retakes" 
    ON public.self_exploration_retakes 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create RLS policies for quest stats (public read)
CREATE POLICY "Anyone can view quest stats" 
    ON public.self_exploration_quest_stats 
    FOR SELECT 
    TO public;

-- Create function to update quest stats
CREATE OR REPLACE FUNCTION update_quest_stats(
    p_quest_id uuid,
    p_result_category text
) RETURNS void AS $$
BEGIN
    INSERT INTO public.self_exploration_quest_stats (quest_id, result_category, user_count)
    VALUES (p_quest_id, p_result_category, 1)
    ON CONFLICT (quest_id, result_category) 
    DO UPDATE SET 
        user_count = self_exploration_quest_stats.user_count + 1,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add sample self-exploration quest for testing
INSERT INTO public.self_exploration_quests (
    title, 
    description, 
    custom_prompt,
    questions,
    show_quest_social_stats,
    quest_type,
    status
) VALUES (
    'Discover Your Ideal Nutrition Plan',
    'Answer a series of questions about your lifestyle, preferences, and goals to receive a personalized nutrition plan.',
    'Based on the user''s responses about their food preferences, lifestyle, location, fitness goals, age, and ideal body image, create a comprehensive and personalized nutrition plan. Include specific meal suggestions, portion guidelines, and lifestyle recommendations. Make it practical and achievable.',
    '[
        {
            "type": "MULTIPLE_CHOICE",
            "question": "What type of diet do you currently follow?",
            "options": ["Omnivore", "Vegetarian", "Vegan", "Pescatarian", "Keto", "Paleo", "Other"],
            "show_social_stats": true
        },
        {
            "type": "MULTIPLE_CHOICE",
            "question": "What is your primary fitness goal?",
            "options": ["Weight loss", "Muscle gain", "Maintain current weight", "Improve energy", "Better health overall"],
            "show_social_stats": true
        },
        {
            "type": "TEXT_POLL",
            "question": "What foods do you absolutely love and want to include in your plan?",
            "show_social_stats": false
        },
        {
            "type": "TEXT_POLL",
            "question": "What foods do you dislike or want to avoid?",
            "show_social_stats": false
        },
        {
            "type": "MULTIPLE_CHOICE",
            "question": "How many meals do you prefer to eat per day?",
            "options": ["2 meals", "3 meals", "4-5 small meals", "6+ small meals"],
            "show_social_stats": true
        }
    ]'::jsonb,
    true,
    'grouping',
    'ACTIVE'
) ON CONFLICT DO NOTHING;
