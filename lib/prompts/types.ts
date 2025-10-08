/**
 * Types pour les prompts de génération d'exercices
 * Story 3.2: Design Exercise Generation Prompts
 */

export type AgeRange = '6-8' | '9-11' | '12-14';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type ExerciseType = 'math' | 'reading' | 'logic' | 'vocabulary';

/**
 * Paramètres pour générer un exercice
 */
export interface ExerciseGenerationParams {
  ageRange: AgeRange;
  difficulty: DifficultyLevel;
  subject: ExerciseType;
  count?: number; // Nombre d'exercices à générer (par défaut 1)
}

/**
 * Format de sortie attendu pour un exercice généré
 */
export interface GeneratedExercise {
  question: string;
  answer: string;
  hints: string[];
  type: ExerciseType;
  difficulty: DifficultyLevel;
  ageRange: AgeRange;
}

/**
 * Paramètres pour valider une réponse
 */
export interface AnswerValidationParams {
  question: string;
  correctAnswer: string;
  childAnswer: string;
  ageRange: AgeRange;
  exerciseType: ExerciseType;
}

/**
 * Résultat de validation d'une réponse
 */
export interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  leniencyApplied: boolean;
}

/**
 * Template de prompt pour un type d'exercice
 */
export interface PromptTemplate {
  type: ExerciseType;
  systemPrompt: string;
  userPromptTemplate: (params: ExerciseGenerationParams) => string;
  validationPromptTemplate: (params: AnswerValidationParams) => string;
  examples: GeneratedExercise[];
}

/**
 * Guidelines de complexité par âge
 */
export interface AgeGuidelines {
  ageRange: AgeRange;
  cognitiveLevel: string;
  attention: string;
  languageLevel: string;
  mathLevel: string;
  readingLevel: string;
  examples: string[];
}

/**
 * Configuration globale des prompts
 */
export interface PromptConfig {
  language: 'fr'; // Français uniquement pour MVP
  outputFormat: 'json';
  maxTokens: number;
  temperature: number;
  model: string; // DeepSeek model version
}
