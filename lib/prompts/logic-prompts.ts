/**
 * Templates de prompts pour les exercices de logique
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
 * Prompt système pour la génération d'exercices de logique
 */
const LOGIC_SYSTEM_PROMPT = `Tu es un expert en pédagogie de la logique et du raisonnement pour enfants francophones.
Tu génères des énigmes et défis de logique FASCINANTS qui stimulent la réflexion.

RÈGLES STRICTES:
1. Toujours en français parfait et adapté à l'âge
2. Énigmes visuelles, patterns, séquences, déduction, résolution de problèmes
3. Présentation claire avec émojis pour visualiser le problème
4. Format de sortie: JSON strict avec les champs: question, answer, hints, type, difficulty, ageRange
5. Les hints guident le raisonnement étape par étape
6. La réponse doit être claire et unique

TYPES D'EXERCICES DE LOGIQUE:
- Suites logiques (nombres, formes, patterns)
- Énigmes de déduction
- Problèmes de logique spatiale
- Casse-têtes mathématiques
- Raisonnement par élimination

STYLE:
- Énigmes intrigantes qui donnent envie de résoudre
- Présentation visuelle avec émojis
- Contextes amusants (détectives, explorateurs, magiciens)
- Faire sentir l'exercice comme un puzzle captivant`;

/**
 * Générer le prompt utilisateur pour un exercice de logique
 */
function generateLogicUserPrompt(params: ExerciseGenerationParams): string {
  const { ageRange, difficulty } = params;
  const guidelines = getAgeGuidelines(ageRange);
  
  let difficultyInstructions = '';
  
  if (difficulty === 'easy') {
    difficultyInstructions = 'FACILE - Pattern simple, déduction directe, 1-2 étapes';
  } else if (difficulty === 'medium') {
    difficultyInstructions = 'MOYEN - Pattern ou déduction nécessitant 2-3 étapes de raisonnement';
  } else {
    difficultyInstructions = 'DIFFICILE - Raisonnement complexe, plusieurs étapes, élimination';
  }
  
  // Instructions spécifiques par âge
  let ageSpecificInstructions = '';
  
  if (ageRange === '6-8') {
    ageSpecificInstructions = `
NIVEAU 6-8 ANS:
- Patterns visuels simples (répétitions)
- Suites de nombres simples (+1, +2, -1)
- Catégorisation basique (animaux, couleurs, formes)
- Énigmes avec 2-3 éléments maximum
- Utiliser beaucoup d'émojis pour visualiser`;
  } else if (ageRange === '9-11') {
    ageSpecificInstructions = `
NIVEAU 9-11 ANS:
- Patterns plus complexes (alternance, multiplication)
- Déduction logique avec 3-4 indices
- Énigmes de position et ordre
- Problèmes de logique à 2-3 étapes
- Casse-têtes avec plusieurs solutions possibles à éliminer`;
  } else {
    ageSpecificInstructions = `
NIVEAU 12-14 ANS:
- Patterns abstraits et algébriques
- Déduction avec conditions multiples
- Énigmes nécessitant organisation méthodique
- Raisonnement par l'absurde
- Problèmes combinatoires simples`;
  }

  return `Génère UNE énigme de logique unique avec ces paramètres:

TRANCHE D'ÂGE: ${ageRange} ans
DIFFICULTÉ: ${difficultyInstructions}

${ageSpecificInstructions}

GUIDELINES COGNITIVES:
- Niveau cognitif: ${guidelines.cognitiveLevel}
- Capacité d'attention: ${guidelines.attention}

EXEMPLES DE TYPES D'ÉNIGMES:
- Suite logique: "🔵 🔴 🔵 🔴 🔵 ___ ?"
- Déduction: "Si tous les A sont B, et C est un A, alors..."
- Pattern numérique: "2, 4, 8, 16, ___ ?"
- Énigme positionnelle: "Marc est plus grand que Léa. Léa est plus grande que Tom. Qui est le plus petit?"

IMPORTANT:
- Rends l'énigme intrigante et captivante
- Utilise des émojis pour illustrer (🔴🔵🟡🟢⭐🌙☀️🐱🐶🦁 etc.)
- La solution doit être logiquement déductible
- Fournis 3 hints qui guident le raisonnement

Réponds UNIQUEMENT avec un JSON valide dans ce format exact:
{
  "question": "...",
  "answer": "...",
  "hints": ["hint1", "hint2", "hint3"],
  "type": "logic",
  "difficulty": "${difficulty}",
  "ageRange": "${ageRange}"
}`;
}

/**
 * Générer le prompt de validation pour une réponse de logique
 */
function generateLogicValidationPrompt(params: AnswerValidationParams): string {
  const { question, correctAnswer, childAnswer, ageRange } = params;
  const leniency = getLeniencyLevel(ageRange);
  
  return `Tu es un correcteur bienveillant d'exercices de logique pour enfants.

ÉNIGME DE LOGIQUE:
${question}

Réponse attendue: ${correctAnswer}
Réponse de l'enfant: ${childAnswer}
Âge de l'enfant: ${ageRange} ans

NIVEAU DE TOLÉRANCE POUR CET ÂGE:
${leniency}

INSTRUCTIONS DE VALIDATION POUR LA LOGIQUE:
1. Vérifie si le raisonnement de l'enfant est correct
2. Accepte les réponses équivalentes:
   - Formulations différentes de la même réponse
   - Synonymes (rouge/🔴, étoile/⭐)
   - Différents formats numériques
3. Pour les patterns, accepte la réponse si elle suit la logique
4. Tolère les erreurs d'orthographe selon l'âge
5. Si l'enfant a compris la logique mais s'est trompé sur un détail, sois tolérant
6. Pour les 6-8 ans: accepte toute réponse montrant compréhension du concept
7. Pour les 9-11 ans: exige justesse logique mais accepte formulations variées
8. Pour les 12-14 ans: exige précision mais reste bienveillant

FEEDBACK:
- Si correct: Félicite l'excellente logique et le raisonnement
- Si incorrect: Encourage à réfléchir autrement et donne un indice

Réponds UNIQUEMENT avec un JSON valide:
{
  "isCorrect": true ou false,
  "feedback": "Message en français pour l'enfant",
  "leniencyApplied": true ou false
}`;
}

/**
 * Exemples d'exercices de logique
 */
const LOGIC_EXAMPLES: GeneratedExercise[] = [
  {
    question: "🔵 🔴 🔵 🔴 🔵 ___\n\nQuelle couleur vient ensuite dans ce motif?",
    answer: "rouge",
    hints: [
      "Observe l'ordre des couleurs",
      "Les couleurs alternent: bleu, rouge, bleu, rouge...",
      "Après bleu vient..."
    ],
    type: 'logic',
    difficulty: 'easy',
    ageRange: '6-8'
  },
  {
    question: "🐱 Trois amis ont des animaux différents: un chat, un chien et un poisson.\n- Julie n'a pas de chat\n- Marc a un animal qui nage\n- Sophie adore les félins\n\nQui a le chien?",
    answer: "Julie",
    hints: [
      "Marc a le poisson (il nage)",
      "Sophie a le chat (c'est un félin)",
      "Il reste donc..."
    ],
    type: 'logic',
    difficulty: 'medium',
    ageRange: '9-11'
  },
  {
    question: "🧮 Dans une suite logique:\n2, 6, 12, 20, 30, __\n\nQuel nombre complète la suite?",
    answer: "42",
    hints: [
      "Regarde les différences entre les nombres",
      "Les différences sont: +4, +6, +8, +10... La suite des différences augmente de 2 à chaque fois",
      "Donc après +10, on ajoute +12 à 30"
    ],
    type: 'logic',
    difficulty: 'hard',
    ageRange: '12-14'
  }
];

/**
 * Template complet pour les exercices de logique
 */
export const logicPromptTemplate: PromptTemplate = {
  type: 'logic',
  systemPrompt: LOGIC_SYSTEM_PROMPT,
  userPromptTemplate: generateLogicUserPrompt,
  validationPromptTemplate: generateLogicValidationPrompt,
  examples: LOGIC_EXAMPLES
};
