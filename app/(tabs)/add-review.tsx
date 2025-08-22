import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const experienceTags = [
  { id: "atendimento", label: "Atendimento" },
  { id: "comida", label: "Comida" },
  { id: "ambiente", label: "Ambiente" },
  { id: "custo-beneficio", label: "Custo-benefício" }
];

export default function AddReview() {
  const [restaurant, setRestaurant] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleStarPress = (starRating: number) => {
    setRating(starRating);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!restaurant || rating === 0) {
      Alert.alert('Erro', 'Por favor, selecione um restaurante e dê uma avaliação');
      return;
    }

    Alert.alert(
      'Avaliação enviada!',
      'Sua avaliação foi publicada com sucesso.',
      [{ text: 'OK' }]
    );

    // Reset form
    setRestaurant('');
    setRating(0);
    setComment('');
    setSelectedTags([]);
    setPhotos([]);
  };

  const getRatingText = () => {
    switch (rating) {
      case 1: return "Muito ruim";
      case 2: return "Ruim";
      case 3: return "Regular";
      case 4: return "Bom";
      case 5: return "Excelente";
      default: return "";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-bold text-center">Adicionar Avaliação</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Restaurant Search */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm">
          <View className="p-4">
            <Text className="text-lg font-semibold mb-3">Restaurante</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
              <Ionicons name="search" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Buscar restaurante..."
                value={restaurant}
                onChangeText={setRestaurant}
              />
              <TouchableOpacity>
                <Ionicons name="qr-code" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Rating */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm">
          <View className="p-4">
            <Text className="text-lg font-semibold mb-3">Sua avaliação</Text>
            <View className="items-center">
              <View className="flex-row mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleStarPress(star)}
                    className="mx-1"
                  >
                    <Ionicons
                      name="star"
                      size={32}
                      color={star <= rating ? "#fbbf24" : "#d1d5db"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {rating > 0 && (
                <Text className="text-gray-600 text-sm">{getRatingText()}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Comment */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm">
          <View className="p-4">
            <Text className="text-lg font-semibold mb-3">Comentário</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base min-h-[120px]"
              placeholder="Compartilhe sua experiência..."
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Photos */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm">
          <View className="p-4">
            <Text className="text-lg font-semibold mb-3">Fotos</Text>
            
            {photos.length > 0 && (
              <View className="flex-row flex-wrap mb-4">
                {photos.map((photo, index) => (
                  <View key={index} className="relative mr-3 mb-3">
                    <Image
                      source={{ uri: photo }}
                      className="w-20 h-20 rounded-lg"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                      onPress={() => removePhoto(index)}
                    >
                      <Ionicons name="close" size={14} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {photos.length < 5 && (
              <TouchableOpacity
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center"
                onPress={pickImage}
              >
                <Ionicons name="camera" size={24} color="#6b7280" />
                <Text className="text-gray-600 mt-2">
                  Adicionar fotos ({photos.length}/5)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Experience Tags */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm">
          <View className="p-4">
            <Text className="text-lg font-semibold mb-3">Experiência</Text>
            <View className="flex-row flex-wrap">
              {experienceTags.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
                    selectedTags.includes(tag.id)
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-300'
                  }`}
                  onPress={() => handleTagToggle(tag.id)}
                >
                  <Text className={`font-medium ${
                    selectedTags.includes(tag.id) ? 'text-white' : 'text-gray-700'
                  }`}>
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View className="mx-4 mt-6 mb-8">
          <TouchableOpacity
            className={`py-4 rounded-lg ${
              !restaurant || rating === 0 ? 'bg-gray-300' : 'bg-primary'
            }`}
            onPress={handleSubmit}
            disabled={!restaurant || rating === 0}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Publicar Avaliação
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}