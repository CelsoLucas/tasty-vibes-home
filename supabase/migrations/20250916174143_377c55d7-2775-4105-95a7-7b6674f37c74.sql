-- Fix foreign key constraint for menu_items to reference restaurant_profiles instead of restaurants
ALTER TABLE public.menu_items 
DROP CONSTRAINT IF EXISTS menu_items_restaurant_id_fkey;

ALTER TABLE public.menu_items 
ADD CONSTRAINT menu_items_restaurant_id_fkey 
FOREIGN KEY (restaurant_id) REFERENCES public.restaurant_profiles(id) ON DELETE CASCADE;

-- Create storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own avatars" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatars" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);