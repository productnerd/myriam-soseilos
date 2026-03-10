-- Migration: Atomic Topic Completion Functions
-- This migration creates database functions to handle topic completion atomically, preventing data inconsistencies that previously required repair mechanisms.

-- =============================================================================
-- Function: get_topic_completion_data
-- Purpose: Gathers all data needed for topic completion in a single atomic query
-- 
-- What this function does:
-- 1. Gets the current topic's details (id, level_id, order_number, course_id)
-- 2. Checks if the topic is already completed by the user
-- 3. Gets all topics in the same level (to check completion status)
-- 4. Gets all completed topics for this level by this user
-- 5. Finds the next topic in the level (if any)
-- 
-- Returns: A single row with JSONB columns containing all the data needed for topic completion logic, preventing race conditions by getting a consistent snapshot of all related data.
-- =============================================================================
CREATE OR REPLACE FUNCTION get_topic_completion_data(
    p_topic_id UUID,
    p_user_id UUID
)
RETURNS TABLE (
    topic JSONB,           -- Current topic details (id, level_id, order_number, course_id)
    level JSONB,           -- Level details (same as topic for compatibility)
    course_id UUID,        -- Course ID for the topic
    existing_completion JSONB, -- NULL if not completed, completion record if completed
    all_topics JSONB,      -- Array of all topics in the level
    completed_topics JSONB, -- Array of completed topic IDs for this level
    next_topic JSONB       -- Next topic in level (NULL if this is the last topic)
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    -- Get the current topic and its level/course information
    WITH topic_info AS (
        SELECT 
            t.id,
            t.level_id,
            t.order_number,
            l.course_id,
            l.id as level_id
        FROM topics t
        JOIN levels l ON t.level_id = l.id
        WHERE t.id = p_topic_id
    ),
    -- Check if this topic is already completed by the user
    existing_completion AS (
        SELECT uct.*
        FROM user_completed_topics uct
        WHERE uct.user_id = p_user_id 
        AND uct.topic_id = p_topic_id
    ),
    -- Get all topics in the same level (ordered by order_number)
    all_level_topics AS (
        SELECT t.id, t.order_number
        FROM topics t
        JOIN topic_info ti ON t.level_id = ti.level_id
        ORDER BY t.order_number
    ),
    -- Get all topics completed by this user in this level
    completed_level_topics AS (
        SELECT uct.topic_id
        FROM user_completed_topics uct
        JOIN topic_info ti ON uct.level_id = ti.level_id
        WHERE uct.user_id = p_user_id
    ),
    -- Find the next topic in the level (if any)
    next_topic AS (
        SELECT t.id, t.level_id
        FROM topics t
        JOIN topic_info ti ON t.level_id = ti.level_id
        WHERE t.order_number > ti.order_number
        ORDER BY t.order_number
        LIMIT 1
    )
    -- Return all data as JSONB for easy consumption by the application
    SELECT 
        (SELECT to_jsonb(topic_info.*) FROM topic_info) as topic,
        (SELECT to_jsonb(topic_info.*) FROM topic_info) as level,
        (SELECT course_id FROM topic_info) as course_id,
        (SELECT to_jsonb(existing_completion.*) FROM existing_completion) as existing_completion,
        (SELECT to_jsonb(array_agg(all_level_topics.*)) FROM all_level_topics) as all_topics,
        (SELECT to_jsonb(array_agg(completed_level_topics.*)) FROM completed_level_topics) as completed_topics,
        (SELECT to_jsonb(next_topic.*) FROM next_topic) as next_topic;
END;
$$;

-- =============================================================================
-- Function: complete_topic
-- Purpose: Performs complete topic completion in a single atomic transaction
-- 
-- What this function does:
-- 1. Marks the topic as completed in user_completed_topics (if not already completed)
-- 2. Updates user_progress based on the completion state:
--    - If all topics in level are completed: sets current_topic_id to NULL
--    - If there's a next topic: moves to the next topic
--    - If no next topic: sets current_topic_id to NULL
-- 3. All operations happen in a single transaction (atomic)
-- 
-- Parameters:
-- - p_user_id: The user completing the topic
-- - p_topic_id: The topic being completed
-- - p_course_id: The course the topic belongs to
-- - p_level_id: The level the topic belongs to
-- - p_is_already_completed: Whether the topic was already completed
-- - p_next_topic_id: The next topic in the level (NULL if none)
-- - p_all_topics_completed: Whether all topics in the level are now completed
-- 
-- Returns: JSONB with success/failure status and error message if applicable
-- =============================================================================
CREATE OR REPLACE FUNCTION complete_topic(
    p_user_id UUID,
    p_topic_id UUID,
    p_course_id UUID,
    p_level_id UUID,
    p_is_already_completed BOOLEAN,
    p_next_topic_id UUID,
    p_all_topics_completed BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
    current_timestamp TIMESTAMPTZ := NOW();
BEGIN
    -- PostgreSQL functions are automatically wrapped in transactions
    -- If any step fails, the entire transaction rolls back
    
    -- Step 1: Mark topic as completed if not already completed
    -- This prevents duplicate completion records and ensures data integrity
    IF NOT p_is_already_completed THEN
        INSERT INTO user_completed_topics (
            user_id,
            course_id,
            level_id,
            topic_id,
            created_at,
            updated_at
        ) VALUES (
            p_user_id,
            p_course_id,
            p_level_id,
            p_topic_id,
            current_timestamp,
            current_timestamp
        )
        ON CONFLICT (user_id, course_id, topic_id) 
        DO UPDATE SET 
            updated_at = current_timestamp;
    END IF;
    
    -- Step 2: Update user progress based on completion state
    -- This determines where the user should go next in their learning journey
    IF p_all_topics_completed THEN
        -- All topics in level completed - user needs to take level test
        -- Set current_topic_id to NULL to indicate level completion
        UPDATE user_progress 
        SET 
            current_topic_id = NULL,
            current_activity_id = NULL,
            updated_at = current_timestamp
        WHERE user_id = p_user_id 
        AND course_id = p_course_id;
    ELSIF p_next_topic_id IS NOT NULL THEN
        -- Move to next topic in same level
        -- User continues learning in the same level
        UPDATE user_progress 
        SET 
            current_topic_id = p_next_topic_id,
            current_activity_id = NULL,
            updated_at = current_timestamp
        WHERE user_id = p_user_id 
        AND course_id = p_course_id;
    ELSE
        -- No next topic found (shouldn't happen with proper data)
        -- Set current_topic_id to NULL as fallback
        UPDATE user_progress 
        SET 
            current_topic_id = NULL,
            current_activity_id = NULL,
            updated_at = current_timestamp
        WHERE user_id = p_user_id 
        AND course_id = p_course_id;
    END IF;
    
    -- Return success result
    result := jsonb_build_object(
        'success', true,
        'message', 'Topic completed successfully',
        'timestamp', current_timestamp
    );
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- If any error occurs, the transaction automatically rolls back
        -- Return error result with details
        result := jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'timestamp', current_timestamp
        );
        
        RETURN result;
END;
$$;

-- Add database constraints to prevent invalid states
-- Constraint: Ensure user_progress.current_topic_id belongs to the correct course
CREATE OR REPLACE FUNCTION validate_user_progress_topic_course()
RETURNS TRIGGER AS $$
BEGIN
    -- If current_topic_id is set, validate it belongs to the course
    IF NEW.current_topic_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 
            FROM topics t
            JOIN levels l ON t.level_id = l.id
            WHERE t.id = NEW.current_topic_id 
            AND l.course_id = NEW.course_id
        ) THEN
            RAISE EXCEPTION 'current_topic_id % does not belong to course %', 
                NEW.current_topic_id, NEW.course_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce the constraint
DROP TRIGGER IF EXISTS validate_user_progress_topic_course_trigger ON user_progress;
CREATE TRIGGER validate_user_progress_topic_course_trigger
    BEFORE INSERT OR UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION validate_user_progress_topic_course();

-- Constraint: Ensure user_completed_topics topic belongs to the correct level
CREATE OR REPLACE FUNCTION validate_completed_topic_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate that the topic belongs to the specified level
    IF NOT EXISTS (
        SELECT 1 
        FROM topics t
        WHERE t.id = NEW.topic_id 
        AND t.level_id = NEW.level_id
    ) THEN
        RAISE EXCEPTION 'topic_id % does not belong to level_id %', 
            NEW.topic_id, NEW.level_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce the constraint
DROP TRIGGER IF EXISTS validate_completed_topic_level_trigger ON user_completed_topics;
CREATE TRIGGER validate_completed_topic_level_trigger
    BEFORE INSERT OR UPDATE ON user_completed_topics
    FOR EACH ROW
    EXECUTE FUNCTION validate_completed_topic_level();

-- =============================================================================
-- Function: complete_topicsave_user_progress
-- Purpose: Saves user progress and increments daily activity count atomically
-- 
-- What this function does:
-- 1. Validates that the topic exists and gets its course/level information
-- 2. Validates that the activity belongs to the specified topic
-- 3. Increments the user's daily activity count (for streaks and analytics)
-- 4. Updates user_progress with the current topic and activity
-- 5. All operations happen in a single transaction (atomic)
-- 
-- Parameters:
-- - p_user_id: The user whose progress is being saved
-- - p_topic_id: The topic the user is working on
-- - p_activity_id: The activity the user just completed
-- 
-- Returns: JSONB with success/failure status and error message if applicable
-- =============================================================================
CREATE OR REPLACE FUNCTION complete_topicsave_user_progress(
    p_user_id UUID,
    p_topic_id UUID,
    p_activity_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
    current_timestamp TIMESTAMPTZ := NOW();
    course_id UUID;
    level_id UUID;
BEGIN
    -- PostgreSQL functions are automatically wrapped in transactions
    -- If any step fails, the entire transaction rolls back
    
    -- Step 1: Get course and level information for the topic
    -- This validates that the topic exists and gets the course context
    SELECT l.course_id, t.level_id INTO course_id, level_id
    FROM topics t
    JOIN levels l ON t.level_id = l.id
    WHERE t.id = p_topic_id;
    
    -- Validate that the topic was found
    IF course_id IS NULL THEN
        result := jsonb_build_object(
            'success', false,
            'error', 'Topic not found or invalid',
            'timestamp', current_timestamp
        );
        RETURN result;
    END IF;
    
    -- Step 2: Validate that the activity belongs to the topic
    -- This prevents cross-topic activity assignments
    IF NOT EXISTS (
        SELECT 1 FROM activities 
        WHERE id = p_activity_id AND topic_id = p_topic_id
    ) THEN
        result := jsonb_build_object(
            'success', false,
            'error', 'Activity does not belong to the specified topic',
            'timestamp', current_timestamp
        );
        RETURN result;
    END IF;
    
    -- Step 3: Increment daily activity count
    -- This is used for streaks, analytics, and user engagement tracking
    INSERT INTO user_daily_activity (user_id, date, activity_count)
    VALUES (p_user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, date)
    DO UPDATE SET 
        activity_count = user_daily_activity.activity_count + 1,
        updated_at = current_timestamp;
    
    -- Step 4: Update user progress
    -- This tracks where the user is in their learning journey
    INSERT INTO user_progress (
        user_id,
        course_id,
        current_topic_id,
        current_activity_id,
        status,
        created_at,
        updated_at
    ) VALUES (
        p_user_id,
        course_id,
        p_topic_id,
        p_activity_id,
        'INPROGRESS',
        current_timestamp,
        current_timestamp
    )
    ON CONFLICT (user_id, course_id)
    DO UPDATE SET 
        current_topic_id = p_topic_id,
        current_activity_id = p_activity_id,
        status = 'INPROGRESS',
        updated_at = current_timestamp;
    
    -- Return success result
    result := jsonb_build_object(
        'success', true,
        'message', 'Progress saved successfully',
        'timestamp', current_timestamp
    );
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- If any error occurs, the transaction automatically rolls back
        -- Return error result with details
        result := jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'timestamp', current_timestamp
        );
        
        RETURN result;
END;
$$;

-- Add comments explaining the new atomic approach
COMMENT ON FUNCTION get_topic_completion_data IS 'Gathers all data needed for topic completion in a single atomic query to prevent race conditions';
COMMENT ON FUNCTION complete_topic IS 'Performs atomic topic completion with proper transaction handling to ensure data integrity';
COMMENT ON FUNCTION complete_topicsave_user_progress IS 'Saves user progress and increments daily activity count atomically to prevent inconsistencies';
COMMENT ON FUNCTION validate_user_progress_topic_course IS 'Ensures user_progress.current_topic_id belongs to the correct course';
COMMENT ON FUNCTION validate_completed_topic_level IS 'Ensures user_completed_topics topic belongs to the correct level';
