
-- Update existing sidequests that require image or description to use ADMIN_CHECK condition type
UPDATE sidequests 
SET condition_type = 'ADMIN_CHECK'
WHERE require_image = true OR require_description = true;

-- Add a constraint to ensure quests requiring submission use ADMIN_CHECK
ALTER TABLE sidequests 
ADD CONSTRAINT check_admin_submission_logic 
CHECK (
  (require_image = true OR require_description = true) 
  AND condition_type = 'ADMIN_CHECK'
  OR 
  (require_image = false AND require_description = false)
);

-- Add comment to explain the constraint
COMMENT ON CONSTRAINT check_admin_submission_logic ON sidequests IS 'Ensures quests requiring image or description submission use ADMIN_CHECK condition type for manual review';
