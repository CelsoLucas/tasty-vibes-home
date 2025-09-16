-- Clear orphaned users from auth.users that don't have corresponding profiles
-- This will clean up the inconsistent data where users exist in auth.users but not in profiles

DELETE FROM auth.users 
WHERE id NOT IN (
  SELECT id FROM public.profiles WHERE id IS NOT NULL
);