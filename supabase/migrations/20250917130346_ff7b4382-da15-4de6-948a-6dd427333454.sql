-- Fix Security Definer View issues by recreating problematic views
-- This addresses the remaining "Security Definer View" errors

-- Drop and recreate the invite_info view with proper security
DROP VIEW IF EXISTS public.invite_info;

-- Recreate as a security definer function instead of a view to have better control
CREATE OR REPLACE FUNCTION public.get_invite_info()
RETURNS TABLE (
  access_code_id UUID,
  access_code TEXT,
  inviter_id UUID,
  inviter_name TEXT,
  inviter_email TEXT
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    ac.id AS access_code_id,
    ac.code AS access_code,
    p.id AS inviter_id,
    p.name AS inviter_name,
    p.email AS inviter_email
  FROM access_codes ac
  JOIN profiles p ON ac.created_by = p.id
  WHERE ac.is_active = true;
$function$;

-- Drop and recreate admin_audit_logs_view with proper security
DROP VIEW IF EXISTS public.admin_audit_logs_view;

CREATE OR REPLACE FUNCTION public.get_admin_audit_logs()
RETURNS TABLE (
  id UUID,
  admin_id UUID,
  admin_name TEXT,
  action_type TEXT,
  entity_type TEXT,
  entity_id UUID,
  details TEXT,
  previous_state JSONB,
  new_state JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    aal.id,
    aal.admin_id,
    p.name AS admin_name,
    aal.action_type,
    aal.entity_type,
    aal.entity_id,
    aal.details,
    aal.previous_state,
    aal.new_state,
    aal.ip_address,
    aal.created_at
  FROM admin_audit_logs aal
  LEFT JOIN profiles p ON p.id = aal.admin_id
  WHERE has_role(auth.uid(), 'admin');
$function$;

-- Drop and recreate profiles_with_roles view with proper security
DROP VIEW IF EXISTS public.profiles_with_roles;

CREATE OR REPLACE FUNCTION public.get_profiles_with_roles()
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  dark_points INTEGER,
  grey_points INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  email_alerts BOOLEAN,
  push_notifications BOOLEAN,
  streak INTEGER,
  last_active TIMESTAMPTZ,
  access_code UUID,
  onboarding_completed BOOLEAN,
  strikes INTEGER,
  poll_sharing BOOLEAN,
  score_sharing BOOLEAN,
  invited_by UUID,
  thumbnail TEXT,
  flag TEXT,
  country TEXT,
  favorite_emoji TEXT,
  tags TEXT[],
  roles user_role[]
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    p.id,
    p.name,
    p.email,
    p.dark_points,
    p.grey_points,
    p.created_at,
    p.updated_at,
    p.email_alerts,
    p.push_notifications,
    p.streak,
    p.last_active,
    p.access_code,
    p.onboarding_completed,
    p.strikes,
    p.poll_sharing,
    p.score_sharing,
    p.invited_by,
    p.thumbnail,
    p.flag,
    p.country,
    p.favorite_emoji,
    p.tags,
    array_agg(ur.role) AS roles
  FROM profiles p
  LEFT JOIN user_roles ur ON p.id = ur.user_id
  WHERE has_role(auth.uid(), 'admin') OR p.id = auth.uid()
  GROUP BY p.id;
$function$;