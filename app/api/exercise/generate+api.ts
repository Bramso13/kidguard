/**
 * Exercise Generation API Route
 * POST /api/exercise/generate
 *
 * Génère des exercices éducatifs pour un enfant en utilisant DeepSeek AI
 *
 * Request Body:
 * {
 *   "childId": "uuid",
 *   "subjectType": "math" | "reading" | "logic" | "vocabulary" (optionnel),
 *   "count": number (défaut: 1)
 * }
 *
 * Response:
 * {
 *   "exercises": [
 *     {
 *       "id": "uuid",
 *       "question": "Combien font 5 + 3 ?",
 *       "answer": "8",
 *       "hints": ["Pense aux doigts"],
 *       "type": "math",
 *       "difficulty": "easy"
 *     }
 *   ],
 *   "responseTime": 1500
 * }
 */

import { PrismaClient } from '@/prisma/generated/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { DeepSeekService } from '@/lib/services/deepseek';
import { buildExercisePrompt } from '@/lib/prompts/exercise-generation';
import type { ExerciseType } from '@/lib/types';

// Types pour les requêtes et réponses
interface GenerateExerciseRequest {
  childId: string;
  subjectType?: ExerciseType;
  count?: number;
}

interface ExerciseResponse {
  id: string;
  question: string;
  answer: string;
  hints: string[];
  type: string;
  difficulty: string;
}

interface GenerateExerciseResponse {
  exercises: ExerciseResponse[];
  responseTime: number;
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

/**
 * Crée une réponse d'erreur formatée
 */
function createErrorResponse(
  code: string,
  message: string,
  status: number,
  details?: any
): Response {
  const error: ApiError = {
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(error), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * POST /api/exercise/generate
 * Génère des exercices pour un enfant
 */
export async function POST(request: Request) {
  const startTime = Date.now();
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // 1. Parser et valider la requête
    let body: GenerateExerciseRequest;
    try {
      body = await request.json();
    } catch (error) {
      return createErrorResponse(
        'INVALID_JSON',
        'Corps de requête JSON invalide',
        400
      );
    }

    const { childId, subjectType, count = 1 } = body;

    // Validation des paramètres
    if (!childId) {
      return createErrorResponse(
        'MISSING_CHILD_ID',
        'Le paramètre childId est requis',
        400
      );
    }

    if (count < 1 || count > 10) {
      return createErrorResponse(
        'INVALID_COUNT',
        'Le paramètre count doit être entre 1 et 10',
        400,
        { count }
      );
    }

    if (
      subjectType &&
      !['math', 'reading', 'logic', 'vocabulary'].includes(subjectType)
    ) {
      return createErrorResponse(
        'INVALID_SUBJECT_TYPE',
        'Type de sujet invalide',
        400,
        { subjectType, validTypes: ['math', 'reading', 'logic', 'vocabulary'] }
      );
    }

    // 2. Récupérer le profil de l'enfant
    console.log(`[Exercise Generation] Fetching child profile: ${childId}`);
    const childProfile = await prisma.childProfile.findUnique({
      where: { id: childId },
    });

    if (!childProfile) {
      return createErrorResponse(
        'CHILD_NOT_FOUND',
        'Profil enfant introuvable',
        404,
        { childId }
      );
    }

    // 3. Déterminer le type d'exercice
    let exerciseType: ExerciseType;
    if (subjectType) {
      // Vérifier que le type est activé pour cet enfant
      if (!childProfile.exerciseTypes.includes(subjectType)) {
        return createErrorResponse(
          'SUBJECT_TYPE_DISABLED',
          `Le type ${subjectType} n'est pas activé pour cet enfant`,
          400,
          {
            requestedType: subjectType,
            enabledTypes: childProfile.exerciseTypes,
          }
        );
      }
      exerciseType = subjectType;
    } else {
      // Choisir aléatoirement parmi les types activés
      const enabledTypes = childProfile.exerciseTypes;
      if (enabledTypes.length === 0) {
        return createErrorResponse(
          'NO_ENABLED_TYPES',
          'Aucun type d\'exercice n\'est activé pour cet enfant',
          400
        );
      }
      exerciseType =
        enabledTypes[Math.floor(Math.random() * enabledTypes.length)];
    }

    console.log(
      `[Exercise Generation] Type: ${exerciseType}, Difficulty: ${childProfile.difficultyLevel}, Age: ${childProfile.age}`
    );

    // 4. Générer les exercices via DeepSeek
    const deepseek = new DeepSeekService();
    const prompt = buildExercisePrompt({
      age: childProfile.age,
      difficulty: childProfile.difficultyLevel.toLowerCase() as any,
      type: exerciseType,
      count,
    });

    let generatedExercises;
    try {
      console.log(`[Exercise Generation] Calling DeepSeek API...`);
      generatedExercises = await deepseek.generateExercises(prompt, count);
      console.log(
        `[Exercise Generation] DeepSeek returned ${generatedExercises.length} exercises`
      );
    } catch (error) {
      console.error('[Exercise Generation] DeepSeek API failed:', error);

      // TODO: Implémenter le fallback avec des exercices pré-générés
      // Pour l'instant, retourner une erreur
      return createErrorResponse(
        'EXERCISE_GENERATION_FAILED',
        'Échec de la génération d\'exercices',
        503,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          note: 'Fallback exercises not yet implemented',
        }
      );
    }

    // 5. Sauvegarder les exercices en base de données
    const savedExercises = [];
    for (const exercise of generatedExercises) {
      try {
        const saved = await prisma.exercise.create({
          data: {
            childId: childProfile.id,
            type: exerciseType.toUpperCase() as any,
            difficulty: childProfile.difficultyLevel,
            question: exercise.question,
            correctAnswer: exercise.correctAnswer,
            hints: exercise.hints,
            metadata: {
              ageRange: `${childProfile.age}`,
              topic: exercise.topic,
              deepseekModel: 'deepseek-chat',
              generatedAt: new Date().toISOString(),
            },
            isFallback: false,
          },
        });

        savedExercises.push(saved);
        console.log(`[Exercise Generation] Saved exercise: ${saved.id}`);
      } catch (dbError) {
        console.error(
          '[Exercise Generation] Failed to save exercise:',
          dbError
        );
        // Continue avec les autres exercices
      }
    }

    if (savedExercises.length === 0) {
      return createErrorResponse(
        'SAVE_FAILED',
        'Échec de la sauvegarde des exercices',
        500
      );
    }

    // 6. Formater la réponse
    const responseTime = Date.now() - startTime;
    const response: GenerateExerciseResponse = {
      exercises: savedExercises.map((ex) => ({
        id: ex.id,
        question: ex.question,
        answer: ex.correctAnswer,
        hints: ex.hints,
        type: ex.type.toLowerCase(),
        difficulty: ex.difficulty.toLowerCase(),
      })),
      responseTime,
    };

    console.log(
      `[Exercise Generation] Success! Generated ${response.exercises.length} exercises in ${responseTime}ms`
    );

    // Vérifier le temps de réponse (<2s requirement)
    if (responseTime > 2000) {
      console.warn(
        `[Exercise Generation] Response time exceeded target: ${responseTime}ms > 2000ms`
      );
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Exercise Generation] Unexpected error:', error);

    return createErrorResponse(
      'INTERNAL_ERROR',
      'Erreur interne du serveur',
      500,
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    );
  } finally {
    // Toujours déconnecter Prisma
    await prisma.$disconnect();
  }
}
