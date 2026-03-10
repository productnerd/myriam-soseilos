
-- Make store_item_id nullable in user_inventory table
ALTER TABLE public.user_inventory 
ALTER COLUMN store_item_id DROP NOT NULL;

-- Add a comment to explain the flexible usage
COMMENT ON COLUMN public.user_inventory.store_item_id IS 'Store item ID for store purchases. Can be NULL for other types of collectibles and gamified rewards.';
