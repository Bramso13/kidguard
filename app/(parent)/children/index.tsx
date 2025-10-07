import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card } from 'react-native-paper';
import type { ChildProfile } from '@/lib/types';

export default function ChildrenListScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<ChildProfile[]>([]);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      // TODO: Implémenter l'API GET /api/child/profile pour récupérer tous les enfants
      // Pour l'instant, simulons une liste vide
      setChildren([]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChildCard = ({ item }: { item: ChildProfile }) => (
    <TouchableOpacity
      onPress={() => router.push(`/children/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.childName}>{item.name}</Text>
              <Text style={styles.childAge}>{item.age} ans</Text>
            </View>
          </View>
          <View style={styles.exerciseTypes}>
            <Text style={styles.exerciseTypesLabel}>Types d'exercices:</Text>
            <View style={styles.exerciseTypesList}>
              {item.exerciseTypes.map((type) => (
                <View key={type} style={styles.exerciseTypeBadge}>
                  <Text style={styles.exerciseTypeBadgeText}>
                    {type === 'math' && 'Math'}
                    {type === 'reading' && 'Lecture'}
                    {type === 'logic' && 'Logique'}
                    {type === 'vocabulary' && 'Vocabulaire'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes enfants</Text>
        <Button
          mode="contained"
          onPress={() => router.push('/children/new' as any)}
          style={styles.addButton}
        >
          Ajouter un enfant
        </Button>
      </View>

      {children.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Aucun enfant pour le moment</Text>
          <Text style={styles.emptyStateText}>
            Ajoutez votre premier enfant pour commencer
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/children/new' as any)}
            style={styles.emptyStateButton}
          >
            Ajouter un enfant
          </Button>
        </View>
      ) : (
        <FlatList
          data={children}
          renderItem={renderChildCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#4A90E2',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  childAge: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  exerciseTypes: {
    marginTop: 8,
  },
  exerciseTypesLabel: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 6,
  },
  exerciseTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  exerciseTypeBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exerciseTypeBadgeText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#4A90E2',
  },
});