/**
 * Types TypeScript pour les analytics
 */

export type TimePeriod = 'today' | 'week' | 'month';

export interface AnalyticsMetrics {
  totalExercisesCompleted: number;
  totalScreenTimeEarned: number; // en minutes
  averageCompletionTime: number; // en secondes
  trend: {
    exercises: number; // pourcentage de changement
    screenTime: number;
    completionTime: number;
  };
}

export interface ExercisesByType {
  math: number;
  reading: number;
  logic: number;
  vocabulary: number;
}

export interface DailyStats {
  date: string;
  exercisesCompleted: number;
  screenTimeEarned: number;
}

export interface ChildAnalytics {
  childId: string;
  childName: string;
  metrics: AnalyticsMetrics;
  exercisesByType: ExercisesByType;
  dailyStats: DailyStats[];
}

export interface AnalyticsData {
  period: TimePeriod;
  allChildren: AnalyticsMetrics;
  byChild: ChildAnalytics[];
}
