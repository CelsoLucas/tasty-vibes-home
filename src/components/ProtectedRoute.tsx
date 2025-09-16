import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface UserProfile {
  user_type: string;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      setProfileLoading(true);
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Default to customer if profile not found
        setUserProfile({ user_type: 'customer' });
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile({ user_type: 'customer' });
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile from database
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }

  // Smart routing based on user type
  if (userProfile) {
    const currentPath = window.location.pathname;
    
    // If customer tries to access restaurant routes, redirect to client home
    if (userProfile.user_type === 'customer' && currentPath.startsWith('/restaurant/')) {
      return <Navigate to="/client/home" replace />;
    }
    
    // If restaurant tries to access client routes, redirect to restaurant home
    if (userProfile.user_type === 'restaurant' && currentPath.startsWith('/client/')) {
      return <Navigate to="/restaurant/home" replace />;
    }
    
    // Redirect root path based on user type
    if (currentPath === '/') {
      if (userProfile.user_type === 'restaurant') {
        return <Navigate to="/restaurant/home" replace />;
      } else {
        return <Navigate to="/client/home" replace />;
      }
    }
  }

  return <>{children}</>;
};