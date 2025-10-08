/**
 * Templates de prompts pour les exercices de lecture
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
 * Prompt système pour la génération d'exercices de lecture
 */
const READING_SYSTEM_PROMPT = `Tu es un expert en pédagogie de la lecture pour enfants francophones.
Tu génères des exercices de compréhension de lecture CAPTIVANTS qui donnent envie de lire.

RÈGLES STRICTES:
1. Toujours en français parfait et adapté à l'âge
2. Histoires courtes et engageantes (aventures, animaux, situations amusantes)
3. Questions de compréhension claire et précise
4. Format de sortie: JSON strict avec les champs: question, answer, hints, type, difficulty, ageRange
5. Les hints aident à relire ou à comprendre le texte
6. La réponse doit être claire (mot, phrase courte, ou choix multiple)

STYLE:
- Histoires imaginatives et positives
- Vocabulaire riche mais approprié à l'âge
- Thèmes qui intéressent les enfants (nature, amitié, aventure, magie)
- Faire sentir la lecture comme une découverte, pas un test`;

/**
 * Générer le prompt utilisateur pour un exercice de lecture
 */
function generateReadingUserPrompt(params: ExerciseGenerationParams): string {
  const { ageRange, difficulty } = params;
  const guidelines = getAgeGuidelines(ageRange);
  
  let difficultyInstructions = '';
  
  if (difficulty === 'easy') {
    difficultyInstructions = 'FACILE - Texte court, question directe, réponse évidente';
  } else if (difficulty === 'medium') {
    difficultyInstructions = 'MOYEN - Texte plus long, question nécessitant compréhension';
  } else {
    difficultyInstructions = 'DIFFICILE - Texte complexe, question nécessitant analyse ou inférence';
  }
  
  // Instructions spécifiques par âge
  let ageSpecificInstructions = '';
  
  if (ageRange === '6-8') {
    ageSpecificInstructions = `
NIVEAU 6-8 ANS:
- Texte de 2-4 phrases courtes (30-50 mots max)
- Vocabulaire simple et concret
- Phrases de 5-8 mots maximum
- Questions sur des faits explicites
- Réponse: un mot ou une très courte phrase`;
  } else if (ageRange === '9-11') {
    ageSpecificInstructions = `
NIVEAU 9-11 ANS:
- Texte de 1-2 paragraphes (80-120 mots)
- Vocabulaire enrichi avec quelques mots nouveaux
- Phrases plus complexes
- Questions sur la compréhension et des inférences simples
- Réponse: phrase courte ou explication brève`;
  } else {
    ageSpecificInstructions = `
NIVEAU 12-14 ANS:
- Texte de 2-3 paragraphes (150-200 mots)
- Vocabulaire varié et nuancé
- Structures grammaticales complexes
- Questions d'analyse, d'interprétation, de thème
- Réponse: phrase complète ou analyse courte`;
  }

  return `Génère UN exercice de lecture unique avec ces paramètres:

TRANCHE D'ÂGE: ${ageRange} ans
DIFFICULTÉ: ${difficultyInstructions}

${ageSpecificInstructions}

GUIDELINES COGNITIVES:
- Niveau cognitif: ${guidelines.cognitiveLevel}
- Niveau de lecture: ${guidelines.readingLevel}
- Vocabulaire: ${guidelines.languageLevel}

STRUCTURE DE L'EXERCICE:
1. Commence par le texte court à lire
2. Ensuite pose UNE question de compréhension
3. La question doit commencer par "Question: " ou être clairement séparée du texte
4. Format: "[TEXTE]\n\nQuestion: [QUESTION]"

IMPORTANT:
- Rends l'histoire intéressante et captivante
- Utilise des émojis pour rendre le texte plus visuel (🌳 🐱 ⭐ etc.)
- La réponse doit être trouvable dans le texte ou logiquement déductible
- Fournis 3 hints qui guident vers la réponse

Réponds UNIQUEMENT avec un JSON valide dans ce format exact:
{
  "question": "[TEXTE DE L'HISTOIRE]\n\nQuestion: [LA QUESTION]",
  "answer": "...",
  "hints": ["hint1", "hint2", "hint3"],
  "type": "reading",
  "difficulty": "${difficulty}",
  "ageRange": "${ageRange}"
}`;
}

/**
 * Générer le prompt de validation pour une réponse de lecture
 */
function generateReadingValidationPrompt(params: AnswerValidationParams): string {
  const { question, correctAnswer, childAnswer, ageRange } = params;
  const leniency = getLeniencyLevel(ageRange);
  
  return `Tu es un correcteur bienveillant d'exercices de lecture pour enfants.

EXERCICE DE LECTURE:
${question}

Réponse attendue: ${correctAnswer}
Réponse de l'enfant: ${childAnswer}
Âge de l'enfant: ${ageRange} ans

NIVEAU DE TOLÉRANCE POUR CET ÂGE:
${leniency}

INSTRUCTIONS DE VALIDATION POUR LA LECTURE:
1. Pour les exercices de lecture, l'important est la COMPRÉHENSION, pas la formulation exacte
2. Accepte les réponses qui démontrent la compréhension même si les mots sont différents
3. Accepte les synonymes et reformulations
4. Tolère les erreurs d'orthographe selon l'âge
5. Si la réponse capture l'idée principale, c'est correct
6. Pour les 6-8 ans: sois TRÈS tolérant sur l'orthographe et la formulation
7. Pour les 9-11 ans: accepte les variantes raisonnables
8. Pour les 12-14 ans: exige plus de précision mais reste bienveillant

FEEDBACK:
- Si correct: Félicite la compréhension et la lecture attentive
- Si incorrect: Encourage à relire et donne un indice sur où chercher

Réponds UNIQUEMENT avec un JSON valide:
{
  "isCorrect": true ou false,
  "feedback": "Message en français pour l'enfant",
  "leniencyApplied": true ou false
}`;
}

/**
 * Exemples d'exercices de lecture
 */
const READING_EXAMPLES: GeneratedExercise[] = [
  {
    question: "🐱 Le petit chat Minou aime jouer dans le jardin. Il court après les papillons. Maman chat l'appelle pour manger.\n\nQuestion: Où joue Minou?",
    answer: "dans le jardin",
    hints: [
      "Relis la première phrase",
      "Cherche où le chat aime jouer",
      "Le chat joue dans le..."
    ],
    type: 'reading',
    difficulty: 'easy',
    ageRange: '6-8'
  },
  {
    question: "🌲 Lucas adorait se promener en forêt avec son grand-père. Ensemble, ils observaient les oiseaux et ramassaient des champignons. Un jour, ils ont découvert une cabane abandonnée au milieu des arbres. C'était leur secret.\n\nQuestion: Pourquoi la cabane était-elle spéciale pour Lucas et son grand-père?",
    answer: "C'était leur secret",
    hints: [
      "Relis la dernière phrase du texte",
      "Que représentait la cabane pour eux?",
      "La cabane était leur..."
    ],
    type: 'reading',
    difficulty: 'medium',
    ageRange: '9-11'
  },
  {
    question: "🎨 Marie hésitait devant sa toile blanche. Elle avait tant d'idées, mais aucune ne semblait assez parfaite. Son professeur lui avait pourtant dit: \"L'art n'est pas dans la perfection, mais dans l'expression.\" Cette phrase résonnait dans sa tête. Finalement, elle prit son pinceau et laissa ses émotions guider sa main. Le résultat la surprit elle-même.\n\nQuestion: Quel changement s'opère chez Marie à la fin du texte?",
    answer: "Elle arrête de chercher la perfection et se laisse guider par ses émotions",
    hints: [
      "Compare le début et la fin du texte",
      "Qu'est-ce qui change dans son attitude?",
      "Elle passe de l'hésitation à..."
    ],
    type: 'reading',
    difficulty: 'hard',
    ageRange: '12-14'
  }
];

/**
 * Template complet pour les exercices de lecture
 */
export const readingPromptTemplate: PromptTemplate = {
  type: 'reading',
  systemPrompt: READING_SYSTEM_PROMPT,
  userPromptTemplate: generateReadingUserPrompt,
  validationPromptTemplate: generateReadingValidationPrompt,
  examples: READING_EXAMPLES
};
