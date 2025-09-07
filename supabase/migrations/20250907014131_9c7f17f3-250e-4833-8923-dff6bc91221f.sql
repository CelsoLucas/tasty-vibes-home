-- Fix function search paths for security
DROP FUNCTION IF EXISTS public.add_participant_to_session(uuid, uuid);
DROP FUNCTION IF EXISTS public.join_session(uuid, uuid);

-- Recreate functions with proper search paths
CREATE OR REPLACE FUNCTION public.add_participant_to_session(p_session_id uuid, p_user_id uuid)
 RETURNS TABLE(id uuid, created_by uuid, session_code text, filters jsonb, restaurant_ids uuid[], status text, participants uuid[], created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_participants uuid[];
  new_status text;
BEGIN
  -- Get current participants
  SELECT ms.participants INTO current_participants
  FROM matching_sessions ms
  WHERE ms.id = p_session_id;
  
  -- Check if user is already a participant
  IF p_user_id = ANY(current_participants) THEN
    -- Return the session as-is if user is already in it
    RETURN QUERY
    SELECT ms.id, ms.created_by, ms.session_code, ms.filters, ms.restaurant_ids, ms.status, ms.participants, ms.created_at, ms.updated_at
    FROM matching_sessions ms
    WHERE ms.id = p_session_id;
    RETURN;
  END IF;
  
  -- Check if session is full
  IF array_length(current_participants, 1) >= 2 THEN
    RAISE EXCEPTION 'Session is full';
  END IF;
  
  -- Add user to participants
  current_participants := array_append(current_participants, p_user_id);
  
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
  WHERE matching_sessions.id = p_session_id;
  
  -- Return the updated session
  RETURN QUERY
  SELECT ms.id, ms.created_by, ms.session_code, ms.filters, ms.restaurant_ids, ms.status, ms.participants, ms.created_at, ms.updated_at
  FROM matching_sessions ms
  WHERE ms.id = p_session_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.join_session(session_id uuid, user_id uuid)
 RETURNS TABLE(id uuid, created_by uuid, session_code text, filters jsonb, restaurant_ids uuid[], status text, participants uuid[], created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Add menu categories and items for restaurants
INSERT INTO menu_categories (restaurant_id, name, display_order)
SELECT r.id, 'Pratos Principais', 1 FROM restaurants r WHERE r.category IN ('Brasileira', 'Regional', 'Churrasco')
UNION ALL
SELECT r.id, 'Bebidas', 2 FROM restaurants r WHERE r.category IN ('Brasileira', 'Regional', 'Churrasco')
UNION ALL
SELECT r.id, 'Sobremesas', 3 FROM restaurants r WHERE r.category IN ('Brasileira', 'Regional', 'Churrasco')
UNION ALL
SELECT r.id, 'Sushi & Sashimi', 1 FROM restaurants r WHERE r.category = 'Japonesa'
UNION ALL
SELECT r.id, 'Hot Rolls', 2 FROM restaurants r WHERE r.category = 'Japonesa'
UNION ALL
SELECT r.id, 'Pizzas Tradicionais', 1 FROM restaurants r WHERE r.category = 'Pizza'
UNION ALL
SELECT r.id, 'Pizzas Especiais', 2 FROM restaurants r WHERE r.category = 'Pizza'
UNION ALL
SELECT r.id, 'Massas', 1 FROM restaurants r WHERE r.category = 'Italiana'
UNION ALL
SELECT r.id, 'Risotos', 2 FROM restaurants r WHERE r.category = 'Italiana'
UNION ALL
SELECT r.id, 'Lanches', 1 FROM restaurants r WHERE r.category = 'Fast Food'
UNION ALL
SELECT r.id, 'Combos', 2 FROM restaurants r WHERE r.category = 'Fast Food'
UNION ALL
SELECT r.id, 'Cafés', 1 FROM restaurants r WHERE r.category = 'Café'
UNION ALL
SELECT r.id, 'Doces', 2 FROM restaurants r WHERE r.category = 'Café'
UNION ALL
SELECT r.id, 'Açaí', 1 FROM restaurants r WHERE r.category = 'Açaí'
UNION ALL
SELECT r.id, 'Complementos', 2 FROM restaurants r WHERE r.category = 'Açaí'
ON CONFLICT DO NOTHING;

-- Add sample menu items
INSERT INTO menu_items (restaurant_id, category_id, name, description, price)
SELECT 
  r.id,
  mc.id,
  CASE 
    WHEN mc.name = 'Pratos Principais' THEN 
      CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY r.id, mc.id ORDER BY r.id) = 1 THEN 'Picanha na Chapa'
        WHEN ROW_NUMBER() OVER (PARTITION BY r.id, mc.id ORDER BY r.id) = 2 THEN 'Pacu Pintado'
        ELSE 'Costela de Tambaqui'
      END
    WHEN mc.name = 'Bebidas' THEN 'Guaraná Antarctica'
    WHEN mc.name = 'Sobremesas' THEN 'Furrundu'
    WHEN mc.name = 'Sushi & Sashimi' THEN 'Combo Sashimi'
    WHEN mc.name = 'Hot Rolls' THEN 'Hot Philadelphia'
    WHEN mc.name = 'Pizzas Tradicionais' THEN 'Pizza Margherita'
    WHEN mc.name = 'Pizzas Especiais' THEN 'Pizza Pantaneira'
    WHEN mc.name = 'Massas' THEN 'Espaguete Carbonara'
    WHEN mc.name = 'Risotos' THEN 'Risoto de Camarão'
    WHEN mc.name = 'Lanches' THEN 'Big Burger'
    WHEN mc.name = 'Combos' THEN 'Combo Família'
    WHEN mc.name = 'Cafés' THEN 'Café Expresso'
    WHEN mc.name = 'Doces' THEN 'Brigadeiro Gourmet'
    WHEN mc.name = 'Açaí' THEN 'Açaí 500ml'
    ELSE 'Granola'
  END,
  CASE 
    WHEN mc.name = 'Pratos Principais' THEN 'Prato tradicional da culinária sul-mato-grossense'
    WHEN mc.name = 'Bebidas' THEN 'Refrigerante gelado'
    WHEN mc.name = 'Sobremesas' THEN 'Doce típico do Pantanal'
    WHEN mc.name = 'Sushi & Sashimi' THEN 'Seleção de peixes frescos'
    WHEN mc.name = 'Hot Rolls' THEN 'Roll empanado e frito'
    WHEN mc.name = 'Pizzas Tradicionais' THEN 'Pizza clássica italiana'
    WHEN mc.name = 'Pizzas Especiais' THEN 'Sabor regional especial'
    WHEN mc.name = 'Massas' THEN 'Massa italiana tradicional'
    WHEN mc.name = 'Risotos' THEN 'Risoto cremoso italiano'
    WHEN mc.name = 'Lanches' THEN 'Hambúrguer artesanal'
    WHEN mc.name = 'Combos' THEN 'Lanche + batata + bebida'
    WHEN mc.name = 'Cafés' THEN 'Café premium'
    WHEN mc.name = 'Doces' THEN 'Doce artesanal'
    WHEN mc.name = 'Açaí' THEN 'Açaí natural'
    ELSE 'Complemento saudável'
  END,
  CASE 
    WHEN mc.name = 'Pratos Principais' THEN 45.90
    WHEN mc.name = 'Bebidas' THEN 8.50
    WHEN mc.name = 'Sobremesas' THEN 12.90
    WHEN mc.name = 'Sushi & Sashimi' THEN 65.90
    WHEN mc.name = 'Hot Rolls' THEN 28.90
    WHEN mc.name = 'Pizzas Tradicionais' THEN 35.90
    WHEN mc.name = 'Pizzas Especiais' THEN 42.90
    WHEN mc.name = 'Massas' THEN 32.90
    WHEN mc.name = 'Risotos' THEN 38.90
    WHEN mc.name = 'Lanches' THEN 25.90
    WHEN mc.name = 'Combos' THEN 35.90
    WHEN mc.name = 'Cafés' THEN 6.50
    WHEN mc.name = 'Doces' THEN 8.90
    WHEN mc.name = 'Açaí' THEN 18.90
    ELSE 5.90
  END
FROM restaurants r
JOIN menu_categories mc ON mc.restaurant_id = r.id
ON CONFLICT DO NOTHING;