
-- Add purchase_limit column to store_items table
ALTER TABLE public.store_items 
ADD COLUMN purchase_limit integer DEFAULT NULL;

-- Add a comment to explain the column
COMMENT ON COLUMN public.store_items.purchase_limit IS 'Maximum number of times this item can be purchased per user. NULL means unlimited purchases.';
