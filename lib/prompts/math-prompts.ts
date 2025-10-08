/**
 * Templates de prompts pour les exercices de mathématiques
 * Story 3.2: Design Exercise Generation Prompts
 */

import {
  PromptTemplate,
  ExerciseGenerationParams,
  AnswerValidationParams,
  GeneratedExercise
} from './types';
import { getAgeGuidelines, getLeniencyLevel } from './age-guidelines';

/**
 * Prompt système pour la génération d'exercices de mathématiques
 */
const MATH_SYSTEM_PROMPT = `Tu es un expert en pédagogie mathématique pour enfants francophones.
Tu génères des exercices de mathématiques AMUSANTS et ENGAGEANTS qui ressemblent à des mini-jeux.

RÈGLES STRICTES:
1. Toujours en français parfait
2. Exercices ludiques et contextualisés (éviter "Calcule: 5+3")
3. Utiliser des situations concrètes et familières aux enfants
4. Format de sortie: JSON strict avec les champs: question, answer, hints, type, difficulty, ageRange
5. Les hints doivent être progressifs (du plus vague au plus précis)
6. La réponse doit être claire et unique (nombre ou expression mathématique)

STYLE:
- Langage positif et encourageant
- Scénarios imaginatifs (animaux, jeux, sports, bonbons, etc.)
- Faire sentir l'exercice comme un défi amusant, pas comme un devoir`;

/**
 * Générer le prompt utilisateur pour un exercice de maths
 */
function generateMathUserPrompt(params: ExerciseGenerationParams): string {
  const { ageRange, difficulty } = params;
  const guidelines = getAgeGuidelines(ageRange);
  
  let difficultyInstructions = '';
  
  if (difficulty === 'easy') {
    difficultyInstructions = 'FACILE - Exercice simple et direct avec de petits nombres';
  } else if (difficulty === 'medium') {
    difficultyInstructions = 'MOYEN - Exercice à une ou deux étapes avec nombres modérés';
  } else {
    difficultyInstructions = 'DIFFICILE - Exercice complexe nécessitant plusieurs étapes de raisonnement';
  }
  
  // Instructions spécifiques par âge
  let ageSpecificInstructions = '';
  
  if (ageRange === '6-8') {
    ageSpecificInstructions = `
NIVEAU 6-8 ANS:
- Nombres de 0 à 20 maximum
- Addition et soustraction simple
- Début de la multiplication (tables de 2, 5, 10)
- Utiliser des objets concrets (pommes, balles, crayons)
- Phrases très courtes et simples`;
  } else if (ageRange === '9-11') {
    ageSpecificInstructions = `
NIVEAU 9-11 ANS:
- Nombres jusqu'à 1000
- Les quatre opérations (addition, soustraction, multiplication, division)
- Fractions simples (1/2, 1/4, 1/3)
- Problèmes à 2-3 étapes
- Contextes plus variés (argent, mesures, temps)`;
  } else {
    ageSpecificInstructions = `
NIVEAU 12-14 ANS:
- Nombres grands, décimaux, négatifs
- Algèbre de base (équations simples avec x)
- Fractions complexes, pourcentages, proportions
- Géométrie (périmètre, aire, volume)
- Problèmes multi-étapes avec raisonnement logique`;
  }

  return `Génère UN exercice de mathématiques unique avec ces paramètres:

TRANCHE D'ÂGE: ${ageRange} ans
DIFFICULTÉ: ${difficultyInstructions}

${ageSpecificInstructions}

GUIDELINES COGNITIVES:
- Niveau cognitif: ${guidelines.cognitiveLevel}
- Niveau mathématique: ${guidelines.mathLevel}
- Attention: ${guidelines.attention}

IMPORTANT:
- Rends l'exercice FUN avec une histoire ou un contexte amusant
- La question doit être claire et précise
- La réponse doit être un nombre ou une expression mathématique simple
- Fournis 3 hints progressifs en cas d'erreur

Réponds UNIQUEMENT avec un JSON valide dans ce format exact:
{
  "question": "...",
  "answer": "...",
  "hints": ["hint1", "hint2", "hint3"],
  "type": "math",
  "difficulty": "${difficulty}",
  "ageRange": "${ageRange}"
}`;
}

/**
 * Générer le prompt de validation pour une réponse mathématique
 */
function generateMathValidationPrompt(params: AnswerValidationParams): string {
  const { question, correctAnswer, childAnswer, ageRange } = params;
  const leniency = getLeniencyLevel(ageRange);
  
  return `Tu es un correcteur bienveillant d'exercices de mathématiques pour enfants.

EXERCICE:
Question: ${question}
Réponse attendue: ${correctAnswer}
Réponse de l'enfant: ${childAnswer}
Âge de l'enfant: ${ageRange} ans

NIVEAU DE TOLÉRANCE POUR CET ÂGE:
${leniency}

INSTRUCTIONS DE VALIDATION:
1. Compare la réponse de l'enfant à la réponse attendue
2. Pour les mathématiques, accepte différents formats équivalents:
   - "8", "huit", "8.0" sont tous équivalents à 8
   - "1/2", "0.5", "50%" sont tous équivalents
   - Ignore les espaces et la ponctuation
3. Si la réponse est correcte (ou équivalente), marque isCorrect: true
4. Si incorrecte, marque isCorrect: false
5. Fournis un feedback encourageant en français:
   - Si correct: Félicitations enthousiastes et personnalisées
   - Si incorrect: Encouragement positif + indication de la bonne direction
6. Indique si tu as appliqué de la tolérance (leniencyApplied: true/false)

Réponds UNIQUEMENT avec un JSON valide:
{
  "isCorrect": true ou false,
  "feedback": "Message en français pour l'enfant",
  "leniencyApplied": true ou false
}`;
}

/**
 * Exemples d'exercices de mathématiques
 */
const MATH_EXAMPLES: GeneratedExercise[] = [
  {
    question: "🍎 Sophie a cueilli 7 pommes rouges et 5 pommes vertes dans son jardin. Combien de pommes a-t-elle en tout?",
    answer: "12",
    hints: [
      "Compte toutes les pommes ensemble",
      "7 pommes rouges + 5 pommes vertes",
      "7 + 5 = ?"
    ],
    type: 'math',
    difficulty: 'easy',
    ageRange: '6-8'
  },
  {
    question: "🎮 Léo a économisé 45€ pour acheter un jeu vidéo à 28€. Combien d'argent lui restera-t-il après l'achat?",
    answer: "17",
    hints: [
      "Il faut soustraire le prix du jeu de ses économies",
      "45€ - 28€",
      "Pense à compter: 45 - 28 = ?"
    ],
    type: 'math',
    difficulty: 'medium',
    ageRange: '9-11'
  },
  {
    question: "🚴 Emma fait du vélo à une vitesse moyenne de 15 km/h. Si elle roule pendant 2 heures et demie, quelle distance parcourt-elle?",
    answer: "37.5",
    hints: [
      "Distance = Vitesse × Temps",
      "2 heures et demie = 2.5 heures",
      "15 km/h × 2.5 heures = ?"
    ],
    type: 'math',
    difficulty: 'hard',
    ageRange: '12-14'
  }
];

/**
 * Template complet pour les exercices de mathématiques
 */
export const mathPromptTemplate: PromptTemplate = {
  type: 'math',
  systemPrompt: MATH_SYSTEM_PROMPT,
  userPromptTemplate: generateMathUserPrompt,
  validationPromptTemplate: generateMathValidationPrompt,
  examples: MATH_EXAMPLES
};
