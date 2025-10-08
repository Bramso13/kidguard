import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { MetricCard } from '../../../components/analytics/MetricCard';
import { PeriodSelector } from '../../../components/analytics/PeriodSelector';
import { ExercisesChart } from '../../../components/analytics/ExercisesChart';
import { ChildSelector } from '../../../components/analytics/ChildSelector';
import { TimePeriod, AnalyticsData, DailyStats } from '../../../lib/types/analytics';

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données de démonstration (à remplacer par l'API)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    period: 'week',
    allChildren: {
      totalExercisesCompleted: 42,
      totalScreenTimeEarned: 630, // minutes
      averageCompletionTime: 125, // secondes
      trend: {
        exercises: 15,
        screenTime: 12,
        completionTime: -8,
      },
    },
    byChild: [
      {
        childId: '1',
        childName: 'Sophie',
        metrics: {
          totalExercisesCompleted: 28,
          totalScreenTimeEarned: 420,
          averageCompletionTime: 110,
          trend: {
            exercises: 20,
            screenTime: 18,
            completionTime: -10,
          },
        },
        exercisesByType: {
          math: 12,
          reading: 8,
          logic: 5,
          vocabulary: 3,
        },
        dailyStats: generateDemoData(7),
      },
      {
        childId: '2',
        childName: 'Lucas',
        metrics: {
          totalExercisesCompleted: 14,
          totalScreenTimeEarned: 210,
          averageCompletionTime: 145,
          trend: {
            exercises: 8,
            screenTime: 5,
            completionTime: -5,
          },
        },
        exercisesByType: {
          math: 6,
          reading: 4,
          logic: 2,
          vocabulary: 2,
        },
        dailyStats: generateDemoData(7),
      },
    ],
  });

  // Simulation du chargement initial
  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Appeler l'API pour récupérer les vraies données
      // const response = await fetch(`/api/analytics?period=${selectedPeriod}`);
      // const data = await response.json();
      // setAnalyticsData(data);

      // Simulation d'un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} min`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}s`;
  };

  // Récupérer les métriques à afficher selon la sélection
  const currentMetrics = selectedChildId
    ? analyticsData.byChild.find((c) => c.id === selectedChildId)?.metrics || analyticsData.allChildren
    : analyticsData.allChildren;

  const currentDailyStats: DailyStats[] = selectedChildId
    ? analyticsData.byChild.find((c) => c.childId === selectedChildId)?.dailyStats || []
    : aggregateDailyStats(analyticsData.byChild);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Chargement des statistiques...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <Text style={styles.errorHint}>Tirez vers le bas pour réessayer</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4A90E2']} />
      }
    >
      {/* Sélecteur de période */}
      <View style={styles.section}>
        <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
      </View>

      {/* Sélecteur d'enfant */}
      <View style={styles.section}>
        <ChildSelector
          children={analyticsData.byChild.map((c) => ({ id: c.childId, name: c.childName }))}
          selectedChildId={selectedChildId}
          onChildSelect={setSelectedChildId}
        />
      </View>

      {/* Section Vue d'ensemble */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Vue d'ensemble</Text>

        <MetricCard
          title="Total exercices complétés"
          value={currentMetrics.totalExercisesCompleted.toString()}
          trend={currentMetrics.trend.exercises}
          icon="✅"
        />

        <MetricCard
          title="Temps d'écran gagné"
          value={formatTime(currentMetrics.totalScreenTimeEarned)}
          trend={currentMetrics.trend.screenTime}
          icon="⏱️"
        />

        <MetricCard
          title="Temps moyen de complétion"
          value={formatDuration(currentMetrics.averageCompletionTime)}
          trend={currentMetrics.trend.completionTime}
          icon="⚡"
        />
      </View>

      {/* Section Graphiques */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Évolution</Text>
        <ExercisesChart data={currentDailyStats} />
      </View>

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </ScrollView>
  );
}

// Fonction utilitaire pour générer des données de démonstration
function generateDemoData(days: number): DailyStats[] {
  const stats: DailyStats[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    stats.push({
      date: date.toISOString(),
      exercisesCompleted: Math.floor(Math.random() * 8) + 2,
      screenTimeEarned: Math.floor(Math.random() * 120) + 30,
    });
  }

  return stats;
}

// Fonction pour agréger les stats journalières de tous les enfants
function aggregateDailyStats(children: any[]): DailyStats[] {
  const aggregated = new Map<string, DailyStats>();

  children.forEach((child) => {
    child.dailyStats.forEach((stat: DailyStats) => {
      const existing = aggregated.get(stat.date);
      if (existing) {
        existing.exercisesCompleted += stat.exercisesCompleted;
        existing.screenTimeEarned += stat.screenTimeEarned;
      } else {
        aggregated.set(stat.date, { ...stat });
      }
    });
  });

  return Array.from(aggregated.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#95A5A6',
  },
});
