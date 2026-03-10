
-- Fix the focus points maximum in deduct_focus_points function
CREATE OR REPLACE FUNCTION public.deduct_focus_points(p_user_id uuid, p_is_correct boolean)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_focus INTEGER;
  v_max_focus_points INTEGER := 120;
BEGIN
  -- First check if we need to replenish based on time since last update
  -- This ensures user gets credited for time passed before deducting
  UPDATE profiles
  SET 
    focus_balance = LEAST(focus_balance + 
      GREATEST((EXTRACT(EPOCH FROM (NOW() - focus_last_updated_at)) / 7200)::INTEGER * 30, 0), v_max_focus_points)
  WHERE id = p_user_id AND focus_last_updated_at < NOW() - INTERVAL '2 hours';

  -- Now deduct focus points based on correctness
  UPDATE profiles
  SET 
    focus_balance = GREATEST(focus_balance - CASE WHEN p_is_correct THEN 1 ELSE 5 END, 0),
    focus_last_updated_at = NOW()
  WHERE id = p_user_id
  RETURNING focus_balance INTO v_current_focus;
  
  RETURN v_current_focus;
END;
$$;

-- Fix the focus points maximum in get_user_focus_balance function
CREATE OR REPLACE FUNCTION public.get_user_focus_balance(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_focus_balance INTEGER;
  v_max_focus_points INTEGER := 120;
BEGIN
  -- First check if we need to replenish based on time since last update
  UPDATE profiles
  SET 
    focus_balance = LEAST(focus_balance + 
      GREATEST((EXTRACT(EPOCH FROM (NOW() - focus_last_updated_at)) / 7200)::INTEGER * 30, 0), v_max_focus_points),
    focus_last_updated_at = NOW()
  WHERE 
    id = p_user_id AND 
    focus_last_updated_at < NOW() - INTERVAL '2 hours'
  RETURNING focus_balance INTO v_focus_balance;
  
  -- If no update was needed, just get current balance
  IF v_focus_balance IS NULL THEN
    SELECT focus_balance INTO v_focus_balance
    FROM profiles
    WHERE id = p_user_id;
  END IF;
  
  RETURN COALESCE(v_focus_balance, 0);
END;
$$;

-- Create a function to replenish focus points
-- This will be called by the cron job at even hours
CREATE OR REPLACE FUNCTION public.replenish_focus_points()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    replenish_amount INTEGER := 30;
    max_focus_points INTEGER := 120;
BEGIN
    -- Update focus balance for all users who don't have max points
    UPDATE profiles 
    SET 
        focus_balance = LEAST(focus_balance + replenish_amount, max_focus_points),
        focus_last_updated_at = NOW()
    WHERE 
        focus_balance < max_focus_points;
        
    -- Log the operation
    INSERT INTO public.system_logs (operation, details)
    VALUES ('focus_replenishment', jsonb_build_object(
        'timestamp', NOW(),
        'replenish_amount', replenish_amount,
        'users_affected', (SELECT COUNT(*) FROM profiles WHERE focus_balance < max_focus_points)
    ));
END;
$$;
