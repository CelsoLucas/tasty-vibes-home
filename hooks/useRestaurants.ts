import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

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