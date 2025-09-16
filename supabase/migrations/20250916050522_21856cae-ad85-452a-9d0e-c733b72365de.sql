-- Remove category_id column from menu_items table
ALTER TABLE public.menu_items DROP COLUMN IF EXISTS category_id;

-- Drop the menu_categories table
DROP TABLE IF EXISTS public.menu_categories;