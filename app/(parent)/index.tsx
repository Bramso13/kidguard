import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { PhoneSharingButton, DashboardStats, ConfirmationDialog } from '@/components/parent';
import { ChildProfile } from '@/lib/types';
import { useTranslation } from '@/hooks/useTranslation';

// Mock data for demonstration - will be replaced with API calls
const MOCK_CHILDREN: ChildProfile[] = [
  {
    id: '1',
    parentId: '1',
    name: 'Sophie',
    age: 8,
    avatar: null,
    difficultyLevel: 'easy',
    exerciseTypes: ['math', 'reading'],
    timeRewardMinutes: 15,
    blockedAppCategories: ['all'],
    totalPoints: 150,
    totalStars: 12,
    currentStreak: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    parentId: '1',
    name: 'Lucas',
    age: 11,
    avatar: null,
    difficultyLevel: 'medium',
    exerciseTypes: ['math', 'logic', 'vocabulary'],
    timeRewardMinutes: 20,
    blockedAppCategories: ['social', 'games'],
    totalPoints: 320,
    totalStars: 28,
    currentStreak: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ParentDashboard() {
  const { t } = useTranslation();
  const [children] = useState<ChildProfile[]>(MOCK_CHILDREN);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [isLoading] = useState(false);

  // Mock stats - will be replaced with real data
  const stats = {
    childrenCount: children.length,
    totalExercisesToday: 8,
    totalTimeEarned: 120,
  };

  const handlePhoneSharingPress = (child: ChildProfile) => {
    setSelectedChild(child);
  };

  const handleConfirmActivation = () => {
    // TODO: Implement child mode activation
    console.log('Activating child mode for:', selectedChild?.name);
    setSelectedChild(null);
  };

  const handleDismissDialog = () => {
    setSelectedChild(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {t('parent.dashboard')}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Gérez le temps d'écran de vos enfants
        </Text>
      </View>

      <DashboardStats
        childrenCount={stats.childrenCount}
        totalExercisesToday={stats.totalExercisesToday}
        totalTimeEarned={stats.totalTimeEarned}
      />

      <View style={styles.childrenSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Partage de téléphone
        </Text>
        {children.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyStateText}>
              Ajoutez votre premier enfant pour commencer
            </Text>
          </View>
        ) : (
          children.map((child) => (
            <PhoneSharingButton
              key={child.id}
              child={child}
              onPress={() => handlePhoneSharingPress(child)}
            />
          ))
        )}
      </View>

      <ConfirmationDialog
        visible={selectedChild !== null}
        childName={selectedChild?.name || ''}
        onConfirm={handleConfirmActivation}
        onDismiss={handleDismissDialog}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontWeight: 'bold',
    color: '#1E3A5F', // Calming blue
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748B',
  },
  childrenSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
    color: '#1E3A5F',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#64748B',
    textAlign: 'center',
  },
});
