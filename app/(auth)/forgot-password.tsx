import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, digite seu e-mail');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        Alert.alert('Erro', error.message);
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center mt-4 mb-8">
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#f97316" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Logo */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">T</Text>
          </View>
        </View>

        {!isSubmitted ? (
          <View>
            <Text className="text-xl font-semibold text-center mb-4">Recuperar senha</Text>
            <Text className="text-gray-600 text-center mb-8">
              Digite seu e-mail para receber um link de redefinição de senha
            </Text>

            {/* Email */}
            <View className="mb-6">
              <Text className="text-sm font-medium mb-2">E-mail</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`bg-primary py-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? 'Enviando...' : 'Enviar link de redefinição'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text className="text-xl font-semibold text-center mb-4">E-mail enviado</Text>
            <View className="items-center mb-6">
              <Ionicons name="mail" size={48} color="#10b981" />
            </View>
            <Text className="text-gray-600 text-center mb-8">
              Um e-mail foi enviado para <Text className="font-semibold">{email}</Text> com instruções para redefinir sua senha.
            </Text>

            <TouchableOpacity
              className="border border-gray-300 py-4 rounded-lg"
              onPress={() => setIsSubmitted(false)}
            >
              <Text className="text-gray-700 text-center font-semibold text-base">
                Tentar com outro e-mail
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Back to Login */}
        <View className="items-center mt-8">
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="arrow-back" size={16} color="#f97316" />
              <Text className="text-primary font-medium ml-1">Voltar para login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}