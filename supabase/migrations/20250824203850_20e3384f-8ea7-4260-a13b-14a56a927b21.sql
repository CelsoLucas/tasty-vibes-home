-- Allow users to view sessions by session code for joining purposes
CREATE POLICY "Users can view sessions by code to join" 
ON public.matching_sessions 
FOR SELECT 
USING (true);

-- Drop the restrictive policy that prevents finding sessions by code
DROP POLICY IF EXISTS "Users can view sessions they created or joined" ON public.matching_sessions;