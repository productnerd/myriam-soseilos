-- Adding new columns to `user_review_activities` table to incorporate performance metrics for the SRS
ALTER TABLE user_review_activities 
ADD COLUMN next_review TIMESTAMP WITH TIME ZONE,  -- When the activity should be reviewed by the user
ADD COLUMN stability FLOAT,  -- How well the user's memory is retained (higher = more stable)
ADD COLUMN difficulty FLOAT,  -- How difficult the activity is for the user (higher = more difficult)
ADD COLUMN elapsed_days INTEGER,  -- How many days since the last review
ADD COLUMN scheduled_days INTEGER,  -- How many days were scheduled for the current review (helps track if user is reviewing early or late)
ADD COLUMN learning_steps INTEGER,  -- Progress in the learning phase (from new -> learning -> review)
ADD COLUMN reps INTEGER,  -- Total number of times the activity has been reviewed
ADD COLUMN lapses INTEGER,  -- Number of times the user has forgotten the activity (helps identify problematic activities & influences scheduling decisions)
ADD COLUMN state TEXT,  -- Current state in the learning process ("New", "Learning", "Review", "Relearning")
ADD COLUMN last_review TIMESTAMP WITH TIME ZONE;  -- When the user last reviewed the activity

-- Create index for efficient querying of next_review
CREATE INDEX idx_user_review_activities_next_review 
ON user_review_activities(next_review);

-- Add constraint to ensure state is valid
ALTER TABLE user_review_activities
ADD CONSTRAINT valid_state CHECK (state IN ('New', 'Learning', 'Review', 'Relearning')); 