import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth-client';

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

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4A90E2" />
      <Text variant="bodyLarge" style={styles.loadingText}>
        Chargement...
      </Text>
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
