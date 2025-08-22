-- Inserir algumas avaliações de exemplo (usando IDs de usuários fictícios para demonstração)
-- Primeiro, vamos buscar alguns restaurantes para criar avaliações

-- Criando usuário fictício para as avaliações
INSERT INTO public.reviews (restaurant_id, user_id, rating, comment, review_images) 
SELECT 
  r.id,
  '00000000-0000-0000-0000-000000000001'::uuid, -- ID fictício
  5,
  'Experiência incrível! A comida estava deliciosa e o atendimento impecável. Recomendo muito!',
  ARRAY['/src/assets/restaurant-1.jpg']::TEXT[]
FROM public.restaurants r WHERE r.name = 'McDonald''s'
LIMIT 1;

INSERT INTO public.reviews (restaurant_id, user_id, rating, comment, review_images) 
SELECT 
  r.id,
  '00000000-0000-0000-0000-000000000002'::uuid, -- ID fictício
  4,
  'Ambiente muito agradável, preços justos. A comida chegou quentinha e saborosa.',
  ARRAY[]::TEXT[]
FROM public.restaurants r WHERE r.name = 'McDonald''s'
LIMIT 1;

INSERT INTO public.reviews (restaurant_id, user_id, rating, comment, review_images) 
SELECT 
  r.id,
  '00000000-0000-0000-0000-000000000001'::uuid, -- ID fictício
  5,
  'Melhor steakhouse da cidade! Carne no ponto perfeito e atendimento de primeira.',
  ARRAY['/src/assets/restaurant-2.jpg', '/src/assets/restaurant-3.jpg']::TEXT[]
FROM public.restaurants r WHERE r.name = 'Outback Steakhouse'
LIMIT 1;

INSERT INTO public.reviews (restaurant_id, user_id, rating, comment, review_images) 
SELECT 
  r.id,
  '00000000-0000-0000-0000-000000000003'::uuid, -- ID fictício
  4,
  'Comida árabe autêntica e saborosa. O ambiente é acolhedor e familiar.',
  ARRAY[]::TEXT[]
FROM public.restaurants r WHERE r.name = 'Habib''s'
LIMIT 1;