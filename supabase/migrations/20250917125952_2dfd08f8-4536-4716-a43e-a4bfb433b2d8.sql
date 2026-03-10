-- Fix security definer functions by adding proper search_path
-- This addresses the "Function Search Path Mutable" warnings

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = $1
      AND role = $2
  );
$function$;

-- Update is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT has_role(user_id, 'admin');
$function$;

-- Update archive_weekly_statistics function
CREATE OR REPLACE FUNCTION public.archive_weekly_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.platform_statistics_historical (stat_key, stat_value, week_number, year)
  SELECT 
    stat_key, 
    stat_value, 
    EXTRACT(WEEK FROM NOW())::INTEGER AS week_number,
    EXTRACT(YEAR FROM NOW())::INTEGER AS year
  FROM 
    public.platform_statistics;
    
  RAISE NOTICE 'Platform statistics archived for week % of %', 
    EXTRACT(WEEK FROM NOW())::INTEGER, 
    EXTRACT(YEAR FROM NOW())::INTEGER;
END;
$function$;

-- Update update_user_sidequest_state function
CREATE OR REPLACE FUNCTION public.update_user_sidequest_state(p_user_sidequest_id uuid, p_new_state text, p_completed_at timestamp with time zone)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  result JSONB;
BEGIN
  WITH updated AS (
    UPDATE user_sidequests
    SET 
      state = p_new_state,
      completed_at = CASE WHEN p_new_state = 'COMPLETED' THEN p_completed_at ELSE completed_at END
    WHERE id = p_user_sidequest_id
    RETURNING id, user_id, sidequest_id, state, completed_at
  )
  SELECT 
    jsonb_build_object(
      'id', u.id,
      'user_id', u.user_id,
      'sidequest_id', u.sidequest_id,
      'state', u.state,
      'completed_at', u.completed_at
    ) INTO result
  FROM updated u;
  
  RETURN COALESCE(result, jsonb_build_object('success', false, 'message', 'No records updated'));
END;
$function$;

-- Update update_user_sidequest_by_ids function
CREATE OR REPLACE FUNCTION public.update_user_sidequest_by_ids(p_user_id uuid, p_sidequest_id uuid, p_new_state text, p_completed_at timestamp with time zone)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  result JSONB;
BEGIN
  WITH updated AS (
    UPDATE user_sidequests
    SET 
      state = p_new_state,
      completed_at = CASE WHEN p_new_state = 'COMPLETED' THEN p_completed_at ELSE completed_at END
    WHERE user_id = p_user_id AND sidequest_id = p_sidequest_id
    RETURNING id, user_id, sidequest_id, state, completed_at
  )
  SELECT 
    jsonb_build_object(
      'id', u.id,
      'user_id', u.user_id,
      'sidequest_id', u.sidequest_id,
      'state', u.state,
      'completed_at', u.completed_at
    ) INTO result
  FROM updated u;
  
  RETURN COALESCE(result, jsonb_build_object('success', false, 'message', 'No records updated'));
END;
$function$;