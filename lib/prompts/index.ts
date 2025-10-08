/**
 * Point d'entrée principal pour les prompts de génération d'exercices
 * Story 3.2: Design Exercise Generation Prompts
 */

export * from './types';
export * from './age-guidelines';
export * from './math-prompts';
export * from './reading-prompts';
export * from './logic-prompts';
export * from './vocabulary-prompts';

import { PromptTemplate, ExerciseType } from './types';
import { mathPromptTemplate } from './math-prompts';
import { readingPromptTemplate } from './reading-prompts';
import { logicPromptTemplate } from './logic-prompts';
import { vocabularyPromptTemplate } from './vocabulary-prompts';

/**
 * Registre de tous les templates de prompts disponibles
 */
export const PROMPT_TEMPLATES: Record<ExerciseType, PromptTemplate> = {
  math: mathPromptTemplate,
  reading: readingPromptTemplate,
  logic: logicPromptTemplate,
  vocabulary: vocabularyPromptTemplate,
};

/**
 * Obtenir le template de prompt pour un type d'exercice
 */
export function getPromptTemplate(type: ExerciseType): PromptTemplate {
  const template = PROMPT_TEMPLATES[type];
  if (!template) {
    throw new Error(`Template de prompt introuvable pour le type: ${type}`);
  }
  return template;
}

/**
 * Configuration par défaut pour DeepSeek
 */
export const DEFAULT_DEEPSEEK_CONFIG = {
  model: 'deepseek-chat',
  temperature: 0.7, // Un peu de créativité mais pas trop
  maxTokens: 500, // Suffisant pour les exercices
  language: 'fr' as const,
  outputFormat: 'json' as const,
};

/**
 * Exemples d'utilisation des templates
 */
export const USAGE_EXAMPLES = {
  generation: `
// Générer un exercice de mathématiques
import { getPromptTemplate } from '@/lib/prompts';

const mathTemplate = getPromptTemplate('math');
const params = {
  ageRange: '9-11' as const,
  difficulty: 'medium' as const,
  subject: 'math' as const
};

const systemPrompt = mathTemplate.systemPrompt;
const userPrompt = mathTemplate.userPromptTemplate(params);

// Appeler DeepSeek avec ces prompts...
`,
  validation: `
// Valider une réponse d'enfant
import { getPromptTemplate } from '@/lib/prompts';

const mathTemplate = getPromptTemplate('math');
const validationParams = {
  question: "Combien font 5 + 3 ?",
  correctAnswer: "8",
  childAnswer: "huit",
  ageRange: '6-8' as const,
  exerciseType: 'math' as const
};

const validationPrompt = mathTemplate.validationPromptTemplate(validationParams);

// Appeler DeepSeek avec ce prompt...
`
};
