
-- Add the nutrition plan quest to your user account
INSERT INTO public.user_self_exploration_quests (
    user_id,
    self_exploration_quest_id,
    state,
    created_at
)
SELECT 
    '61724125-101a-4f07-9136-b6ef9ae86207'::uuid,
    id,
    'LIVE',
    now()
FROM public.self_exploration_quests 
WHERE title = 'Discover Your Ideal Nutrition Plan'
ON CONFLICT DO NOTHING;

-- Update "Career Path Explorer" to "City Hunter"
UPDATE public.self_exploration_quests 
SET 
    title = 'City Hunter',
    description = 'Discover which city matches your personality and lifestyle preferences.',
    personalised_result = 'Find the city that matches more your personality',
    custom_prompt = 'Based on the user''s responses about their lifestyle preferences, work style, social habits, climate preferences, and cultural interests, recommend the perfect city for them to live in. Include specific reasons why this city matches their personality and lifestyle.',
    questions = '[
        {
            "type": "MULTIPLE_CHOICE",
            "question": "What''s your ideal work environment?",
            "options": ["Remote from anywhere", "Bustling office downtown", "Creative co-working space", "Home office with garden view"],
            "show_social_stats": true
        },
        {
            "type": "MULTIPLE_CHOICE",
            "question": "How do you prefer to spend weekends?",
            "options": ["Exploring museums and galleries", "Hiking in nature", "Trying new restaurants", "Beach or waterfront activities", "Shopping and city life"],
            "show_social_stats": true
        },
        {
            "type": "MULTIPLE_CHOICE",
            "question": "What climate do you thrive in?",
            "options": ["Four distinct seasons", "Warm and sunny year-round", "Cool and mild", "Tropical and humid"],
            "show_social_stats": true
        },
        {
            "type": "TEXT_POLL",
            "question": "What''s most important to you in a city?",
            "show_social_stats": false
        }
    ]'::jsonb,
    show_quest_social_stats = true,
    quest_type = 'grouping'
WHERE title = 'Career Path Explorer';

-- Update "Communication Style Assessment" with sample questions and add a completed result for your user
UPDATE public.self_exploration_quests 
SET 
    custom_prompt = 'Based on the user''s responses about their communication preferences, conflict resolution style, and social interaction patterns, provide a detailed analysis of their communication style and recommendations for improvement.',
    questions = '[
        {
            "type": "MULTIPLE_CHOICE",
            "question": "In group discussions, you typically:",
            "options": ["Lead the conversation", "Listen and contribute when asked", "Ask lots of questions", "Prefer to observe"],
            "show_social_stats": true
        },
        {
            "type": "MULTIPLE_CHOICE",
            "question": "When there''s a disagreement, you:",
            "options": ["Address it directly", "Try to find middle ground", "Avoid confrontation", "Seek mediation"],
            "show_social_stats": true
        },
        {
            "type": "MULTIPLE_CHOICE",
            "question": "Your preferred communication method is:",
            "options": ["Face-to-face conversation", "Video calls", "Phone calls", "Text/email"],
            "show_social_stats": true
        }
    ]'::jsonb,
    show_quest_social_stats = true
WHERE title = 'Communication Style Assessment';

-- Add the Communication Style Assessment to your user account as completed with a result
INSERT INTO public.user_self_exploration_quests (
    user_id,
    self_exploration_quest_id,
    state,
    completed_at,
    created_at
)
SELECT 
    '61724125-101a-4f07-9136-b6ef9ae86207'::uuid,
    id,
    'COMPLETED',
    now(),
    now()
FROM public.self_exploration_quests 
WHERE title = 'Communication Style Assessment'
ON CONFLICT DO NOTHING;

-- Add a sample result for Communication Style Assessment
INSERT INTO public.self_exploration_results (
    user_id,
    quest_id,
    ai_response,
    prompt_used,
    responses_data,
    session_id
)
SELECT 
    '61724125-101a-4f07-9136-b6ef9ae86207'::uuid,
    sq.id,
    '**Your Communication Style: The Thoughtful Collaborator**

Based on your responses, you have a balanced communication style that combines active listening with thoughtful contribution. Here''s your personalized analysis:

**Strengths:**
- You excel at reading the room and knowing when to speak up
- Your preference for face-to-face communication shows you value genuine connection
- You approach conflicts with a solution-focused mindset

**Communication Pattern:**
You''re the type of person who listens first, processes information, and then contributes meaningfully to conversations. This makes you a valuable team member and trusted confidant.

**Recommendations:**
- Practice speaking up earlier in discussions - your insights are valuable
- Use your natural mediation skills to help others resolve conflicts
- Continue leveraging face-to-face meetings for important conversations

**Ideal Environments:**
You thrive in collaborative settings where thoughtful discussion is valued over quick decisions.',
    'Based on the user''s responses about their communication preferences, conflict resolution style, and social interaction patterns, provide a detailed analysis of their communication style and recommendations for improvement.',
    '{"question_0": {"question": "In group discussions, you typically:", "answer": "Listen and contribute when asked"}, "question_1": {"question": "When there''s a disagreement, you:", "answer": "Try to find middle ground"}, "question_2": {"question": "Your preferred communication method is:", "answer": "Face-to-face conversation"}}'::jsonb,
    gen_random_uuid()
FROM public.self_exploration_quests sq
WHERE sq.title = 'Communication Style Assessment'
ON CONFLICT DO NOTHING;

-- Add sample social stats for the quests
INSERT INTO public.self_exploration_quest_stats (quest_id, result_category, user_count)
SELECT sq.id, 'Remote from anywhere', 45
FROM public.self_exploration_quests sq WHERE sq.title = 'City Hunter'
UNION ALL
SELECT sq.id, 'Bustling office downtown', 32
FROM public.self_exploration_quests sq WHERE sq.title = 'City Hunter'
UNION ALL
SELECT sq.id, 'Creative co-working space', 28
FROM public.self_exploration_quests sq WHERE sq.title = 'City Hunter'
ON CONFLICT DO NOTHING;

INSERT INTO public.self_exploration_quest_stats (quest_id, result_category, user_count)
SELECT sq.id, 'Listen and contribute when asked', 67
FROM public.self_exploration_quests sq WHERE sq.title = 'Communication Style Assessment'
UNION ALL
SELECT sq.id, 'Lead the conversation', 23
FROM public.self_exploration_quests sq WHERE sq.title = 'Communication Style Assessment'
UNION ALL
SELECT sq.id, 'Ask lots of questions', 41
FROM public.self_exploration_quests sq WHERE sq.title = 'Communication Style Assessment'
ON CONFLICT DO NOTHING;

INSERT INTO public.self_exploration_quest_stats (quest_id, result_category, user_count)
SELECT sq.id, 'Omnivore', 89
FROM public.self_exploration_quests sq WHERE sq.title = 'Discover Your Ideal Nutrition Plan'
UNION ALL
SELECT sq.id, 'Vegetarian', 34
FROM public.self_exploration_quests sq WHERE sq.title = 'Discover Your Ideal Nutrition Plan'
UNION ALL
SELECT sq.id, 'Vegan', 12
FROM public.self_exploration_quests sq WHERE sq.title = 'Discover Your Ideal Nutrition Plan'
ON CONFLICT DO NOTHING;
