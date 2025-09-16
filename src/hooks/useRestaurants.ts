import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
        // Buscar reviews e perfis separadamente para evitar erro de relacionamento
        const { data: reviewsData, error: reviewsError } = await (supabase as any)
          .from('reviews')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          return [];
        }

        if (!reviewsData || reviewsData.length === 0) {
          return [];
        }

        // Buscar perfis dos usuários das reviews
        const userIds = reviewsData.map((review: any) => review.user_id);
        const { data: profilesData } = await (supabase as any)
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', userIds);

        // Combinar reviews com perfis
        const reviewsWithProfiles = reviewsData.map((review: any) => {
          const profile = profilesData?.find((p: any) => p.id === review.user_id);
          return {
            ...review,
            profiles: profile || null
          };
        });

        return reviewsWithProfiles;
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
    queryKey: ['restaurant-menu', restaurantId],
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

// Menu mutation hooks
export const useCreateMenuCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ restaurantId, name, displayOrder }: { 
      restaurantId: string; 
      name: string; 
      displayOrder?: number; 
    }) => {
      const { data, error } = await (supabase as any)
        .from('menu_categories')
        .insert({
          restaurant_id: restaurantId,
          name,
          display_order: displayOrder || 0
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', variables.restaurantId] });
    }
  });
};

export const useUpdateMenuCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      categoryId, 
      name, 
      displayOrder,
      restaurantId 
    }: { 
      categoryId: string; 
      name: string; 
      displayOrder?: number;
      restaurantId: string;
    }) => {
      const { data, error } = await (supabase as any)
        .from('menu_categories')
        .update({
          name,
          display_order: displayOrder
        })
        .eq('id', categoryId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', variables.restaurantId] });
    }
  });
};

export const useDeleteMenuCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ categoryId, restaurantId }: { categoryId: string; restaurantId: string }) => {
      const { error } = await (supabase as any)
        .from('menu_categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', variables.restaurantId] });
    }
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      restaurantId, 
      categoryId, 
      name, 
      description, 
      price, 
      isAvailable = true,
      imageUrl 
    }: { 
      restaurantId: string; 
      categoryId: string;
      name: string; 
      description?: string; 
      price: number;
      isAvailable?: boolean;
      imageUrl?: string;
    }) => {
      const { data, error } = await (supabase as any)
        .from('menu_items')
        .insert({
          restaurant_id: restaurantId,
          category_id: categoryId,
          name,
          description,
          price,
          is_available: isAvailable,
          image_url: imageUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', variables.restaurantId] });
    }
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      itemId,
      restaurantId,
      name, 
      description, 
      price, 
      isAvailable,
      imageUrl 
    }: { 
      itemId: string;
      restaurantId: string;
      name?: string; 
      description?: string; 
      price?: number;
      isAvailable?: boolean;
      imageUrl?: string;
    }) => {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (isAvailable !== undefined) updateData.is_available = isAvailable;
      if (imageUrl !== undefined) updateData.image_url = imageUrl;
      
      const { data, error } = await (supabase as any)
        .from('menu_items')
        .update(updateData)
        .eq('id', itemId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', variables.restaurantId] });
    }
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, restaurantId }: { itemId: string; restaurantId: string }) => {
      const { error } = await (supabase as any)
        .from('menu_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', variables.restaurantId] });
    }
  });
};

export const useRestaurantProfile = () => {
  return useQuery({
    queryKey: ['restaurant-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await (supabase as any)
        .from('restaurant_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });
};