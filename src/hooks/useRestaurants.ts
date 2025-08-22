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

export interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  review_images: string[] | null;
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  menu_categories?: {
    name: string;
    display_order: number;
  };
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
  menu_items?: MenuItem[];
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

// Hook para buscar avaliações de um restaurante
export const useRestaurantReviews = (restaurantId: string) => {
  return useQuery({
    queryKey: ['reviews', restaurantId],
    queryFn: async (): Promise<Review[]> => {
      try {
        const { data, error } = await (supabase as any)
          .from('reviews')
          .select(`
            *,
            profiles:user_id (
              display_name,
              avatar_url
            )
          `)
          .eq('restaurant_id', restaurantId)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }
    },
    enabled: !!restaurantId,
  });
};

// Hook para buscar cardápio de um restaurante
export const useRestaurantMenu = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: async (): Promise<MenuCategory[]> => {
      try {
        const { data, error } = await (supabase as any)
          .from('menu_categories')
          .select(`
            *,
            menu_items (
              id,
              name,
              description,
              price,
              image_url,
              is_available
            )
          `)
          .eq('restaurant_id', restaurantId)
          .order('display_order', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching menu:', error);
        return [];
      }
    },
    enabled: !!restaurantId,
  });
};

// Hook para calcular estatísticas de avaliações
export const useRestaurantStats = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-stats', restaurantId],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('reviews')
          .select('rating')
          .eq('restaurant_id', restaurantId);

        if (error) {
          throw new Error(error.message);
        }

        if (!data || data.length === 0) {
          return { averageRating: 0, totalReviews: 0 };
        }

        const totalReviews = data.length;
        const averageRating = data.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews;

        return {
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews
        };
      } catch (error) {
        console.error('Error fetching restaurant stats:', error);
        return { averageRating: 0, totalReviews: 0 };
      }
    },
    enabled: !!restaurantId,
  });
};