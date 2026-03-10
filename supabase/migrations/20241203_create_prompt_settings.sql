
-- Create table to store prompt settings
CREATE TABLE IF NOT EXISTS public.prompt_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_type TEXT NOT NULL DEFAULT 'activity_generator',
  prompt_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, prompt_type)
);

-- Enable RLS
ALTER TABLE public.prompt_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own prompts
CREATE POLICY "Users can manage their own prompts" ON public.prompt_settings
  FOR ALL USING (auth.uid() = user_id);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_prompt_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prompt_settings_updated_at
  BEFORE UPDATE ON public.prompt_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_prompt_settings_updated_at();
