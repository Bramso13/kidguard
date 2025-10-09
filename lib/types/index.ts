/**
 * Shared TypeScript types for KidGuard
 * These types are used across both frontend and backend (API routes)
 */

// Enums
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type ExerciseType = 'math' | 'reading' | 'logic' | 'vocabulary';
export type AppCategory = 'social' | 'games' | 'videos' | 'all';
export type FeedbackIssueType =
  | 'too_difficult'
  | 'too_easy'
  | 'inappropriate'
  | 'wrong_answer'
  | 'other';
export type FeedbackStatus = 'pending' | 'reviewed' | 'resolved';

// Core Models
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
  age: number; // 6-14
  avatar: string | null;
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

export interface ExerciseHistory {
  id: string;
  exerciseId: string;
  childId: string;
  childAnswer: string;
  isCorrect: boolean;
  leniencyApplied: boolean;
  feedback: string;
  attemptNumber: number;
  validationTimeMs: number;
  attemptedAt: Date;
}

export interface ChildSession {
  id: string;
  childId: string;
  parentId: string;
  deviceId: string;
  remainingTimeMinutes: number;
  isActive: boolean;
  deviceActivityMonitorName: string | null;
  startedAt: Date;
  endedAt: Date | null;
}

// Export analytics types
export * from './analytics';
