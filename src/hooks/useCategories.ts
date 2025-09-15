import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  display_order: number;
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await (supabase as any)
    .from('restaurant_categories')
    .select('*')
    .order('display_order');

  if (error) {
    throw error;
  }

  return data || [];
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};