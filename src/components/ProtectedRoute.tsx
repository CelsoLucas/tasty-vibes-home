import { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const hasFetchedProfileRef = useRef(false);

  const fetchUserProfile = async (userId: string) => {
    if (hasFetchedProfileRef.current) return;
    hasFetchedProfileRef.current = true;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .maybeSingle();

      if (data?.user_type) {
        setUserType(data.user_type);
      } else {
        // Fallback to customer if no profile found
        setUserType('customer');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserType('customer'); // Safe fallback
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Prioritize user_metadata.user_type
          const metadataUserType = session.user.user_metadata?.user_type;
          if (metadataUserType) {
            setUserType(metadataUserType);
            setLoading(false);
          } else {
            // Fallback to profiles table query (only once)
            setTimeout(() => {
              fetchUserProfile(session.user.id);
              setLoading(false);
            }, 0);
          }
        } else {
          setUserType(null);
          hasFetchedProfileRef.current = false;
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const metadataUserType = session.user.user_metadata?.user_type;
        if (metadataUserType) {
          setUserType(metadataUserType);
          setLoading(false);
        } else {
          fetchUserProfile(session.user.id);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }

  // Use userType from metadata or profiles, default to customer if still null
  const effectiveUserType = userType || 'customer';
  const currentPath = window.location.pathname;
  
  // If customer tries to access restaurant management routes, redirect to client home
  if (effectiveUserType === 'customer') {
    const isRestaurantDetail = /^\/restaurant\/[^/]+$/.test(currentPath);
    const isRestaurantAdminRoute = currentPath.startsWith('/restaurant/') && !isRestaurantDetail;
    if (isRestaurantAdminRoute) {
      return <Navigate to="/client/home" replace />;
    }
  }
  
  // If restaurant tries to access client routes, redirect to restaurant home
  if (effectiveUserType === 'restaurant' && currentPath.startsWith('/client/')) {
    return <Navigate to="/restaurant/home" replace />;
  }
  
  // Redirect root path based on user type
  if (currentPath === '/') {
    if (effectiveUserType === 'restaurant') {
      return <Navigate to="/restaurant/home" replace />;
    } else {
      return <Navigate to="/client/home" replace />;
    }
  }

  return <>{children}</>;
};