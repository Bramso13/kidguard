/**
 * Types TypeScript pour l'intégration DeepSeek API
 */

// Configuration DeepSeek
export interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxRetries: number;
  timeout: number;
}

// Requête DeepSeek API
export interface DeepSeekChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekChatRequest {
  model: string;
  messages: DeepSeekChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

// Réponse DeepSeek API
export interface DeepSeekChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Erreurs DeepSeek
export class DeepSeekError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'DeepSeekError';
  }
}

export class DeepSeekRateLimitError extends DeepSeekError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, true);
    this.name = 'DeepSeekRateLimitError';
  }
}

export class DeepSeekTimeoutError extends DeepSeekError {
  constructor(message: string = 'Request timeout') {
    super(message, 408, true);
    this.name = 'DeepSeekTimeoutError';
  }
}

export class DeepSeekNetworkError extends DeepSeekError {
  constructor(message: string = 'Network error') {
    super(message, undefined, true);
    this.name = 'DeepSeekNetworkError';
  }
}

// Types pour la génération d'exercices
export interface ExerciseGenerationParams {
  childAge: number;
  difficulty: 'easy' | 'medium' | 'hard';
  exerciseType: 'math' | 'reading' | 'logic' | 'vocabulary';
  count?: number;
}

export interface GeneratedExercise {
  question: string;
  correctAnswer: string;
  hints: string[];
  topic: string;
  ageRange: string;
}

// Types pour la validation de réponses
export interface AnswerValidationParams {
  question: string;
  correctAnswer: string;
  childAnswer: string;
  childAge: number;
  exerciseType: string;
}

export interface AnswerValidationResult {
  isCorrect: boolean;
  feedback: string;
  leniencyApplied: boolean;
  reasoning?: string;
}

// Métriques et monitoring
export interface DeepSeekMetrics {
  requestId: string;
  timestamp: Date;
  operation: 'generate' | 'validate';
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  responseTimeMs: number;
  cost: number;
  success: boolean;
  errorType?: string;
}

export interface CostCalculation {
  promptTokens: number;
  completionTokens: number;
  totalCost: number;
  pricePerPromptToken: number;
  pricePerCompletionToken: number;
}
