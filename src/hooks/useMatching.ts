import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MatchingSession {
  id: string;
  created_by: string;
  session_code: string;
  filters: {
    category?: string;
    price_range?: string;
    distance?: string;
  };
  restaurant_ids: string[];
  status: 'waiting' | 'active' | 'completed';
  participants: string[];
  created_at: string;
  updated_at: string;
}

export interface UserSwipe {
  id: string;
  session_id: string;
  user_id: string;
  restaurant_id: string;
  liked: boolean;
  created_at: string;
}

export interface UserMatch {
  id: string;
  session_id: string;
  restaurant_id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  restaurants?: {
    id: string;
    name: string;
    image_url: string;
    rating: number;
    category: string;
  };
}

const generateSessionCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create a new matching session
export const useCreateSession = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (filters: { category?: string; price_range?: string; distance?: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get restaurants based on filters
      let query = (supabase as any).from('restaurants').select('id');
      
      if (filters.category && filters.category !== "") {
        query = query.eq('category', filters.category);
      }
      if (filters.price_range && filters.price_range !== "") {
        query = query.eq('price_range', filters.price_range);
      }

      const { data: restaurants, error: restaurantsError } = await query;
      if (restaurantsError) throw restaurantsError;

      const restaurantIds = restaurants?.map((r: any) => r.id) || [];
      
      // Se não encontrou restaurantes com os filtros, pega todos
      if (restaurantIds.length === 0) {
        const { data: allRestaurants, error: allError } = await (supabase as any)
          .from('restaurants')
          .select('id');
        
        if (allError) throw allError;
        restaurantIds.push(...(allRestaurants?.map((r: any) => r.id) || []));
      }
      const sessionCode = generateSessionCode();

      const { data, error } = await (supabase as any)
        .from('matching_sessions')
        .insert({
          created_by: user.user.id,
          session_code: sessionCode,
          filters,
          restaurant_ids: restaurantIds,
          participants: [user.user.id]
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Sessão criada!",
        description: "Compartilhe o código com seu amigo para começar.",
      });
      queryClient.invalidateQueries({ queryKey: ['matching-sessions'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar sessão",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Join a session by code
export const useJoinSession = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionCode: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Find session by code
      const { data: sessions, error: sessionError } = await (supabase as any)
        .from('matching_sessions')
        .select('*')
        .eq('session_code', sessionCode);

      if (sessionError) throw sessionError;
      if (!sessions || sessions.length === 0) throw new Error('Sessão não encontrada');
      
      const session = sessions[0];
      if (session.participants.length >= 2) throw new Error('Sessão já está cheia');
      if (session.participants.includes(user.user.id)) throw new Error('Você já está nesta sessão');

      // Add user to participants
      const { data, error } = await (supabase as any)
        .from('matching_sessions')
        .update({
          participants: [...session.participants, user.user.id],
          status: 'active'
        })
        .eq('id', session.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Sessão encontrada!",
        description: "Você entrou na sessão com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['matching-sessions'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao entrar na sessão",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Get session details
export const useSession = (sessionId: string) => {
  return useQuery({
    queryKey: ['matching-session', sessionId],
    queryFn: async (): Promise<MatchingSession | null> => {
      if (!sessionId) return null;

      const { data, error } = await (supabase as any)
        .from('matching_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
  });
};

// Create a swipe
export const useSwipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, restaurantId, liked }: { sessionId: string; restaurantId: string; liked: boolean }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await (supabase as any)
        .from('user_swipes')
        .insert({
          session_id: sessionId,
          user_id: user.user.id,
          restaurant_id: restaurantId,
          liked
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-swipes'] });
      queryClient.invalidateQueries({ queryKey: ['user-matches'] });
    },
  });
};

// Get user's swipes for a session
export const useSessionSwipes = (sessionId: string) => {
  return useQuery({
    queryKey: ['session-swipes', sessionId],
    queryFn: async (): Promise<UserSwipe[]> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await (supabase as any)
        .from('user_swipes')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!sessionId,
  });
};

// Get user's matches
export const useUserMatches = () => {
  return useQuery({
    queryKey: ['user-matches'],
    queryFn: async (): Promise<UserMatch[]> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await (supabase as any)
        .from('user_matches')
        .select(`
          *,
          restaurants (
            id,
            name,
            image_url,
            rating,
            category
          )
        `)
        .or(`user1_id.eq.${user.user.id},user2_id.eq.${user.user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

// Check for new matches in a session
export const useSessionMatches = (sessionId: string) => {
  return useQuery({
    queryKey: ['session-matches', sessionId],
    queryFn: async (): Promise<UserMatch[]> => {
      if (!sessionId) return [];

      const { data, error } = await (supabase as any)
        .from('user_matches')
        .select(`
          *,
          restaurants (
            id,
            name,
            image_url,
            rating,
            category
          )
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!sessionId,
    refetchInterval: 3000, // Check for new matches every 3 seconds
  });
};