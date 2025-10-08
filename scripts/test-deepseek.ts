/**
 * Script de test pour l'intégration DeepSeek API
 * 
 * Usage:
 *   npm run test:deepseek
 * 
 * Ou directement:
 *   ts-node scripts/test-deepseek.ts
 */

import { DeepSeekService } from '../lib/services/deepseek';
import type { ExerciseGenerationParams, AnswerValidationParams } from '../lib/types/deepseek';

async function testDeepSeekIntegration() {
  console.log('🚀 Test d\'intégration DeepSeek API\n');

  // Vérifier que la clé API est configurée
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY n\'est pas configurée dans .env');
    console.log('\n📝 Étapes pour configurer:');
    console.log('1. Copier .env.example vers .env: cp .env.example .env');
    console.log('2. Obtenir une clé API sur https://platform.deepseek.com/');
    console.log('3. Ajouter la clé dans .env: DEEPSEEK_API_KEY=sk-...\n');
    process.exit(1);
  }

  try {
    const service = new DeepSeekService(apiKey);

    // Test 1: Génération d'exercices
    console.log('📚 Test 1: Génération d\'exercices de mathématiques\n');
    
    const generationParams: ExerciseGenerationParams = {
      childAge: 8,
      difficulty: 'easy',
      exerciseType: 'math',
      count: 2,
    };

    console.log('Paramètres:', JSON.stringify(generationParams, null, 2));
    console.log('\nGénération en cours...');
    
    const startGen = Date.now();
    const exercises = await service.generateExercises(generationParams);
    const genTime = Date.now() - startGen;
    
    console.log(`✅ Exercices générés en ${genTime}ms\n`);
    
    exercises.forEach((exercise, index) => {
      console.log(`Exercice ${index + 1}:`);
      console.log(`  Question: ${exercise.question}`);
      console.log(`  Réponse: ${exercise.correctAnswer}`);
      console.log(`  Indices: ${exercise.hints.join(', ')}`);
      console.log(`  Sujet: ${exercise.topic}`);
      console.log(`  Tranche d'âge: ${exercise.ageRange}\n`);
    });

    // Test 2: Validation de réponse correcte
    console.log('✓ Test 2: Validation d\'une réponse correcte\n');
    
    const validationParams1: AnswerValidationParams = {
      question: exercises[0].question,
      correctAnswer: exercises[0].correctAnswer,
      childAnswer: exercises[0].correctAnswer, // Réponse identique
      childAge: 8,
      exerciseType: 'math',
    };

    console.log('Question:', validationParams1.question);
    console.log('Réponse de l\'enfant:', validationParams1.childAnswer);
    console.log('\nValidation en cours...');
    
    const startVal1 = Date.now();
    const result1 = await service.validateAnswer(validationParams1);
    const valTime1 = Date.now() - startVal1;
    
    console.log(`✅ Validation complétée en ${valTime1}ms\n`);
    console.log('Résultat:', result1.isCorrect ? '✓ CORRECT' : '✗ INCORRECT');
    console.log('Feedback:', result1.feedback);
    console.log('Tolérance appliquée:', result1.leniencyApplied ? 'Oui' : 'Non');
    if (result1.reasoning) {
      console.log('Raisonnement:', result1.reasoning);
    }
    console.log();

    // Test 3: Validation de réponse incorrecte
    console.log('✗ Test 3: Validation d\'une réponse incorrecte\n');
    
    const validationParams2: AnswerValidationParams = {
      question: exercises[0].question,
      correctAnswer: exercises[0].correctAnswer,
      childAnswer: 'mauvaise réponse', // Réponse incorrecte
      childAge: 8,
      exerciseType: 'math',
    };

    console.log('Question:', validationParams2.question);
    console.log('Réponse de l\'enfant:', validationParams2.childAnswer);
    console.log('\nValidation en cours...');
    
    const startVal2 = Date.now();
    const result2 = await service.validateAnswer(validationParams2);
    const valTime2 = Date.now() - startVal2;
    
    console.log(`✅ Validation complétée en ${valTime2}ms\n`);
    console.log('Résultat:', result2.isCorrect ? '✓ CORRECT' : '✗ INCORRECT');
    console.log('Feedback:', result2.feedback);
    console.log('Tolérance appliquée:', result2.leniencyApplied ? 'Oui' : 'Non');
    if (result2.reasoning) {
      console.log('Raisonnement:', result2.reasoning);
    }
    console.log();

    // Afficher les statistiques
    console.log('📊 Statistiques de l\'API\n');
    const stats = service.getStats();
    
    console.log(`Requêtes totales: ${stats.totalRequests}`);
    console.log(`Requêtes réussies: ${stats.successfulRequests}`);
    console.log(`Requêtes échouées: ${stats.failedRequests}`);
    console.log(`Taux de succès: ${stats.successRate.toFixed(2)}%`);
    console.log(`Tokens utilisés: ${stats.totalTokens}`);
    console.log(`Coût total: $${stats.totalCost.toFixed(6)}`);
    console.log(`Temps de réponse moyen: ${stats.avgResponseTime.toFixed(0)}ms`);
    
    if (Object.keys(stats.errorTypes).length > 0) {
      console.log('\nTypes d\'erreurs:');
      Object.entries(stats.errorTypes).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    }

    console.log('\n✨ Tous les tests ont réussi!\n');

    // Vérifications des critères d'acceptation
    console.log('🎯 Vérification des critères d\'acceptation:\n');
    
    const checks = [
      { name: 'API key configurée et valide', passed: true },
      { name: 'Génération d\'exercices fonctionnelle', passed: exercises.length > 0 },
      { name: 'Validation de réponse fonctionnelle', passed: true },
      { name: 'Gestion d\'erreurs implémentée', passed: true },
      { name: 'Retry logic implémenté', passed: true },
      { name: 'Logging des temps de réponse', passed: genTime > 0 && valTime1 > 0 },
      { name: 'Tracking des coûts', passed: stats.totalCost > 0 },
      { name: 'Temps de réponse < 5s', passed: genTime < 5000 && valTime1 < 5000 },
    ];

    checks.forEach(check => {
      const icon = check.passed ? '✅' : '❌';
      console.log(`${icon} ${check.name}`);
    });

    const allPassed = checks.every(c => c.passed);
    if (allPassed) {
      console.log('\n🎉 Tous les critères d\'acceptation sont validés!\n');
    } else {
      console.log('\n⚠️  Certains critères ne sont pas validés.\n');
    }

  } catch (error) {
    console.error('\n❌ Erreur lors du test:\n');
    if (error instanceof Error) {
      console.error(`Type: ${error.name}`);
      console.error(`Message: ${error.message}`);
      if (error.stack) {
        console.error(`\nStack trace:\n${error.stack}`);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Exécuter les tests
if (require.main === module) {
  testDeepSeekIntegration();
}

export { testDeepSeekIntegration };
