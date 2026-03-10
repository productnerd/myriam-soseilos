
-- Helper function to get quest conditions
CREATE OR REPLACE FUNCTION get_quest_conditions(quest_id UUID)
RETURNS TABLE(
  condition_type TEXT,
  operator TEXT,
  target_value TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    qc.condition_type,
    qc.operator, 
    qc.target_value
  FROM quest_conditions qc
  WHERE qc.sidequest_id = quest_id;
END;
$$;
