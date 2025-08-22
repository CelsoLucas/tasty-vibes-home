import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.fullName,
          }
        }
      });

      if (error) {
        Alert.alert('Erro no cadastro', error.message);
        return;
      }

      if (data.user) {
        Alert.alert(
          'Cadastro realizado!',
          'Sua conta foi criada com sucesso.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6">
          {/* Logo */}
          <View className="items-center mt-16 mb-12">
            <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
              <Text className="text-2xl font-bold text-white">T</Text>
            </View>
            <Text className="text-2xl font-bold text-primary">Tasty</Text>
          </View>

          {/* Register Form */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-center mb-8">Criar conta</Text>
            
            {/* Full Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">Nome completo</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
                <Ionicons name="person-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="Seu nome completo"
                  value={formData.fullName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                />
              </View>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">E-mail</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">Senha</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-sm font-medium mb-2">Confirmar senha</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`bg-primary py-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="items-center mb-8">
            <Text className="text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/(auth)/login" asChild>
                <Text className="text-primary font-medium">Entrar</Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}