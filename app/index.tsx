import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const router = useRouter();
  const { getSession } = useAuth();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await getSession();

      if (session?.data?.user) {
        // Si l'utilisateur est connecté, rediriger vers le dashboard
        router.replace('/(parent)');
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
});
