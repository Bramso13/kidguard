import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Button,
  Card,
  ActivityIndicator,
  FAB,
  Avatar,
} from 'react-native-paper';
import { useRouter } from 'expo-router';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ChildrenListScreen() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/child/profile');

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des enfants');
      }

      const data = await response.json();
      setChildren(data);
    } catch (err: any) {
      setError(err.message);
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error && children.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchChildren} style={styles.retryButton}>
          Réessayer
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={styles.title}>
          Profils des enfants
        </Text>

        {children.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.emptyTitle}>
                Aucun enfant ajouté
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Ajoutez votre premier enfant pour commencer
              </Text>
            </Card.Content>
          </Card>
        ) : (
          children.map((child) => (
            <Card
              key={child.id}
              style={styles.childCard}
              onPress={() => router.push(`/(parent)/children/${child.id}`)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.avatarContainer}>
                  {child.avatar ? (
                    <Avatar.Text size={60} label={child.avatar} />
                  ) : (
                    <Avatar.Text
                      size={60}
                      label={getAvatarInitials(child.name)}
                    />
                  )}
                </View>
                <View style={styles.childInfo}>
                  <Text variant="titleLarge">{child.name}</Text>
                  <Text variant="bodyMedium" style={styles.ageText}>
                    {child.age} ans
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        label="Ajouter un enfant"
        style={styles.fab}
        onPress={() => router.push('/(parent)/children/new')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  childCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  childInfo: {
    flex: 1,
  },
  ageText: {
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});