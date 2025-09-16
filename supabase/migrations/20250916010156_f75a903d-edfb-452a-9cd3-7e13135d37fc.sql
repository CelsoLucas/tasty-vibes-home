-- Inserir restaurante fictício para testes
INSERT INTO public.restaurants (
    name,
    category,
    location,
    phone,
    whatsapp,
    description,
    rating,
    price_range,
    distance,
    image_url
) VALUES (
    'Bistro da Vila',
    'Italiana',
    'Rua das Flores, 123 - Vila Madalena, São Paulo - SP',
    '(11) 3456-7890',
    '(11) 99876-5432',
    'Restaurante italiano autêntico com massas artesanais e ambiente aconchegante. Especialidades da casa incluem risotto de funghi porcini e lasanha da nonna.',
    4.5,
    'R$ 50-80',
    '1.2 km',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop'
),
(
    'Sushi Zen',
    'Japonesa',
    'Av. Paulista, 987 - Bela Vista, São Paulo - SP',
    '(11) 2345-6789',
    '(11) 98765-4321',
    'Culinária japonesa tradicional com ingredientes frescos e selecionados. Rodízio de sushi e sashimi com mais de 50 opções.',
    4.8,
    'R$ 80-120',
    '2.1 km',
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop'
),
(
    'Churrascaria do Gaucho',
    'Brasileira',
    'Rua dos Bandeirantes, 456 - Moema, São Paulo - SP',
    '(11) 4567-8901',
    '(11) 97654-3210',
    'Churrascaria tradicional gaúcha com carnes nobres e buffet completo de saladas. Ambiente familiar com música ao vivo aos finais de semana.',
    4.3,
    'R$ 60-100',
    '3.5 km',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=300&fit=crop'
),
(
    'Café Parisiense',
    'Francesa',
    'Rua Augusta, 789 - Consolação, São Paulo - SP',
    '(11) 5678-9012',
    '(11) 96543-2109',
    'Bistrô francês com croissants frescos, quiches e vinhos selecionados. Perfeito para um brunch ou jantar romântico.',
    4.6,
    'R$ 40-70',
    '0.8 km',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&h=300&fit=crop'
),
(
    'Taco Loco',
    'Mexicana',
    'Rua da Consolação, 321 - Centro, São Paulo - SP',
    '(11) 6789-0123',
    '(11) 95432-1098',
    'Comida mexicana autêntica com tacos, burritos e nachos. Ambiente descontraído com drinks especiais e música latina.',
    4.2,
    'R$ 30-50',
    '1.8 km',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop'
);