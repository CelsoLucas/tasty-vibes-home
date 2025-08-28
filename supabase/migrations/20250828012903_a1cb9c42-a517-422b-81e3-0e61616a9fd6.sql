-- Delete all existing restaurants
DELETE FROM restaurants;

-- Insert restaurants from Campo Grande, MS
INSERT INTO restaurants (name, category, rating, distance, image_url, description, price_range, location, phone, whatsapp) VALUES
('Churrasquinho do Gaúcho', 'Churrasco', 4.8, '1.2 km', '/src/assets/restaurant-1.jpg', 'Churrascaria tradicional gaúcha com carnes nobres e buffet completo.', '$$$', 'Rua 14 de Julho, 3456 - Centro', '(67) 3384-5678', '67999887766'),
('Sobá do Japa', 'Japonesa', 4.7, '2.1 km', '/src/assets/restaurant-2.jpg', 'Autêntica culinária japonesa com sobá caseiro e pratos tradicionais.', '$$', 'Av. Afonso Pena, 1234 - Centro', '(67) 3321-4567', '67988776655'),
('Pacu Assado do Pantanal', 'Regional', 4.9, '3.5 km', '/src/assets/restaurant-3.jpg', 'Especialidade em peixes pantaneiros, principalmente pacu assado na telha.', '$$$', 'Rua José Antônio, 567 - São Francisco', '(67) 3367-8901', '67977665544'),
('Casa do Peixe Pintado', 'Regional', 4.6, '2.8 km', '/src/assets/restaurant-4.jpg', 'Tradicional casa de pescado com peixe pintado e outros peixes do Pantanal.', '$$', 'Av. Ernesto Geisel, 2890 - Jardim TV Morena', '(67) 3356-7890', '67966554433'),
('Pizzaria Don Pepe', 'Pizza', 4.5, '1.8 km', '/src/assets/restaurant-5.jpg', 'Pizzaria italiana com massas artesanais e ingredientes importados.', '$$', 'Rua Pedro Celestino, 1890 - Centro', '(67) 3325-6789', '67955443322'),
('Churrascaria Pantanal', 'Churrasco', 4.7, '4.2 km', '/src/assets/restaurant-1.jpg', 'Rodízio de carnes com vista para o Pantanal e pratos regionais.', '$$$$', 'Av. Cônsul Assaf Trad, 4567 - Jardim Tv Morena', '(67) 3389-0123', '67944332211'),
('Lamen do Bairro', 'Japonesa', 4.4, '1.5 km', '/src/assets/restaurant-2.jpg', 'Casa de lamen com caldos especiais e gyoza artesanal.', '$', 'Rua Barão de Melgaço, 678 - Centro', '(67) 3324-5678', '67933221100'),
('Tereré & Cia', 'Regional', 4.3, '0.8 km', '/src/assets/restaurant-3.jpg', 'Casa do tereré com petiscos regionais e ambiente climatizado.', '$', 'Rua Dom Aquino, 234 - Centro', '(67) 3315-6789', '67922110099'),
('McDonald\'s Campo Grande', 'Fast Food', 4.2, '2.3 km', '/src/assets/restaurant-4.jpg', 'Rede internacional de fast food com cardápio variado.', '$$', 'Shopping Campo Grande, Loja 201', '(67) 3350-1234', '67911009988'),
('Burger King CG', 'Fast Food', 4.1, '2.7 km', '/src/assets/restaurant-5.jpg', 'Hambúrgueres flame grilled e batatas especiais.', '$$', 'Av. Afonso Pena, 5678 - Amambaí', '(67) 3340-5678', '67900998877'),
('Casa do Pequi', 'Regional', 4.8, '3.1 km', '/src/assets/restaurant-1.jpg', 'Especialidades do cerrado com pequi, pacu e farofa de banana.', '$$$', 'Rua Antônio Maria Coelho, 345 - Centro', '(67) 3378-9012', '67899887766'),
('Sushi Yama', 'Japonesa', 4.6, '1.9 km', '/src/assets/restaurant-2.jpg', 'Sushi bar com peixes frescos e combinados especiais.', '$$$', 'Rua 13 de Maio, 1567 - Centro', '(67) 3327-8901', '67888776655'),
('Churrascaria Espeto de Ouro', 'Churrasco', 4.5, '3.8 km', '/src/assets/restaurant-3.jpg', 'Churrascaria com espetos especiais e buffet de saladas.', '$$$', 'Av. Mato Grosso, 2345 - Jardim dos Estados', '(67) 3362-3456', '67877665544'),
('Pizzaria Bella Napoli', 'Pizza', 4.4, '2.5 km', '/src/assets/restaurant-4.jpg', 'Pizza napolitana no forno a lenha com ingredientes frescos.', '$$', 'Rua Rui Barbosa, 890 - Centro', '(67) 3323-4567', '67866554433'),
('Açaí do Norte', 'Açaí', 4.3, '1.3 km', '/src/assets/restaurant-5.jpg', 'Açaí natural com frutas regionais e complementos variados.', '$', 'Av. Calógeras, 1234 - Centro', '(67) 3318-9012', '67855443322'),
('Pantanal Grill', 'Regional', 4.7, '4.5 km', '/src/assets/restaurant-1.jpg', 'Carnes exóticas do Pantanal grelhadas na brasa.', '$$$$', 'Estrada do Indubrasil, Km 5', '(67) 3395-6789', '67844332211'),
('Café com Prosa', 'Café', 4.5, '0.6 km', '/src/assets/restaurant-2.jpg', 'Café regional com bolos caseiros e pão de queijo.', '$', 'Rua 7 de Setembro, 456 - Centro', '(67) 3314-5678', '67833221100'),
('Comida di Buteco CG', 'Brasileira', 4.4, '2.0 km', '/src/assets/restaurant-3.jpg', 'Petiscos e pratos tradicionais brasileiros em ambiente descontraído.', '$$', 'Rua Joaquim Nabuco, 789 - Centro', '(67) 3342-6789', '67822110099'),
('Temakeria Nikkei', 'Japonesa', 4.3, '2.8 km', '/src/assets/restaurant-4.jpg', 'Temakis e pratos nikkei com fusão de sabores.', '$$', 'Av. Coronel Antonino, 2345 - Centro', '(67) 3351-7890', '67811009988'),
('Cantina da Nonna', 'Italiana', 4.6, '1.7 km', '/src/assets/restaurant-5.jpg', 'Massas artesanais e pratos italianos tradicionais.', '$$$', 'Rua Cândido Mariano, 567 - Centro', '(67) 3326-8901', '67800998877');

-- Update menu categories and items to match new restaurants (optional sample data)
DELETE FROM menu_items;
DELETE FROM menu_categories;