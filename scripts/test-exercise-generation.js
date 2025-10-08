/**
 * Script de test pour l'API de génération d'exercices
 * Usage: node scripts/test-exercise-generation.js
 */

// Note: Ce script nécessite d'avoir:
// 1. Un profil enfant créé dans la base de données
// 2. La variable DEEPSEEK_API_KEY configurée
// 3. Les migrations Prisma exécutées

const API_BASE_URL = 'http://localhost:8081';

async function testExerciseGeneration() {
  console.log('🧪 Test de l\'API de génération d\'exercices\n');

  // Test 1: Génération d'un exercice de math
  console.log('Test 1: Génération d\'un exercice de math...');
  try {
    const response1 = await fetch(
      `${API_BASE_URL}/api/exercise/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: 'YOUR_TEST_CHILD_ID', // À remplacer
          subjectType: 'math',
          count: 1,
        }),
      }
    );

    const data1 = await response1.json();
    console.log('✅ Status:', response1.status);
    console.log('📊 Response:', JSON.stringify(data1, null, 2));
    console.log(`⏱️  Temps: ${data1.responseTime}ms\n`);
  } catch (error) {
    console.error('❌ Erreur:', error.message, '\n');
  }

  // Test 2: Génération de 3 exercices aléatoires
  console.log('Test 2: Génération de 3 exercices aléatoires...');
  try {
    const response2 = await fetch(
      `${API_BASE_URL}/api/exercise/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: 'YOUR_TEST_CHILD_ID', // À remplacer
          count: 3,
        }),
      }
    );

    const data2 = await response2.json();
    console.log('✅ Status:', response2.status);
    console.log(
      `📊 Généré ${data2.exercises?.length || 0} exercices`
    );
    console.log(`⏱️  Temps: ${data2.responseTime}ms\n`);
  } catch (error) {
    console.error('❌ Erreur:', error.message, '\n');
  }

  // Test 3: Erreur - Child not found
  console.log('Test 3: Erreur - Child not found...');
  try {
    const response3 = await fetch(
      `${API_BASE_URL}/api/exercise/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: 'non-existent-id',
          count: 1,
        }),
      }
    );

    const data3 = await response3.json();
    console.log('📊 Status:', response3.status);
    console.log('📊 Error:', JSON.stringify(data3, null, 2), '\n');
  } catch (error) {
    console.error('❌ Erreur:', error.message, '\n');
  }

  // Test 4: Erreur - Count invalide
  console.log('Test 4: Erreur - Count invalide...');
  try {
    const response4 = await fetch(
      `${API_BASE_URL}/api/exercise/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: 'YOUR_TEST_CHILD_ID', // À remplacer
          count: 20, // Invalide (max 10)
        }),
      }
    );

    const data4 = await response4.json();
    console.log('📊 Status:', response4.status);
    console.log('📊 Error:', JSON.stringify(data4, null, 2), '\n');
  } catch (error) {
    console.error('❌ Erreur:', error.message, '\n');
  }

  console.log('✨ Tests terminés!');
}

// Exécuter les tests
testExerciseGeneration().catch(console.error);
