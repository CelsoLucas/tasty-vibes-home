import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  display_order: number;
}

// Mapa de emojis para categorias
const categoryEmojis: Record<string, string> = {
  'Fast Food': '🍔',
  'Pizza': '🍕',
  'Italiana': '🍝',
  'Japonesa': '🍱',
  'Brasileira': '🇧🇷',
  'Churrasco': '🥩',
  'Café': '☕',
  'Açaí': '🫐',
  'Regional': '🏠'
};

const fetchCategories = async (): Promise<Category[]> => {
  // Por enquanto, buscar categorias distintas diretamente da tabela restaurants
  const { data: restaurantData, error: restaurantError } = await (supabase as any)
    .from('restaurants')
    .select('category')
    .order('category');

  if (restaurantError) {
    throw restaurantError;
  }

  // Criar categorias únicas
  const uniqueCategories = [...new Set(restaurantData?.map((r: any) => r.category) || [])];
  return uniqueCategories.map((category: string, index) => ({
    id: category.toLowerCase().replace(/\s+/g, '_'),
    name: category,
    emoji: categoryEmojis[category] || '🍽️',
    display_order: index + 1
  }));
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};