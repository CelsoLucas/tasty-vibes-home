-- Create function to join session and properly update participants array
CREATE OR REPLACE FUNCTION join_session(session_id uuid, user_id uuid)
RETURNS TABLE(
  id uuid,
  created_by uuid,
  session_code text,
  filters jsonb,
  restaurant_ids uuid[],
  status text,
  participants uuid[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) 
LANGUAGE plpgsql
AS $$
DECLARE
  current_participants uuid[];
  new_status text;
BEGIN
  -- Get current participants
  SELECT ms.participants INTO current_participants
  FROM matching_sessions ms
  WHERE ms.id = session_id;
  
  -- Check if user is already a participant
  IF user_id = ANY(current_participants) THEN
    -- Return the session as-is if user is already in it
    RETURN QUERY
    SELECT ms.id, ms.created_by, ms.session_code, ms.filters, ms.restaurant_ids, ms.status, ms.participants, ms.created_at, ms.updated_at
    FROM matching_sessions ms
    WHERE ms.id = session_id;
    RETURN;
  END IF;
  
  -- Check if session is full
  IF array_length(current_participants, 1) >= 2 THEN
    RAISE EXCEPTION 'Session is full';
  END IF;
  
  -- Add user to participants
  current_participants := array_append(current_participants, user_id);
  
  -- Determine new status
  IF array_length(current_participants, 1) >= 2 THEN
    new_status := 'active';
  ELSE
    new_status := 'waiting';
  END IF;
  
  -- Update the session
  UPDATE matching_sessions
  SET 
    participants = current_participants,
    status = new_status,
    updated_at = now()
  WHERE matching_sessions.id = session_id;
  
  -- Return the updated session
  RETURN QUERY
  SELECT ms.id, ms.created_by, ms.session_code, ms.filters, ms.restaurant_ids, ms.status, ms.participants, ms.created_at, ms.updated_at
  FROM matching_sessions ms
  WHERE ms.id = session_id;
END;
$$;