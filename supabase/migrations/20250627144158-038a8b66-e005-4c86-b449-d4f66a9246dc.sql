
-- Create a table for new topic notifications similar to store_item_notifications
CREATE TABLE public.new_topic_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE public.new_topic_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own notifications
CREATE POLICY "Users can view their own topic notifications" 
  ON public.new_topic_notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to create their own notifications
CREATE POLICY "Users can create their own topic notifications" 
  ON public.new_topic_notifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to delete their own notifications
CREATE POLICY "Users can delete their own topic notifications" 
  ON public.new_topic_notifications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add comment to explain the table
COMMENT ON TABLE public.new_topic_notifications IS 'Stores users who want to be notified when new topics are added to courses';
