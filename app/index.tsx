import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Carregando...</Text>
    </View>
  );
}