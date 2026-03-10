
-- Fix user progress and topic completion for mariatechmaniach@yahoo.com
-- First, ensure all Level 1 topics are marked as completed

DO $$
DECLARE
    v_user_id UUID := (SELECT id FROM profiles WHERE email = 'mariatechmaniach@yahoo.com');
    v_course_id UUID := 'd5e87c1a-6f34-42d9-9811-3e85b1b19a28';
    v_level1_id UUID := '12345678-90ab-cdef-1234-567890abcdef';
    v_level2_id UUID := 'a1d3e94f-75a2-42b6-b1c8-e7f248962e0d';
    v_topic_record RECORD;
BEGIN
    -- Mark all Level 1 topics as completed
    FOR v_topic_record IN (
        SELECT t.id as topic_id 
        FROM topics t 
        WHERE t.level_id = v_level1_id
    ) LOOP
        -- Insert or update user_completed_topics
        INSERT INTO user_completed_topics (
            user_id, 
            course_id, 
            level_id, 
            topic_id, 
            created_at
        ) VALUES (
            v_user_id,
            v_course_id,
            v_level1_id,
            v_topic_record.topic_id,
            NOW()
        ) ON CONFLICT (user_id, topic_id) DO NOTHING;
        
        -- Update user_topic_progress to completed
        UPDATE user_topic_progress 
        SET 
            status = 'completed',
            updated_at = NOW()
        WHERE 
            user_id = v_user_id 
            AND topic_id = v_topic_record.topic_id;
    END LOOP;

    -- Set Level 2 first topic to in_progress
    UPDATE user_topic_progress 
    SET 
        status = 'in_progress',
        updated_at = NOW()
    WHERE 
        user_id = v_user_id 
        AND topic_id = 'dcd14bf4-7887-4542-8df9-f7e0fb055c14'; -- Leadership Skills topic

    -- Ensure user_progress is correctly set to Level 2
    UPDATE user_progress 
    SET 
        current_level_id = v_level2_id,
        current_topic_id = 'dcd14bf4-7887-4542-8df9-f7e0fb055c14',
        current_activity_id = (
            SELECT id FROM activities 
            WHERE topic_id = 'dcd14bf4-7887-4542-8df9-f7e0fb055c14' 
            ORDER BY order_number LIMIT 1
        ),
        status = 'INPROGRESS',
        updated_at = NOW()
    WHERE 
        user_id = v_user_id 
        AND course_id = v_course_id;

    RAISE NOTICE 'Updated user progress and topic completion for mariatechmaniach@yahoo.com';
END $$;
