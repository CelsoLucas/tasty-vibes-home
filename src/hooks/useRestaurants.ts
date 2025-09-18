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
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
}

const fetchRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('restaurant_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Transform restaurant_profiles data to match Restaurant interface
    return (data || []).map(profile => ({
      id: profile.id,
      name: profile.restaurant_name || 'Restaurante',
      category: profile.category || 'Restaurante',
      rating: 4.5, // Default rating
      distance: '2.5 km', // Default distance
      image_url: '/placeholder.svg',
      description: profile.description,
      price_range: '$$',
      location: profile.address,
      phone: profile.phone,
      whatsapp: profile.whatsapp
    }));
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
          .from('restaurant_profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) return null;

        // Transform restaurant_profiles data to match Restaurant interface
        return {
          id: data.id,
          name: data.restaurant_name || 'Restaurante',
          category: data.category || 'Restaurante',
          rating: 4.5, // Default rating
          distance: '2.5 km', // Default distance
          image_url: '/placeholder.svg',
          description: data.description,
          price_range: '$$',
          location: data.address,
          phone: data.phone,
          whatsapp: data.whatsapp
        };
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
    queryFn: async (): Promise<{ items: MenuItem[] }> => {
      try {
        const { data, error } = await (supabase as any)
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('name', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        return { items: data || [] };
      } catch (error) {
        console.error('Error fetching menu:', error);
        return { items: [] };
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

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      restaurantId, 
      name, 
      description, 
      price, 
      isAvailable = true,
      imageUrl 
    }: { 
      restaurantId: string; 
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
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });
};

// Hook para buscar visualizações do restaurante
export const useRestaurantViews = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-views', restaurantId],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('restaurant_views')
          .select('id')
          .eq('restaurant_id', restaurantId);

        if (error) throw error;
        return { totalViews: data?.length || 0 };
      } catch (error) {
        console.error('Error fetching restaurant views:', error);
        return { totalViews: 0 };
      }
    },
    enabled: !!restaurantId,
  });
};

// Hook para calcular completude do perfil
export const useProfileCompletion = (profileData: any) => {
  return useQuery({
    queryKey: ['profile-completion', profileData?.id],
    queryFn: async () => {
      if (!profileData) return { percentage: 0, missingFields: [] };

      const requiredFields = [
        'restaurant_name',
        'description', 
        'phone',
        'address',
        'category',
        'email',
        'opening_hours'
      ];

      const filledFields = requiredFields.filter(field => {
        const value = profileData[field];
        return value && value !== '' && value !== null;
      });

      const percentage = Math.round((filledFields.length / requiredFields.length) * 100);
      const missingFields = requiredFields.filter(field => {
        const value = profileData[field];
        return !value || value === '' || value === null;
      });

      return { percentage, missingFields };
    },
    enabled: !!profileData,
  });
};

// Hook para distribuição de ratings
export const useReviewsDistribution = (restaurantId: string) => {
  return useQuery({
    queryKey: ['reviews-distribution', restaurantId],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('reviews')
          .select('rating')
          .eq('restaurant_id', restaurantId);

        if (error) throw error;

        if (!data || data.length === 0) {
          return {
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            totalReviews: 0
          };
        }

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        data.forEach((review: any) => {
          if (review.rating >= 1 && review.rating <= 5) {
            distribution[review.rating as keyof typeof distribution]++;
          }
        });

        return {
          distribution,
          totalReviews: data.length
        };
      } catch (error) {
        console.error('Error fetching reviews distribution:', error);
        return {
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          totalReviews: 0
        };
      }
    },
    enabled: !!restaurantId,
  });
};

// Mutation para atualizar perfil do restaurante
export const useUpdateRestaurantProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await (supabase as any)
        .from('restaurant_profiles')
        .upsert({
          user_id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-profile'] });
    }
  });
};