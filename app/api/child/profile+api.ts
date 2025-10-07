import { PrismaClient } from '@prisma/client/edge';
import { DifficultyLevel } from '@/lib/types';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

/**
 * GET /api/child/profile
 * Récupère la liste des profils enfants pour le parent authentifié
 */
export async function GET(request: Request) {
  try {
    // TODO: Ajouter l'authentification avec Better Auth
    // const session = await auth.api.getSession({ headers: request.headers });
    // if (!session?.user?.id) {
    //   return Response.json({ error: { code: 'UNAUTHORIZED', message: 'Non authentifié' } }, { status: 401 });
    // }

    // Pour l'instant, utiliser un ID de test
    const userId = 'test-user-id';

    const children = await prisma.childProfile.findMany({
      where: {
        parentId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json(children);
  } catch (error) {
    console.error('Erreur lors de la récupération des profils:', error);
    return Response.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erreur lors de la récupération des profils',
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/child/profile
 * Crée un nouveau profil enfant
 */
export async function POST(request: Request) {
  try {
    // TODO: Ajouter l'authentification avec Better Auth
    // const session = await auth.api.getSession({ headers: request.headers });
    // if (!session?.user?.id) {
    //   return Response.json({ error: { code: 'UNAUTHORIZED', message: 'Non authentifié' } }, { status: 401 });
    // }

    // Pour l'instant, utiliser un ID de test
    const userId = 'test-user-id';

    const body = await request.json();

    // Validation des données
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return Response.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Le prénom est requis',
          },
        },
        { status: 400 }
      );
    }

    if (!body.age || typeof body.age !== 'number' || body.age < 6 || body.age > 14) {
      return Response.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'L\'âge doit être entre 6 et 14 ans',
          },
        },
        { status: 400 }
      );
    }

    if (
      !body.timeRewardMinutes ||
      typeof body.timeRewardMinutes !== 'number' ||
      body.timeRewardMinutes < 5 ||
      body.timeRewardMinutes > 60
    ) {
      return Response.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Le temps de récompense doit être entre 5 et 60 minutes',
          },
        },
        { status: 400 }
      );
    }

    const validDifficultyLevels: DifficultyLevel[] = ['easy', 'medium', 'hard'];
    if (!body.difficultyLevel || !validDifficultyLevels.includes(body.difficultyLevel)) {
      return Response.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Niveau de difficulté invalide',
          },
        },
        { status: 400 }
      );
    }

    // Créer le profil enfant
    const child = await prisma.childProfile.create({
      data: {
        parentId: userId,
        name: body.name.trim(),
        age: body.age,
        difficultyLevel: body.difficultyLevel.toUpperCase() as any, // Convertir en enum Prisma
        timeRewardMinutes: body.timeRewardMinutes,
        avatar: body.avatar || null,
        exerciseTypes: body.exerciseTypes || ['MATH', 'READING', 'LOGIC', 'VOCABULARY'],
        blockedAppCategories: body.blockedAppCategories || [],
      },
    });

    return Response.json(child, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du profil:', error);
    return Response.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erreur lors de la création du profil',
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}