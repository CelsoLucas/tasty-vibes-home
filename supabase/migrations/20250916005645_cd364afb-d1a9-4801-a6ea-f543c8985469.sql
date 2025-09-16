-- Add user_type to profiles table
ALTER TABLE public.profiles ADD COLUMN user_type TEXT DEFAULT 'customer' CHECK (user_type IN ('customer', 'restaurant'));

-- Create restaurant_profiles table for restaurant-specific data
CREATE TABLE public.restaurant_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    restaurant_name TEXT NOT NULL,
    business_name TEXT,
    cnpj TEXT,
    phone TEXT,
    address TEXT,
    opening_hours JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS on restaurant_profiles
ALTER TABLE public.restaurant_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for restaurant_profiles
CREATE POLICY "Users can view their own restaurant profile" 
ON public.restaurant_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own restaurant profile" 
ON public.restaurant_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own restaurant profile" 
ON public.restaurant_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_restaurant_profiles_updated_at
BEFORE UPDATE ON public.restaurant_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update the handle_new_user function to handle user_type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer')
  );
  
  -- If user is a restaurant, also create restaurant profile
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer') = 'restaurant' THEN
    INSERT INTO public.restaurant_profiles (
      user_id, 
      restaurant_name, 
      business_name, 
      cnpj, 
      phone, 
      address
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'restaurant_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'cnpj', ''),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'address', '')
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;