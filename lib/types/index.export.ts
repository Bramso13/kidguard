/**
 * Export des types DeepSeek pour utilisation dans l'application
 */

export * from './deepseek';

// Réexport des types existants
export type {
  DifficultyLevel,
  ExerciseType,
  AppCategory,
  FeedbackIssueType,
  FeedbackStatus,
  ParentUser,
  ChildProfile,
  Exercise,
  ExerciseHistory,
  ChildSession,
} from './index';
