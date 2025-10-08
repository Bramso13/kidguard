/**
 * Templates de prompts pour les exercices de vocabulaire
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
 * Prompt système pour la génération d'exercices de vocabulaire
 */
const VOCABULARY_SYSTEM_PROMPT = `Tu es un expert en pédagogie du vocabulaire français pour enfants francophones.
Tu génères des exercices de vocabulaire ENRICHISSANTS qui développent la maîtrise de la langue.

RÈGLES STRICTES:
1. Toujours en français parfait et adapté à l'âge
2. Exercices variés: synonymes, antonymes, définitions, contexte, familles de mots
3. Mots concrets et utiles pour les enfants
4. Format de sortie: JSON strict avec les champs: question, answer, hints, type, difficulty, ageRange
5. Les hints aident à comprendre le sens et le contexte
6. La réponse doit être claire (un mot ou expression courte)

TYPES D'EXERCICES DE VOCABULAIRE:
- Synonymes: "Trouve un autre mot pour..."
- Antonymes: "Quel est le contraire de..."
- Définitions: "Que signifie le mot..."
- Complétion: "Le ___ de la maison est rouge" (toit)
- Contexte: Comprendre un mot dans une phrase
- Familles de mots: mots de la même famille

STYLE:
- Vocabulaire riche et varié
- Exemples concrets et imagés
- Contextes familiers aux enfants
- Faire sentir l'apprentissage des mots comme un jeu de découverte`;

/**
 * Générer le prompt utilisateur pour un exercice de vocabulaire
 */
function generateVocabularyUserPrompt(params: ExerciseGenerationParams): string {
  const { ageRange, difficulty } = params;
  const guidelines = getAgeGuidelines(ageRange);
  
  let difficultyInstructions = '';
  
  if (difficulty === 'easy') {
    difficultyInstructions = 'FACILE - Mots courants, synonymes simples, contexte évident';
  } else if (difficulty === 'medium') {
    difficultyInstructions = 'MOYEN - Vocabulaire enrichi, nuances, expressions';
  } else {
    difficultyInstructions = 'DIFFICILE - Vocabulaire avancé, sens figuré, nuances fines';
  }
  
  // Instructions spécifiques par âge
  let ageSpecificInstructions = '';
  
  if (ageRange === '6-8') {
    ageSpecificInstructions = `
NIVEAU 6-8 ANS:
- Mots du quotidien (famille, école, animaux, nature)
- Synonymes très simples (content/joyeux, petit/minuscule)
- Antonymes évidents (grand/petit, chaud/froid)
- Définitions avec images mentales concrètes
- Éviter les mots abstraits`;
  } else if (ageRange === '9-11') {
    ageSpecificInstructions = `
NIVEAU 9-11 ANS:
- Vocabulaire plus riche (émotions, actions, descriptions)
- Synonymes avec nuances (peur/terreur/angoisse)
- Antonymes moins évidents
- Expressions courantes
- Introduction de quelques mots abstraits simples`;
  } else {
    ageSpecificInstructions = `
NIVEAU 12-14 ANS:
- Vocabulaire soutenu et varié
- Nuances fines entre synonymes
- Sens propre et figuré
- Expressions idiomatiques
- Mots abstraits et concepts complexes`;
  }

  return `Génère UN exercice de vocabulaire unique avec ces paramètres:

TRANCHE D'ÂGE: ${ageRange} ans
DIFFICULTÉ: ${difficultyInstructions}

${ageSpecificInstructions}

GUIDELINES LINGUISTIQUES:
- Niveau cognitif: ${guidelines.cognitiveLevel}
- Niveau de langage: ${guidelines.languageLevel}

TYPES D'EXERCICES (choisis-en un):
1. Synonyme: "Trouve un autre mot qui veut dire la même chose que [MOT]"
2. Antonyme: "Quel est le contraire de [MOT]?"
3. Définition: "Que signifie le mot [MOT]?"
4. Contexte: "Quel mot complète cette phrase: [PHRASE avec ___]?"
5. Famille de mots: "Trouve un mot de la même famille que [MOT]"

IMPORTANT:
- Choisis des mots utiles et intéressants pour l'âge
- La question doit être claire et motivante
- Utilise des émojis pour illustrer (📚 🎨 🌟 etc.)
- La réponse doit être un mot ou une courte expression
- Fournis 3 hints qui guident vers la réponse

Réponds UNIQUEMENT avec un JSON valide dans ce format exact:
{
  "question": "...",
  "answer": "...",
  "hints": ["hint1", "hint2", "hint3"],
  "type": "vocabulary",
  "difficulty": "${difficulty}",
  "ageRange": "${ageRange}"
}`;
}

/**
 * Générer le prompt de validation pour une réponse de vocabulaire
 */
function generateVocabularyValidationPrompt(params: AnswerValidationParams): string {
  const { question, correctAnswer, childAnswer, ageRange } = params;
  const leniency = getLeniencyLevel(ageRange);
  
  return `Tu es un correcteur bienveillant d'exercices de vocabulaire pour enfants.

EXERCICE DE VOCABULAIRE:
${question}

Réponse attendue: ${correctAnswer}
Réponse de l'enfant: ${childAnswer}
Âge de l'enfant: ${ageRange} ans

NIVEAU DE TOLÉRANCE POUR CET ÂGE:
${leniency}

INSTRUCTIONS DE VALIDATION POUR LE VOCABULAIRE:
1. Pour le vocabulaire, la compréhension du sens est primordiale
2. ACCEPTE LES SYNONYMES VALIDES même s'ils diffèrent de la réponse attendue
   - Exemple: pour "joyeux", accepte "content", "heureux", "gai"
3. Pour les antonymes, accepte tous les contraires valides
4. Pour les définitions, accepte toute explication correcte
5. Tolère les erreurs d'orthographe selon l'âge:
   - 6-8 ans: TRÈS tolérant (accepte phonétique)
   - 9-11 ans: Tolérant pour 1-2 lettres
   - 12-14 ans: Exige meilleure orthographe mais reste souple
6. Accepte les variantes régionales du français
7. Si l'enfant a compris le concept mais choisi un synonyme différent, c'est correct

FEEDBACK:
- Si correct: Félicite l'excellente maîtrise du vocabulaire
- Si synonyme valide non attendu: Félicite et mentionne aussi la réponse attendue
- Si incorrect: Encourage et donne un indice sur le sens

Réponds UNIQUEMENT avec un JSON valide:
{
  "isCorrect": true ou false,
  "feedback": "Message en français pour l'enfant",
  "leniencyApplied": true ou false
}`;
}

/**
 * Exemples d'exercices de vocabulaire
 */
const VOCABULARY_EXAMPLES: GeneratedExercise[] = [
  {
    question: "📚 Trouve un autre mot qui veut dire la même chose que 'content'",
    answer: "joyeux",
    hints: [
      "Pense à comment tu te sens quand tu es content",
      "C'est un mot qui exprime le bonheur",
      "On dit aussi: être ___"
    ],
    type: 'vocabulary',
    difficulty: 'easy',
    ageRange: '6-8'
  },
  {
    question: "🎨 Quel mot complète cette phrase?\n\nLe peintre utilise sa ___ pour créer des tableaux magnifiques.",
    answer: "palette",
    hints: [
      "C'est un objet que les peintres tiennent dans leur main",
      "Il y a toutes les couleurs dessus",
      "Cela commence par 'pa...'"
    ],
    type: 'vocabulary',
    difficulty: 'medium',
    ageRange: '9-11'
  },
  {
    question: "🌟 Que signifie l'expression 'avoir le cœur sur la main'?",
    answer: "être généreux",
    hints: [
      "C'est une expression qui parle de donner",
      "On l'utilise pour décrire quelqu'un de très gentil",
      "C'est être très ___ avec les autres"
    ],
    type: 'vocabulary',
    difficulty: 'hard',
    ageRange: '12-14'
  }
];

/**
 * Template complet pour les exercices de vocabulaire
 */
export const vocabularyPromptTemplate: PromptTemplate = {
  type: 'vocabulary',
  systemPrompt: VOCABULARY_SYSTEM_PROMPT,
  userPromptTemplate: generateVocabularyUserPrompt,
  validationPromptTemplate: generateVocabularyValidationPrompt,
  examples: VOCABULARY_EXAMPLES
};
