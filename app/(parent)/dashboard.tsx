import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardScreen() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>🎯 Tableau de bord Parent</Text>
        <Text style={styles.subtitle}>Bienvenue dans KidGuard!</Text>
        
        <View style={styles.info}>
          <Text style={styles.infoText}>
            Cette page sera le tableau de bord principal où vous pourrez:
          </Text>
          <Text style={styles.bulletPoint}>• Voir vos enfants</Text>
          <Text style={styles.bulletPoint}>• Activer le mode partage de téléphone</Text>
          <Text style={styles.bulletPoint}>• Consulter les statistiques</Text>
        </View>

        <Button
          title="Se déconnecter"
          onPress={handleSignOut}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 48,
  },
  info: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    marginVertical: 4,
  },
  logoutButton: {
    marginTop: 16,
  },
});