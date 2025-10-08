/**
 * Script de test pour les prompts DeepSeek
 * Story 3.2: Design Exercise Generation Prompts
 * 
 * Ce script teste manuellement les prompts avec l'API DeepSeek
 * pour valider la qualité des exercices générés.
 * 
 * Usage:
 *   DEEPSEEK_API_KEY=sk-... npm run test:prompts
 */

import { PROMPT_TEMPLATES, DEFAULT_DEEPSEEK_CONFIG } from './index';
import type { ExerciseType, AgeRange, DifficultyLevel } from './types';

/**
 * Configuration de test
 */
const TEST_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  apiUrl: 'https://api.deepseek.com/v1/chat/completions',
  testEachType: true,
  testEachAge: true,
  testEachDifficulty: true,
  testValidation: true,
};

/**
 * Couleurs pour le terminal
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

/**
 * Appeler DeepSeek API
 */
async function callDeepSeek(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!TEST_CONFIG.apiKey) {
    throw new Error('DEEPSEEK_API_KEY non définie. Utilisez: DEEPSEEK_API_KEY=sk-... npm run test:prompts');
  }

  const response = await fetch(TEST_CONFIG.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_DEEPSEEK_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: DEFAULT_DEEPSEEK_CONFIG.temperature,
      max_tokens: DEFAULT_DEEPSEEK_CONFIG.maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur API DeepSeek: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Tester la génération d'un exercice
 */
async function testExerciseGeneration(
  type: ExerciseType,
  ageRange: AgeRange,
  difficulty: DifficultyLevel
): Promise<void> {
  console.log(`\n${colors.blue}=== Test: ${type} | ${ageRange} ans | ${difficulty} ===${colors.reset}`);

  try {
    const template = PROMPT_TEMPLATES[type];
    const params = { ageRange, difficulty, subject: type };

    const systemPrompt = template.systemPrompt;
    const userPrompt = template.userPromptTemplate(params);

    console.log(`${colors.yellow}Appel DeepSeek...${colors.reset}`);
    const startTime = Date.now();
    const response = await callDeepSeek(systemPrompt, userPrompt);
    const duration = Date.now() - startTime;

    // Essayer de parser le JSON
    let exercise;
    try {
      exercise = JSON.parse(response);
    } catch (e) {
      console.log(`${colors.red}❌ ERREUR: Réponse non-JSON${colors.reset}`);
      console.log('Réponse brute:', response);
      return;
    }

    // Valider la structure
    const requiredFields = ['question', 'answer', 'hints', 'type', 'difficulty', 'ageRange'];
    const missingFields = requiredFields.filter(field => !(field in exercise));

    if (missingFields.length > 0) {
      console.log(`${colors.red}❌ Champs manquants: ${missingFields.join(', ')}${colors.reset}`);
      return;
    }

    // Afficher le résultat
    console.log(`${colors.green}✅ Exercice généré en ${duration}ms${colors.reset}`);
    console.log(`\n${colors.bright}Question:${colors.reset}`);
    console.log(exercise.question);
    console.log(`\n${colors.bright}Réponse:${colors.reset} ${exercise.answer}`);
    console.log(`\n${colors.bright}Indices:${colors.reset}`);
    exercise.hints.forEach((hint: string, i: number) => {
      console.log(`  ${i + 1}. ${hint}`);
    });

    // Validation de qualité
    const issues: string[] = [];
    if (exercise.question.length < 10) issues.push('Question trop courte');
    if (!exercise.answer) issues.push('Réponse vide');
    if (!Array.isArray(exercise.hints) || exercise.hints.length !== 3) issues.push('Doit avoir exactement 3 hints');
    if (!/[🎨🐱🍎🌟📚🎮🚴🌲]/u.test(exercise.question)) issues.push('Manque d\'émojis visuels');

    if (issues.length > 0) {
      console.log(`\n${colors.yellow}⚠️  Problèmes de qualité:${colors.reset}`);
      issues.forEach(issue => console.log(`  - ${issue}`));
    }

  } catch (error) {
    console.log(`${colors.red}❌ ERREUR: ${error}${colors.reset}`);
  }
}

/**
 * Tester la validation d'une réponse
 */
async function testAnswerValidation(
  type: ExerciseType,
  ageRange: AgeRange
): Promise<void> {
  console.log(`\n${colors.magenta}=== Test Validation: ${type} | ${ageRange} ans ===${colors.reset}`);

  try {
    const template = PROMPT_TEMPLATES[type];
    const example = template.examples.find(ex => ex.ageRange === ageRange);

    if (!example) {
      console.log(`${colors.yellow}Pas d'exemple pour ${ageRange}${colors.reset}`);
      return;
    }

    // Test 1: Réponse correcte
    console.log(`\n${colors.yellow}Test 1: Réponse correcte${colors.reset}`);
    const validationParams1 = {
      question: example.question,
      correctAnswer: example.answer,
      childAnswer: example.answer,
      ageRange,
      exerciseType: type,
    };

    const validationPrompt1 = template.validationPromptTemplate(validationParams1);
    const response1 = await callDeepSeek('', validationPrompt1);
    const validation1 = JSON.parse(response1);

    console.log(`  ${validation1.isCorrect ? colors.green + '✅' : colors.red + '❌'} isCorrect: ${validation1.isCorrect}${colors.reset}`);
    console.log(`  Feedback: ${validation1.feedback}`);

    // Test 2: Réponse incorrecte
    console.log(`\n${colors.yellow}Test 2: Réponse incorrecte${colors.reset}`);
    const validationParams2 = {
      question: example.question,
      correctAnswer: example.answer,
      childAnswer: 'mauvaise réponse',
      ageRange,
      exerciseType: type,
    };

    const validationPrompt2 = template.validationPromptTemplate(validationParams2);
    const response2 = await callDeepSeek('', validationPrompt2);
    const validation2 = JSON.parse(response2);

    console.log(`  ${!validation2.isCorrect ? colors.green + '✅' : colors.red + '❌'} isCorrect: ${validation2.isCorrect}${colors.reset}`);
    console.log(`  Feedback: ${validation2.feedback}`);

  } catch (error) {
    console.log(`${colors.red}❌ ERREUR: ${error}${colors.reset}`);
  }
}

/**
 * Exécuter tous les tests
 */
async function runAllTests(): Promise<void> {
  console.log(`${colors.bright}${colors.blue}
╔═══════════════════════════════════════════════════════════╗
║   Tests des Prompts DeepSeek - KidGuard Exercise System  ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  if (!TEST_CONFIG.apiKey) {
    console.log(`${colors.red}ERREUR: Variable d'environnement DEEPSEEK_API_KEY manquante${colors.reset}`);
    console.log(`\nUsage: DEEPSEEK_API_KEY=sk-... npm run test:prompts\n`);
    return;
  }

  const types: ExerciseType[] = ['math', 'reading', 'logic', 'vocabulary'];
  const ageRanges: AgeRange[] = ['6-8', '9-11', '12-14'];
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  // Test de génération
  if (TEST_CONFIG.testEachType) {
    console.log(`\n${colors.bright}━━━ Tests de Génération ━━━${colors.reset}`);

    for (const type of types) {
      // Tester chaque âge avec difficulté moyenne
      for (const ageRange of ageRanges) {
        await testExerciseGeneration(type, ageRange, 'medium');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      }
    }
  }

  // Test de validation
  if (TEST_CONFIG.testValidation) {
    console.log(`\n${colors.bright}━━━ Tests de Validation ━━━${colors.reset}`);

    for (const type of types) {
      await testAnswerValidation(type, '9-11');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    }
  }

  console.log(`\n${colors.green}${colors.bright}✅ Tests terminés${colors.reset}\n`);
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests, testExerciseGeneration, testAnswerValidation };
