/**
 * Prompt templates for exercise generation
 * Templates are organized by subject type and difficulty level
 */

import type { ExerciseType, DifficultyLevel } from '@/lib/types';

export interface PromptParams {
  age: number;
  difficulty: DifficultyLevel;
  type: ExerciseType;
  count?: number;
}

/**
 * Génère le prompt pour créer des exercices
 */
export function buildExercisePrompt(params: PromptParams): string {
  const { age, difficulty, type, count = 1 } = params;

  const ageRange = getAgeRange(age);
  const difficultyDescription = getDifficultyDescription(difficulty);
  const typeInstructions = getTypeInstructions(type, difficulty);

  return `Tu es un expert en création d'exercices éducatifs pour enfants français. Génère ${count} exercice(s) ${type} pour un enfant de ${age} ans (niveau ${difficulty}).

Tranche d'âge: ${ageRange}
Difficulté: ${difficultyDescription}
Type: ${type}

${typeInstructions}

Contraintes:
- Questions claires et adaptées à l'âge
- En français, avec un vocabulaire approprié
- Réponses courtes et précises
- 2-3 indices progressifs
- Format ludique et engageant

Réponds UNIQUEMENT avec un tableau JSON dans ce format:
[
  {
    "question": "Question en français",
    "correctAnswer": "Réponse courte",
    "hints": ["Indice 1", "Indice 2", "Indice 3"],
    "topic": "Thème spécifique"
  }
]

${count > 1 ? `Génère exactement ${count} exercices différents et variés.` : ''}`;
}

/**
 * Détermine la tranche d'âge
 */
function getAgeRange(age: number): string {
  if (age <= 8) return '6-8 ans';
  if (age <= 11) return '9-11 ans';
  return '12-14 ans';
}

/**
 * Description de la difficulté
 */
function getDifficultyDescription(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 'easy':
      return 'Facile - Concepts de base, questions simples';
    case 'medium':
      return 'Moyen - Concepts intermédiaires, nécessite réflexion';
    case 'hard':
      return 'Difficile - Concepts avancés, problèmes complexes';
  }
}

/**
 * Instructions spécifiques par type d'exercice
 */
function getTypeInstructions(
  type: ExerciseType,
  difficulty: DifficultyLevel
): string {
  switch (type) {
    case 'math':
      return getMathInstructions(difficulty);
    case 'reading':
      return getReadingInstructions(difficulty);
    case 'logic':
      return getLogicInstructions(difficulty);
    case 'vocabulary':
      return getVocabularyInstructions(difficulty);
  }
}

function getMathInstructions(difficulty: DifficultyLevel): string {
  const instructions = {
    easy: `Mathématiques faciles:
- Additions/soustractions simples (nombres < 20)
- Compter des objets
- Reconnaître des formes
- Comparaisons (plus grand/petit)`,

    medium: `Mathématiques moyennes:
- Additions/soustractions (nombres < 100)
- Multiplications simples (tables jusqu'à 5)
- Fractions simples (1/2, 1/4)
- Problèmes en contexte`,

    hard: `Mathématiques difficiles:
- Opérations mixtes (nombres < 1000)
- Tables de multiplication complètes
- Fractions et décimales
- Problèmes à plusieurs étapes`,
  };

  return instructions[difficulty];
}

function getReadingInstructions(difficulty: DifficultyLevel): string {
  const instructions = {
    easy: `Lecture facile:
- Phrases courtes (5-10 mots)
- Compréhension directe
- Questions sur qui/quoi
- Vocabulaire simple`,

    medium: `Lecture moyenne:
- Court paragraphe (3-5 phrases)
- Questions sur le sens
- Inférences simples
- Vocabulaire élargi`,

    hard: `Lecture difficile:
- Texte plus long (2-3 paragraphes)
- Analyse et interprétation
- Cause et effet
- Vocabulaire riche`,
  };

  return instructions[difficulty];
}

function getLogicInstructions(difficulty: DifficultyLevel): string {
  const instructions = {
    easy: `Logique facile:
- Suites simples (couleurs, formes)
- Catégorisation basique
- Associations évidentes
- Puzzles visuels simples`,

    medium: `Logique moyenne:
- Suites numériques
- Catégorisation complexe
- Devinettes logiques
- Relations cause-effet`,

    hard: `Logique difficile:
- Suites complexes
- Raisonnement déductif
- Énigmes à plusieurs niveaux
- Logique mathématique`,
  };

  return instructions[difficulty];
}

function getVocabularyInstructions(difficulty: DifficultyLevel): string {
  const instructions = {
    easy: `Vocabulaire facile:
- Mots du quotidien
- Synonymes simples
- Contraires évidents
- Définitions basiques`,

    medium: `Vocabulaire moyen:
- Mots plus variés
- Synonymes et antonymes
- Expressions courantes
- Familles de mots`,

    hard: `Vocabulaire difficile:
- Mots abstraits
- Expressions idiomatiques
- Registres de langue
- Nuances de sens`,
  };

  return instructions[difficulty];
}
