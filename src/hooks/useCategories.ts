import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('restaurants')
        .select('category')
        .order('category');

      if (error) throw error;

      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map((item: any) => item.category))];
      return uniqueCategories.sort();
    },
  });
};