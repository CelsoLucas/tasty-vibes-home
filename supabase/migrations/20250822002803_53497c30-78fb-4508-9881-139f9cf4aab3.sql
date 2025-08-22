-- Criar tabela de avaliações
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_images TEXT[], -- Array de URLs das imagens
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de categorias de cardápio
CREATE TABLE public.menu_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de itens do cardápio
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for menu categories
CREATE POLICY "Anyone can view menu categories" 
ON public.menu_categories 
FOR SELECT 
USING (true);

-- Create policies for menu items
CREATE POLICY "Anyone can view menu items" 
ON public.menu_items 
FOR SELECT 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at
BEFORE UPDATE ON public.menu_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample menu categories for first restaurant
INSERT INTO public.menu_categories (restaurant_id, name, display_order) 
SELECT id, 'Entradas', 1 FROM public.restaurants WHERE name = 'McDonald''s'
UNION ALL
SELECT id, 'Pratos Principais', 2 FROM public.restaurants WHERE name = 'McDonald''s'
UNION ALL
SELECT id, 'Bebidas', 3 FROM public.restaurants WHERE name = 'McDonald''s'
UNION ALL
SELECT id, 'Sobremesas', 4 FROM public.restaurants WHERE name = 'McDonald''s';

-- Insert sample menu items for McDonald's
WITH mcdonalds AS (SELECT id FROM public.restaurants WHERE name = 'McDonald''s' LIMIT 1),
     categories AS (
       SELECT id, name FROM public.menu_categories 
       WHERE restaurant_id = (SELECT id FROM mcdonalds)
     )
INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
((SELECT id FROM mcdonalds), (SELECT id FROM categories WHERE name = 'Pratos Principais'), 'Big Mac', 'Dois hambúrgueres, alface, queijo, molho especial, cebola, picles em um pão com gergelim', 18.50, '/src/assets/restaurant-1.jpg'),
((SELECT id FROM mcdonalds), (SELECT id FROM categories WHERE name = 'Pratos Principais'), 'Quarter Pounder', 'Hambúrguer de carne bovina, queijo, cebola, ketchup e mostarda', 16.90, '/src/assets/restaurant-2.jpg'),
((SELECT id FROM mcdonalds), (SELECT id FROM categories WHERE name = 'Entradas'), 'McNuggets 10 unidades', 'Pedaços de frango empanados e fritos', 12.90, '/src/assets/restaurant-3.jpg'),
((SELECT id FROM mcdonalds), (SELECT id FROM categories WHERE name = 'Entradas'), 'Batata Frita Grande', 'Batatas fritas crocantes', 8.50, '/src/assets/restaurant-4.jpg'),
((SELECT id FROM mcdonalds), (SELECT id FROM categories WHERE name = 'Bebidas'), 'Coca-Cola 500ml', 'Refrigerante Coca-Cola gelado', 6.90, '/src/assets/restaurant-5.jpg'),
((SELECT id FROM mcdonalds), (SELECT id FROM categories WHERE name = 'Sobremesas'), 'McFlurry Ovomaltine', 'Sorvete cremoso com pedaços de Ovomaltine', 9.90, '/src/assets/restaurant-1.jpg');