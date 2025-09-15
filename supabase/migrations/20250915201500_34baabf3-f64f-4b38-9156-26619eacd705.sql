-- Insert 5 restaurants for each category
-- Fast Food
INSERT INTO restaurants (name, category, location, distance, rating, price_range, description, phone, whatsapp, image_url) VALUES
('Burger King Premium', 'Fast Food', 'Shopping Center Norte', '0.5 km', 4.2, 'R$ 25-40', 'Hambúrgueres grelhados na brasa com ingredientes frescos', '(11) 1234-5678', '(11) 91234-5678', '/placeholder.svg'),
('McDonald''s Gourmet', 'Fast Food', 'Av. Paulista, 1000', '0.8 km', 4.0, 'R$ 20-35', 'Clássicos do fast food com opções premium', '(11) 2345-6789', '(11) 92345-6789', '/placeholder.svg'),
('Subway Fresh', 'Fast Food', 'Rua Augusta, 500', '1.2 km', 4.1, 'R$ 15-30', 'Sanduíches frescos e saudáveis feitos na hora', '(11) 3456-7890', '(11) 93456-7890', '/placeholder.svg'),
('KFC Original', 'Fast Food', 'Shopping Ibirapuera', '2.0 km', 3.9, 'R$ 22-38', 'Frango frito crocante com receita secreta', '(11) 4567-8901', '(11) 94567-8901', '/placeholder.svg'),
('Bob''s Classic', 'Fast Food', 'Rua da Consolação, 200', '1.5 km', 3.8, 'R$ 18-32', 'Hambúrgueres tradicionais brasileiros desde 1952', '(11) 5678-9012', '(11) 95678-9012', '/placeholder.svg'),

-- Pizza
('Pizzaria Bráz', 'Pizza', 'Rua Graça Aranha, 187', '0.7 km', 4.6, 'R$ 35-60', 'Pizzas artesanais em forno a lenha', '(11) 6789-0123', '(11) 96789-0123', '/placeholder.svg'),
('Speranza', 'Pizza', 'Rua 13 de Maio, 1004', '1.1 km', 4.5, 'R$ 30-55', 'Tradição italiana com mais de 60 anos', '(11) 7890-1234', '(11) 97890-1234', '/placeholder.svg'),
('Domino''s Express', 'Pizza', 'Av. Rebouças, 3970', '1.8 km', 4.0, 'R$ 25-45', 'Delivery rápido com pizzas saborosas', '(11) 8901-2345', '(11) 98901-2345', '/placeholder.svg'),
('Pizza Hut Premium', 'Pizza', 'Shopping Morumbi', '2.5 km', 3.9, 'R$ 28-50', 'Pizzas com bordas recheadas e ingredientes premium', '(11) 9012-3456', '(11) 99012-3456', '/placeholder.svg'),
('Leggera Pizza', 'Pizza', 'Rua Oscar Freire, 608', '0.9 km', 4.3, 'R$ 32-58', 'Pizzas leves com massa fina e ingredientes selecionados', '(11) 1123-4567', '(11) 91123-4567', '/placeholder.svg'),

-- Italiana
('Jardim de Napoli', 'Italiana', 'Rua Martinico Prado, 463', '0.6 km', 4.7, 'R$ 60-120', 'Autêntica culinária italiana com chef napolitano', '(11) 2234-5678', '(11) 92234-5678', '/placeholder.svg'),
('Famiglia Mancini', 'Italiana', 'Rua Avanhandava, 81', '1.3 km', 4.8, 'R$ 80-150', 'Cantina italiana tradicional desde 1954', '(11) 3345-6789', '(11) 93345-6789', '/placeholder.svg'),
('La Casserole', 'Italiana', 'Largo do Arouche, 346', '1.7 km', 4.4, 'R$ 55-100', 'Massas artesanais e risotos cremosos', '(11) 4456-7890', '(11) 94456-7890', '/placeholder.svg'),
('Osteria del Borgo', 'Italiana', 'Rua da Consolação, 3508', '2.1 km', 4.5, 'R$ 70-130', 'Osteria moderna com pratos tradicionais', '(11) 5567-8901', '(11) 95567-8901', '/placeholder.svg'),
('Il Tartufo', 'Italiana', 'Rua Bela Cintra, 1849', '1.4 km', 4.6, 'R$ 90-160', 'Especialidade em trufas e massas gourmet', '(11) 6678-9012', '(11) 96678-9012', '/placeholder.svg'),

-- Japonesa
('Jun Sakamoto', 'Japonesa', 'Rua Lisboa, 55', '0.8 km', 4.9, 'R$ 120-250', 'Alta gastronomia japonesa com ingredientes premium', '(11) 7789-0123', '(11) 97789-0123', '/placeholder.svg'),
('Sushi Yassu', 'Japonesa', 'Rua Tomás Gonzaga, 98', '1.0 km', 4.7, 'R$ 80-150', 'Sushi tradicional com peixes frescos', '(11) 8890-1234', '(11) 98890-1234', '/placeholder.svg'),
('Yamashiro', 'Japonesa', 'Rua da Glória, 729', '1.5 km', 4.6, 'R$ 90-170', 'Combinados especiais e pratos quentes', '(11) 9901-2345', '(11) 99901-2345', '/placeholder.svg'),
('Nagayama', 'Japonesa', 'Rua Bandeira Paulista, 369', '2.0 km', 4.5, 'R$ 70-140', 'Rodízio de sushi e pratos japoneses', '(11) 1012-3456', '(11) 91012-3456', '/placeholder.svg'),
('Kinoshita', 'Japonesa', 'Rua Jacques Félix, 405', '1.8 km', 4.8, 'R$ 150-300', 'Omakase exclusivo com chef premiado', '(11) 2123-4567', '(11) 92123-4567', '/placeholder.svg'),

-- Brasileira
('Tordesilhas', 'Brasileira', 'Av. Cidade Jardim, 1416', '1.2 km', 4.6, 'R$ 70-130', 'Culinária brasileira contemporânea', '(11) 3234-5678', '(11) 93234-5678', '/placeholder.svg'),
('Mocotó', 'Brasileira', 'Av. Nossa Senhora do Loreto, 1100', '2.8 km', 4.7, 'R$ 60-110', 'Comida nordestina autêntica', '(11) 4345-6789', '(11) 94345-6789', '/placeholder.svg'),
('Casa do Porco', 'Brasileira', 'Rua Araújo, 124', '0.9 km', 4.8, 'R$ 80-150', 'Especialidade em suíno com técnicas modernas', '(11) 5456-7890', '(11) 95456-7890', '/placeholder.svg'),
('Dalva e Dito', 'Brasileira', 'Rua Padre João Manuel, 1115', '1.6 km', 4.5, 'R$ 90-160', 'Cozinha brasileira refinada', '(11) 6567-8901', '(11) 96567-8901', '/placeholder.svg'),
('Bar da Dona Onça', 'Brasileira', 'Rua Amauri, 207', '1.3 km', 4.4, 'R$ 55-100', 'Boteco gourmet com pratos tradicionais', '(11) 7678-9012', '(11) 97678-9012', '/placeholder.svg'),

-- Churrasco
('Fogo de Chão', 'Churrasco', 'Rua Bandeira Paulista, 547', '1.1 km', 4.5, 'R$ 80-140', 'Churrasco gaúcho premium', '(11) 8789-0123', '(11) 98789-0123', '/placeholder.svg'),
('Barbacoa', 'Churrasco', 'Rua Amauri, 255', '1.4 km', 4.6, 'R$ 90-160', 'Carnes nobres grelhadas na brasa', '(11) 9890-1234', '(11) 99890-1234', '/placeholder.svg'),
('Rodízio do Gaúcho', 'Churrasco', 'Av. Moreira Guimarães, 964', '2.2 km', 4.3, 'R$ 60-120', 'Rodízio tradicional com variedade de carnes', '(11) 1901-2345', '(11) 91901-2345', '/placeholder.svg'),
('Pampa Grill', 'Churrasco', 'Rua Bela Cintra, 1737', '1.7 km', 4.4, 'R$ 70-130', 'Ambiente rústico com carnes selecionadas', '(11) 2012-3456', '(11) 92012-3456', '/placeholder.svg'),
('Terra Gaúcha', 'Churrasco', 'Av. das Nações Unidas, 4777', '3.0 km', 4.2, 'R$ 65-125', 'Tradição gaúcha em ambiente familiar', '(11) 3123-4567', '(11) 93123-4567', '/placeholder.svg'),

-- Café
('Café Girondino', 'Café', 'Rua Girondino, 15', '0.3 km', 4.7, 'R$ 15-35', 'Café artesanal e doces caseiros', '(11) 4234-5678', '(11) 94234-5678', '/placeholder.svg'),
('Coffee Lab', 'Café', 'Rua Fradique Coutinho, 1340', '0.7 km', 4.6, 'R$ 18-40', 'Cafés especiais e métodos alternativos', '(11) 5345-6789', '(11) 95345-6789', '/placeholder.svg'),
('Starbucks Reserve', 'Café', 'Av. Paulista, 2073', '1.2 km', 4.4, 'R$ 20-45', 'Experiência premium com cafés exclusivos', '(11) 6456-7890', '(11) 96456-7890', '/placeholder.svg'),
('Suplicy Cafés', 'Café', 'Rua Augusta, 2690', '1.0 km', 4.5, 'R$ 16-38', 'Torrefação própria e ambiente aconchegante', '(11) 7567-8901', '(11) 97567-8901', '/placeholder.svg'),
('Holy Coffee', 'Café', 'Rua Girassol, 273', '1.5 km', 4.3, 'R$ 17-42', 'Café orgânico e opções veganas', '(11) 8678-9012', '(11) 98678-9012', '/placeholder.svg'),

-- Açaí
('Amazon Açaí', 'Açaí', 'Rua Oscar Freire, 819', '0.4 km', 4.5, 'R$ 12-25', 'Açaí puro da Amazônia com toppings', '(11) 9789-0123', '(11) 99789-0123', '/placeholder.svg'),
('Açaí Power', 'Açaí', 'Av. Rebouças, 1368', '0.8 km', 4.3, 'R$ 10-22', 'Açaí energético para atletas', '(11) 1890-1234', '(11) 91890-1234', '/placeholder.svg'),
('Purple Açaí', 'Açaí', 'Rua Haddock Lobo, 1626', '1.1 km', 4.4, 'R$ 14-28', 'Açaí gourmet com frutas premium', '(11) 2901-2345', '(11) 92901-2345', '/placeholder.svg'),
('Tropical Bowls', 'Açaí', 'Rua Consolação, 2697', '1.6 km', 4.2, 'R$ 13-26', 'Bowls nutritivos com superfoods', '(11) 3012-3456', '(11) 93012-3456', '/placeholder.svg'),
('Açaí do Norte', 'Açaí', 'Rua Pamplona, 1275', '1.3 km', 4.1, 'R$ 11-24', 'Receita tradicional paraense', '(11) 4123-4567', '(11) 94123-4567', '/placeholder.svg'),

-- Regional
('Mocotó Regional', 'Regional', 'Rua Nossa Senhora do Loreto, 1100', '2.8 km', 4.8, 'R$ 50-95', 'Pratos típicos do Nordeste', '(11) 5234-5678', '(11) 95234-5678', '/placeholder.svg'),
('Casa do Amazonas', 'Regional', 'Rua 13 de Maio, 1947', '2.1 km', 4.6, 'R$ 45-85', 'Sabores da região Norte', '(11) 6345-6789', '(11) 96345-6789', '/placeholder.svg'),
('Tempero Mineiro', 'Regional', 'Rua Augusta, 2520', '1.4 km', 4.4, 'R$ 40-75', 'Comida caseira de Minas Gerais', '(11) 7456-7890', '(11) 97456-7890', '/placeholder.svg'),
('Sabor Gaúcho', 'Regional', 'Av. Paulista, 1842', '1.8 km', 4.5, 'R$ 55-100', 'Tradições culinárias do Sul', '(11) 8567-8901', '(11) 98567-8901', '/placeholder.svg'),
('Cozinha Baiana', 'Regional', 'Rua Bela Cintra, 1245', '1.2 km', 4.3, 'R$ 42-80', 'Moquecas e pratos típicos da Bahia', '(11) 9678-9012', '(11) 99678-9012', '/placeholder.svg');