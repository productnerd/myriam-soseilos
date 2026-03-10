-- Check if the function already exists and drop it
--  This is necessary if we want to change the function signature or return type
DROP FUNCTION IF EXISTS public.check_and_reset_streaks();

-- A function to manage daily user streaks (check and reset)
-- Key features:
-- 1. Checks user activity daily
-- 2. Resets streaks if users don't complete their daily activity goal (20 activities)
-- 3. On Sundays, the streaks do not reset
-- 4. Logs all operations in the `system_logs` table
CREATE OR REPLACE FUNCTION public.check_and_reset_streaks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_yesterday DATE;
  v_users_reset INTEGER;
  v_users_protection_reset INTEGER;
  v_is_sunday BOOLEAN;
BEGIN
  -- Get yesterday's date
  v_yesterday := CURRENT_DATE - INTERVAL '1 day';
  
  -- Check if yesterday was Sunday (Sunday is 0 in PostgreSQL's EXTRACT(DOW))
  v_is_sunday := EXTRACT(DOW FROM v_yesterday) = 0;
  
  -- Insert a log record
  INSERT INTO public.system_logs (operation, details)
  VALUES ('streak_check_started', jsonb_build_object(
    'timestamp', NOW(),
    'checking_date', v_yesterday::text,
    'is_sunday', v_is_sunday
  ));
  
  -- Reset streak protection for ALL users regardless of day
  WITH reset_protection AS (
    UPDATE profiles 
    SET 
      streak_protection = false,
      updated_at = NOW()
    WHERE 
      streak_protection = true
    RETURNING id
  )
  SELECT COUNT(*) INTO v_users_protection_reset FROM reset_protection;
  
  -- Log streak protection reset
  INSERT INTO public.system_logs (operation, details)
  VALUES ('streak_protection_reset', jsonb_build_object(
    'timestamp', NOW(),
    'users_protection_reset', v_users_protection_reset,
    'date', v_yesterday::text
  ));
  
  -- If yesterday was Sunday, don't reset any streaks
  IF v_is_sunday THEN
    -- Log that we're skipping streak resets because it was Sunday
    INSERT INTO public.system_logs (operation, details)
    VALUES ('streak_sunday_protection', jsonb_build_object(
      'timestamp', NOW(),
      'message', 'Skipping streak reset because yesterday was Sunday',
      'date', v_yesterday::text
    ));
    
    -- Exit the function early
    RETURN;
  END IF;

  -- Reset streaks for users who didn't meet their daily activity goal (20 activities) AND don't have streak protection
  WITH users_to_reset AS (
    SELECT 
      p.id, 
      p.streak,
      COALESCE(uda.activity_count, 0) as activity_count,
      p.streak_protection
    FROM 
      profiles p
    LEFT JOIN 
      user_daily_activities uda 
    ON 
      p.id = uda.user_id AND uda.activity_date = v_yesterday
    WHERE 
      p.streak > 0 AND 
      (uda.activity_count IS NULL OR uda.activity_count < 20) AND
      (p.streak_protection = false OR p.streak_protection IS NULL)
  ),
  reset_streaks AS (
    UPDATE profiles 
    SET 
      streak = 0,
      updated_at = NOW()
    FROM 
      users_to_reset
    WHERE 
      profiles.id = users_to_reset.id
    RETURNING profiles.id
  )
  SELECT COUNT(*) INTO v_users_reset FROM reset_streaks;
  
  -- Record the result in the system_logs
  INSERT INTO public.system_logs (operation, details)
  VALUES ('streak_check_completed', jsonb_build_object(
    'timestamp', NOW(),
    'users_reset', v_users_reset,
    'users_protection_reset', v_users_protection_reset,
    'date_checked', v_yesterday::text,
    'sunday_protection', FALSE
  ));

END;
$$;

-- Ensure there's a system_logs table to track operations
CREATE TABLE IF NOT EXISTS public.system_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  operation TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb
);

-- Grant necessary permissions
ALTER FUNCTION public.check_and_reset_streaks() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.check_and_reset_streaks() TO postgres;
GRANT EXECUTE ON FUNCTION public.check_and_reset_streaks() TO service_role;
