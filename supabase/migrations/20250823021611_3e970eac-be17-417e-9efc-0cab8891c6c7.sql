-- Fix security warnings by setting search path
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  other_swipe RECORD;
  other_user_id UUID;
BEGIN
  -- Only process likes
  IF NEW.liked = false THEN
    RETURN NEW;
  END IF;

  -- Find the other user's swipe for the same restaurant in the same session
  SELECT * INTO other_swipe
  FROM public.user_swipes
  WHERE session_id = NEW.session_id
    AND restaurant_id = NEW.restaurant_id
    AND user_id != NEW.user_id
    AND liked = true;

  -- If we found a matching like, create a match
  IF FOUND THEN
    INSERT INTO public.user_matches (session_id, restaurant_id, user1_id, user2_id)
    VALUES (NEW.session_id, NEW.restaurant_id, NEW.user_id, other_swipe.user_id)
    ON CONFLICT (session_id, restaurant_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Update handle_new_user function to fix search path warning
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;