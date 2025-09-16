-- Add RLS policies for menu_categories to allow restaurants to manage their own categories
CREATE POLICY "Restaurants can create their own menu categories" 
ON public.menu_categories 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.restaurant_profiles 
    WHERE user_id = auth.uid() AND id = restaurant_id
  )
);

CREATE POLICY "Restaurants can update their own menu categories" 
ON public.menu_categories 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.restaurant_profiles 
    WHERE user_id = auth.uid() AND id = restaurant_id
  )
);

CREATE POLICY "Restaurants can delete their own menu categories" 
ON public.menu_categories 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.restaurant_profiles 
    WHERE user_id = auth.uid() AND id = restaurant_id
  )
);

-- Add RLS policies for menu_items to allow restaurants to manage their own items
CREATE POLICY "Restaurants can create their own menu items" 
ON public.menu_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.restaurant_profiles 
    WHERE user_id = auth.uid() AND id = restaurant_id
  )
);

CREATE POLICY "Restaurants can update their own menu items" 
ON public.menu_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.restaurant_profiles 
    WHERE user_id = auth.uid() AND id = restaurant_id
  )
);

CREATE POLICY "Restaurants can delete their own menu items" 
ON public.menu_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.restaurant_profiles 
    WHERE user_id = auth.uid() AND id = restaurant_id
  )
);