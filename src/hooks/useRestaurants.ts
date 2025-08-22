import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image_url: string | null;
  description: string | null;
  price_range: string | null;
  location: string | null;
  phone: string | null;
  whatsapp: string | null;
}

const fetchRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('restaurants')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurants,
  });
};

export const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async (): Promise<Restaurant | null> => {
      try {
        const { data, error } = await (supabase as any)
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        throw error;
      }
    },
    enabled: !!id,
  });
};