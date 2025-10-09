import { authClient } from '@/lib/auth-client';
import { useRouter } from 'expo-router';

export function useAuth() {
  const router = useRouter();

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authClient.signIn.email({
        email,
        password,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erreur de connexion');
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const getSession = async () => {
    try {
      const session = await authClient.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  };

  return {
    signIn,
    signOut,
    getSession,
  };
}