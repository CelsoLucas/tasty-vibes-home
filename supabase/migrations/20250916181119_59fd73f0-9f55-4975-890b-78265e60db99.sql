-- Add missing fields to restaurant_profiles table
ALTER TABLE public.restaurant_profiles 
ADD COLUMN category text,
ADD COLUMN email text,
ADD COLUMN website text,
ADD COLUMN whatsapp text;

-- Create restaurant_views table for tracking views
CREATE TABLE public.restaurant_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id uuid NOT NULL REFERENCES public.restaurant_profiles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  ip_address text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on restaurant_views table
ALTER TABLE public.restaurant_views ENABLE ROW LEVEL SECURITY;

-- Create policies for restaurant_views
CREATE POLICY "Anyone can create views" 
ON public.restaurant_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Restaurant owners can view their restaurant views" 
ON public.restaurant_views 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.restaurant_profiles 
    WHERE restaurant_profiles.id = restaurant_views.restaurant_id 
    AND restaurant_profiles.user_id = auth.uid()
  )
);

-- Create index for better performance
CREATE INDEX idx_restaurant_views_restaurant_id ON public.restaurant_views(restaurant_id);
CREATE INDEX idx_restaurant_views_created_at ON public.restaurant_views(created_at);