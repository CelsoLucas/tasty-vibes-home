import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: "lanches", name: "Lanches", emoji: "🍔" },
  { id: "massas", name: "Massas", emoji: "🍝" },
  { id: "japones", name: "Japonês", emoji: "🍣" },
  { id: "pizza", name: "Pizza", emoji: "🍕" },
  { id: "saudavel", name: "Saudável", emoji: "🥗" },
  { id: "cafes", name: "Cafés", emoji: "☕" }
];

const mockResults = [
  {
    id: 1,
    name: "Burger Palace",
    category: "Lanches",
    rating: 4.5,
    distance: "0.8 km",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
  },
  {
    id: 2,
    name: "Pasta House",
    category: "Massas", 
    rating: 4.2,
    distance: "1.2 km",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400"
  },
  {
    id: 3,
    name: "Sushi Express",
    category: "Japonês",
    rating: 4.8,
    distance: "2.1 km", 
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400"
  }
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [results, setResults] = useState(mockResults);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setResults(mockResults);
    } else {
      const filtered = mockResults.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategory);
    
    if (newCategory) {
      const filtered = mockResults.filter(item =>
        item.category.toLowerCase().includes(newCategory.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(mockResults);
    }
  };

  const renderResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="flex-row bg-white rounded-lg shadow-sm mb-3 overflow-hidden">
      <Image
        source={{ uri: item.image }}
        className="w-24 h-24"
        resizeMode="cover"
      />
      <View className="flex-1 p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="font-semibold text-base flex-1" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text className="text-sm font-medium ml-1">{item.rating}</Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          <View className="bg-gray-100 px-2 py-1 rounded">
            <Text className="text-xs text-gray-700">{item.category}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-1">{item.distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-bold text-center">Buscar</Text>
      </View>

      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Buscar restaurantes, pratos..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity>
            <Ionicons name="options" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View className="bg-white px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`flex-row items-center px-4 py-2 rounded-full border ${
                  selectedCategory === category.id
                    ? 'bg-primary border-primary'
                    : 'bg-white border-gray-300'
                }`}
                onPress={() => handleCategorySelect(category.id)}
              >
                <Text className="text-lg mr-2">{category.emoji}</Text>
                <Text className={`font-medium ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-700'
                }`}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Results */}
      <View className="flex-1 px-4 py-4">
        {results.length > 0 ? (
          <View>
            <Text className="text-lg font-semibold mb-4">
              {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
            </Text>
            <FlatList
              data={results}
              renderItem={renderResultItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
              <Ionicons name="search" size={40} color="#9ca3af" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum resultado encontrado
            </Text>
            <Text className="text-gray-600 text-center max-w-sm">
              Tente buscar por outro termo ou explore diferentes categorias
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}