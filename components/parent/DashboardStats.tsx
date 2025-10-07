import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DashboardStatsProps {
  stats: {
    childrenCount: number;
    totalExercisesToday: number;
    totalTimeEarnedToday: number; // in minutes
  };
}

/**
 * Dashboard Statistics Component
 * 
 * Displays at-a-glance statistics:
 * - Number of children
 * - Total exercises completed today
 * - Total time earned today
 */
export default function DashboardStats({ stats }: DashboardStatsProps) {
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aujourd'hui</Text>
      
      <View style={styles.statsRow}>
        {/* Children Count */}
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👶</Text>
          </View>
          <Text style={styles.statValue}>{stats.childrenCount}</Text>
          <Text style={styles.statLabel}>
            {stats.childrenCount > 1 ? 'Enfants' : 'Enfant'}
          </Text>
        </View>

        {/* Exercises Today */}
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📚</Text>
          </View>
          <Text style={styles.statValue}>{stats.totalExercisesToday}</Text>
          <Text style={styles.statLabel}>
            {stats.totalExercisesToday > 1 ? 'Exercices' : 'Exercice'}
          </Text>
        </View>

        {/* Time Earned Today */}
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>⏱️</Text>
          </View>
          <Text style={styles.statValue}>
            {formatTime(stats.totalTimeEarnedToday)}
          </Text>
          <Text style={styles.statLabel}>Temps gagné</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 8,
  },
  icon: {
    fontSize: 32,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C5F7C', // Calming blue
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});