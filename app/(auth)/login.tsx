import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Erro no login', error.message);
        return;
      }

      if (data.user) {
        router.replace('/(tabs)');
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

          {/* Login Form */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-center mb-8">Entrar</Text>
            
            {/* Email */}
            <View className="mb-4">
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

            {/* Password */}
            <View className="mb-6">
              <Text className="text-sm font-medium mb-2">Senha</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
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

            {/* Login Button */}
            <TouchableOpacity
              className={`bg-primary py-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? 'Entrando...' : 'Entrar'}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <View className="items-center mt-4">
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-medium">Esqueci minha senha</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Sign Up Link */}
          <View className="items-center">
            <Text className="text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/(auth)/register" asChild>
                <Text className="text-primary font-medium">Criar conta</Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}