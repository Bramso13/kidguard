import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const session = await authClient.getSession();

      if (session?.user) {
        // User is authenticated, navigate to parent dashboard
        // TODO: Create parent dashboard and navigate there
        router.replace('/(auth)/register');
      } else {
        // User is not authenticated, navigate to register
        router.replace('/(auth)/register');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // On error, navigate to register
      router.replace('/(auth)/register');
    }
  };

  const router = useRouter();
  const { getSession } = useAuth();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await getSession();

      if (session?.user) {
        // Si l'utilisateur est connecté, rediriger vers le dashboard
        router.replace('/(parent)/dashboard');
      } else {
        // Sinon, rediriger vers la page de connexion
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      // En cas d'erreur, rediriger vers la page de connexion
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4A90E2" />
      <Text variant="bodyLarge" style={styles.loadingText}>
        Chargement...
      </Text>
      <ActivityIndicator size="large" color="#4A90E2" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
});
