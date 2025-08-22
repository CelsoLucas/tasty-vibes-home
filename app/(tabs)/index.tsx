import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurants } from '../../hooks/useRestaurants';
import { router } from 'expo-router';

const RestaurantCard = ({ restaurant }: { restaurant: any }) => (
  <TouchableOpacity
    className="w-60 mr-4 bg-white rounded-lg shadow-sm"
    onPress={() => router.push(`/restaurant/${restaurant.id}`)}
  >
    <Image
      source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' }}
      className="w-full h-36 rounded-t-lg"
      resizeMode="cover"
    />
    <View className="p-3">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="font-semibold text-base flex-1" numberOfLines={1}>
          {restaurant.name}
        </Text>
        <View className="flex-row items-center">
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text className="text-sm font-medium ml-1">{restaurant.rating}</Text>
        </View>
      </View>
      <Text className="text-gray-600 text-sm mb-2">{restaurant.category}</Text>
      <View className="flex-row items-center">
        <Ionicons name="location-outline" size={12} color="#6b7280" />
        <Text className="text-gray-500 text-xs ml-1">{restaurant.distance}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const RestaurantSection = ({ title, restaurants }: { title: string; restaurants: any[] }) => (
  <View className="mb-6">
    <Text className="text-xl font-bold px-4 mb-4">{title}</Text>
    <FlatList
      data={restaurants}
      renderItem={({ item }) => <RestaurantCard restaurant={item} />}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    />
  </View>
);

export default function Home() {
  const { data: restaurants, isLoading, error } = useRestaurants();

  const restaurantSections = React.useMemo(() => {
    if (!restaurants || restaurants.length === 0) {
      return { bestInCity: [], bestInRegion: [], forYou: [], newRestaurants: [], topOfWeek: [] };
    }

    const chunkSize = 4;
    const chunks = [];
    for (let i = 0; i < restaurants.length; i += chunkSize) {
      chunks.push(restaurants.slice(i, i + chunkSize));
    }

    return {
      bestInCity: chunks[0] || [],
      bestInRegion: chunks[1] || [],
      forYou: chunks[2] || [],
      newRestaurants: chunks[3] || [],
      topOfWeek: chunks[4] || [],
    };
  }, [restaurants]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-600">Carregando restaurantes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500 mb-2">Erro ao carregar restaurantes</Text>
          <Text className="text-gray-600">Tente novamente mais tarde</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mr-3">
            <Text className="text-lg font-bold text-white">T</Text>
          </View>
          <Text className="text-xl font-bold text-primary">Tasty</Text>
        </View>
        <TouchableOpacity className="relative">
          <Ionicons name="notifications-outline" size={24} color="#374151" />
          <View className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <RestaurantSection title="Melhores da Cidade" restaurants={restaurantSections.bestInCity} />
        <RestaurantSection title="Melhores da Região" restaurants={restaurantSections.bestInRegion} />
        <RestaurantSection title="Para Você" restaurants={restaurantSections.forYou} />
        <RestaurantSection title="Novos Restaurantes" restaurants={restaurantSections.newRestaurants} />
        <RestaurantSection title="Top da Semana" restaurants={restaurantSections.topOfWeek} />
      </ScrollView>
    </SafeAreaView>
  );
}