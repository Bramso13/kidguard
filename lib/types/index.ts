// Shared TypeScript types for KidGuard
// This file will contain interfaces for data models used across frontend and backend

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type ExerciseType = 'math' | 'reading' | 'logic' | 'vocabulary';
export type AppCategory = 'social' | 'games' | 'videos' | 'all';

// Placeholder types - will be populated with actual data models from architecture
export interface ParentUser {
  id: string;
  email: string;
  emailVerified: boolean;
  pinHash: string;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  age: number;
  avatar: string | null;
  difficultyLevel: DifficultyLevel;
  exerciseTypes: ExerciseType[];
  timeRewardMinutes: number;
  blockedAppCategories: AppCategory[];
  totalPoints: number;
  totalStars: number;
  currentStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  childId: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  question: string;
  correctAnswer: string;
  hints: string[];
  metadata: {
    ageRange: string;
    topic?: string;
    deepseekModel?: string;
    generatedAt: string;
  };
  isFallback: boolean;
  usedAt: Date | null;
  createdAt: Date;
}
