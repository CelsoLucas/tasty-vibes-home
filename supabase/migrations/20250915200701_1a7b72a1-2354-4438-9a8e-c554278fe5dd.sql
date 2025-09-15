-- Create restaurant_categories table
CREATE TABLE public.restaurant_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL DEFAULT '🍽️',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurant_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing categories (public)
CREATE POLICY "Anyone can view restaurant categories" 
ON public.restaurant_categories 
FOR SELECT 
USING (true);

-- Insert existing categories from restaurants table
INSERT INTO public.restaurant_categories (name, emoji, display_order) VALUES
('Fast Food', '🍔', 1),
('Pizza', '🍕', 2),
('Italiana', '🍝', 3),
('Japonesa', '🍱', 4),
('Brasileira', '🇧🇷', 5),
('Churrasco', '🥩', 6),
('Café', '☕', 7),
('Açaí', '🫐', 8),
('Regional', '🏠', 9);

-- Add trigger for updating timestamps
CREATE TRIGGER update_restaurant_categories_updated_at
BEFORE UPDATE ON public.restaurant_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();