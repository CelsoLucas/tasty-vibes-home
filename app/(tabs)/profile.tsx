import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

const mockReviews = [
  {
    id: 1,
    restaurant: "Burger Palace",
    rating: 5,
    comment: "Excelente hambúrguer! O melhor da cidade, sem dúvida.",
    date: "2024-01-15"
  },
  {
    id: 2,
    restaurant: "Pasta Italiana",
    rating: 4,
    comment: "Massa muito boa, mas o molho poderia ter mais tempero.",
    date: "2024-01-10"
  }
];

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: profileData } = await (supabase as any)
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-600">Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-bold text-center">Perfil</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm">
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mr-4">
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    className="w-20 h-20 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={40} color="#6b7280" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold">
                  {profile?.display_name || user?.email?.split('@')[0] || 'Usuário'}
                </Text>
                <Text className="text-gray-600 mt-1">
                  {profile?.bio || 'Amante da boa comida'}
                </Text>
                <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-lg mt-2 self-start">
                  <Text className="text-gray-700 font-medium">Editar Perfil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row mx-4 mt-4 space-x-4">
          <View className="flex-1 bg-white rounded-lg shadow-sm p-4 items-center">
            <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mb-2">
              <Ionicons name="trophy" size={20} color="#f59e0b" />
            </View>
            <Text className="text-gray-600 text-sm">Nível</Text>
            <Text className="text-2xl font-bold">Iniciante</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg shadow-sm p-4 items-center">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-2">
              <Ionicons name="location" size={20} color="#10b981" />
            </View>
            <Text className="text-gray-600 text-sm">Restaurantes</Text>
            <Text className="text-2xl font-bold">0</Text>
          </View>
        </View>

        {/* My Reviews */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm">
          <View className="p-4">
            <Text className="text-lg font-semibold mb-4">Minhas Avaliações</Text>
            {mockReviews.map((review) => (
              <View key={review.id} className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:mb-0">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-medium flex-1">{review.restaurant}</Text>
                  <View className="flex-row">
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name="star"
                        size={14}
                        color={i < review.rating ? "#fbbf24" : "#d1d5db"}
                      />
                    ))}
                  </View>
                </View>
                <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                  {review.comment}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {new Date(review.date).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm">
          <View className="p-4">
            <Text className="text-lg font-semibold mb-4">Configurações</Text>
            
            <TouchableOpacity className="flex-row items-center py-3">
              <Ionicons name="person-outline" size={20} color="#374151" />
              <Text className="flex-1 ml-3 text-base">Editar Perfil</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-3">
              <Ionicons name="settings-outline" size={20} color="#374151" />
              <Text className="flex-1 ml-3 text-base">Informações Pessoais</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-3">
              <Ionicons name="options-outline" size={20} color="#374151" />
              <Text className="flex-1 ml-3 text-base">Preferências</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center py-3"
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text className="flex-1 ml-3 text-base text-red-500">Sair</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}