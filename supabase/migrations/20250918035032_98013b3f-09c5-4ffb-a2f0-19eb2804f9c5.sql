-- Allow public access to restaurant profiles so clients can see restaurants
CREATE POLICY "Anyone can view restaurant profiles" 
ON public.restaurant_profiles 
FOR SELECT 
USING (true);