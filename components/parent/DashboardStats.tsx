import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';

interface DashboardStatsProps {
  childrenCount: number;
  totalExercisesToday: number;
  totalTimeEarned: number;
}

export function DashboardStats({ childrenCount, totalExercisesToday, totalTimeEarned }: DashboardStatsProps) {
  const theme = useTheme();

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  };

  const pluralize = (count: number, singular: string, plural: string): string => {
    return count === 1 ? singular : plural;
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Aperçu du jour
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statValue}>
              {childrenCount}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              {pluralize(childrenCount, 'enfant', 'enfants')}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statValue}>
              {totalExercisesToday}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              {pluralize(totalExercisesToday, 'exercice', 'exercices')}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statValue}>
              {formatTime(totalTimeEarned)}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              temps gagné
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#2563eb', // Calming blue
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.7,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
});
