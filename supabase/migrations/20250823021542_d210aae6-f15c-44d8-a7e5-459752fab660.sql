-- Create matching sessions table
CREATE TABLE public.matching_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_code TEXT NOT NULL UNIQUE,
  filters JSONB NOT NULL,
  restaurant_ids UUID[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed')),
  participants UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user swipes table
CREATE TABLE public.user_swipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES matching_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  liked BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, user_id, restaurant_id)
);

-- Create user matches table
CREATE TABLE public.user_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES matching_sessions(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, restaurant_id)
);

-- Enable Row Level Security
ALTER TABLE public.matching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matching_sessions
CREATE POLICY "Users can view sessions they created or joined" 
ON public.matching_sessions 
FOR SELECT 
USING (created_by = auth.uid() OR auth.uid() = ANY(participants));

CREATE POLICY "Users can create their own sessions" 
ON public.matching_sessions 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update sessions they created or joined" 
ON public.matching_sessions 
FOR UPDATE 
USING (created_by = auth.uid() OR auth.uid() = ANY(participants));

-- RLS Policies for user_swipes
CREATE POLICY "Users can view their own swipes" 
ON public.user_swipes 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own swipes" 
ON public.user_swipes 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_matches
CREATE POLICY "Users can view their own matches" 
ON public.user_matches 
FOR SELECT 
USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Anyone can create matches" 
ON public.user_matches 
FOR INSERT 
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE TRIGGER update_matching_sessions_updated_at
BEFORE UPDATE ON public.matching_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create matches when both users like the same restaurant
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to check for matches
CREATE TRIGGER check_match_trigger
AFTER INSERT ON public.user_swipes
FOR EACH ROW
EXECUTE FUNCTION public.check_and_create_match();