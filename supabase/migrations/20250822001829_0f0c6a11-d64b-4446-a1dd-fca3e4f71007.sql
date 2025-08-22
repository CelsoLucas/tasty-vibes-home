-- Criar tabela de restaurantes
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  distance TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  price_range TEXT,
  location TEXT,
  phone TEXT,
  whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view restaurants" 
ON public.restaurants 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample restaurants
INSERT INTO public.restaurants (name, category, rating, distance, image_url, description, price_range, location, phone, whatsapp) VALUES
('McDonald''s', 'Fast Food', 4.3, '0.5 km', '/src/assets/restaurant-1.jpg', 'A famosa rede de fast food com hambúrgueres, batatas fritas e muito mais.', '$$', 'Rua das Flores, 123', '(11) 9999-0001', '11999990001'),
('Outback Steakhouse', 'Steakhouse', 4.6, '1.2 km', '/src/assets/restaurant-2.jpg', 'Steakhouse australiana com carnes grelhadas e pratos especiais.', '$$$', 'Av. Paulista, 456', '(11) 9999-0002', '11999990002'),
('Habib''s', 'Árabe', 4.1, '0.8 km', '/src/assets/restaurant-3.jpg', 'Comida árabe tradicional com esfihas, kibes e pratos especiais.', '$$', 'Rua do Comércio, 789', '(11) 9999-0003', '11999990003'),
('Burger King', 'Fast Food', 4.2, '2.1 km', '/src/assets/restaurant-4.jpg', 'Rede de fast food famosa pelo Whopper e flame grilled.', '$$', 'Shopping Center, L2-34', '(11) 9999-0004', '11999990004'),
('Pizza Hut', 'Pizza', 4.4, '3.2 km', '/src/assets/restaurant-5.jpg', 'Pizzaria internacional com variedade de sabores e massas.', '$$', 'Rua da Pizza, 567', '(11) 9999-0005', '11999990005'),
('Fogo de Chão', 'Churrasco', 4.7, '2.8 km', '/src/assets/restaurant-1.jpg', 'Churrascaria premium com rodízio de carnes nobres.', '$$$$', 'Av. Faria Lima, 890', '(11) 9999-0006', '11999990006'),
('Subway', 'Sanduíches', 4.0, '1.9 km', '/src/assets/restaurant-2.jpg', 'Sanduíches frescos e personalizáveis com ingredientes saudáveis.', '$', 'Rua dos Sanduíches, 234', '(11) 9999-0007', '11999990007'),
('Spoleto', 'Italiana', 4.3, '4.1 km', '/src/assets/restaurant-3.jpg', 'Massas e risotos feitos na hora com ingredientes frescos.', '$$', 'Galeria do Rock, T1-12', '(11) 9999-0008', '11999990008'),
('Starbucks', 'Café', 4.5, '0.3 km', '/src/assets/restaurant-4.jpg', 'Cafeteria internacional com bebidas especiais e lanches.', '$$$', 'Av. Brigadeiro Faria Lima, 345', '(11) 9999-0009', '11999990009'),
('Bob''s', 'Fast Food', 3.9, '1.1 km', '/src/assets/restaurant-5.jpg', 'Rede brasileira de fast food com milkshakes e hambúrgueres.', '$', 'Rua do Bob, 678', '(11) 9999-0010', '11999990010'),
('Rei do Mate', 'Bebidas', 4.2, '0.7 km', '/src/assets/restaurant-1.jpg', 'Especializada em chás gelados, sucos naturais e bebidas refrescantes.', '$', 'Praça da Bebida, 901', '(11) 9999-0011', '11999990011'),
('Giraffas', 'Fast Food', 4.0, '1.5 km', '/src/assets/restaurant-2.jpg', 'Fast food brasileiro com pratos executivos e lanches.', '$$', 'Centro Comercial, L3-45', '(11) 9999-0012', '11999990012'),
('China in Box', 'Chinesa', 4.1, '2.3 km', '/src/assets/restaurant-3.jpg', 'Comida chinesa delivery com pratos tradicionais e especiais.', '$$', 'Rua da China, 123', '(11) 9999-0013', '11999990013'),
('Vivenda do Camarão', 'Frutos do Mar', 4.5, '1.8 km', '/src/assets/restaurant-4.jpg', 'Especializada em frutos do mar com pratos regionais nordestinos.', '$$$', 'Av. Beira Mar, 456', '(11) 9999-0014', '11999990014'),
('Coco Bambu', 'Frutos do Mar', 4.6, '3.0 km', '/src/assets/restaurant-5.jpg', 'Restaurante especializado em frutos do mar e culinária cearense.', '$$$', 'Rua do Coco, 789', '(11) 9999-0015', '11999990015'),
('KFC', 'Fast Food', 4.2, '0.9 km', '/src/assets/restaurant-1.jpg', 'Rede de fast food especializada em frango frito crocante.', '$$', 'Shopping Plaza, F2-23', '(11) 9999-0016', '11999990016'),
('Madero', 'Hambúrgueres Gourmet', 4.8, '2.5 km', '/src/assets/restaurant-2.jpg', 'Hamburgueria gourmet com ingredientes premium e molhos especiais.', '$$$', 'Rua do Madero, 345', '(11) 9999-0017', '11999990017'),
('Açaí da Praia', 'Açaí', 4.4, '1.3 km', '/src/assets/restaurant-3.jpg', 'Açaí natural com variedade de complementos e frutas frescas.', '$', 'Av. da Praia, 678', '(11) 9999-0018', '11999990018'),
('Pão de Açúcar', 'Padaria', 4.3, '0.6 km', '/src/assets/restaurant-4.jpg', 'Padaria tradicional com pães frescos, doces e salgados.', '$', 'Rua do Pão, 901', '(11) 9999-0019', '11999990019'),
('Rubaiyat', 'Fine Dining', 4.7, '3.5 km', '/src/assets/restaurant-5.jpg', 'Restaurante sofisticado com carnes especiais e vinhos selecionados.', '$$$$', 'Alameda dos Jardins, 234', '(11) 9999-0020', '11999990020');