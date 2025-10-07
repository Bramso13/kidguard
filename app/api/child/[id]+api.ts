import { PrismaClient } from '@prisma/client/edge';
import { DifficultyLevel } from '@/lib/types';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

/**
 * GET /api/child/:id
 * Récupère un profil enfant spécifique
 */
export async function GET(request: Request, { id }: { id: string }) {
  try {
    // TODO: Ajouter l'authentification avec Better Auth
    // const session = await auth.api.getSession({ headers: request.headers });
    // if (!session?.user?.id) {
    //   return Response.json({ error: { code: 'UNAUTHORIZED', message: 'Non authentifié' } }, { status: 401 });
    // }

    // Pour l'instant, utiliser un ID de test
    const userId = 'test-user-id';

    const child = await prisma.childProfile.findFirst({
      where: {
        id,
        parentId: userId, // Vérifier que le profil appartient au parent
      },
    });

    if (!child) {
      return Response.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Profil enfant non trouvé',
          },
        },
        { status: 404 }
      );
    }

    return Response.json(child);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return Response.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erreur lors de la récupération du profil',
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PUT /api/child/:id
 * Met à jour un profil enfant
 */
export async function PUT(request: Request, { id }: { id: string }) {
  try {
    // TODO: Ajouter l'authentification avec Better Auth
    // const session = await auth.api.getSession({ headers: request.headers });
    // if (!session?.user?.id) {
    //   return Response.json({ error: { code: 'UNAUTHORIZED', message: 'Non authentifié' } }, { status: 401 });
    // }

    // Pour l'instant, utiliser un ID de test
    const userId = 'test-user-id';

    // Vérifier que le profil existe et appartient au parent
    const existingChild = await prisma.childProfile.findFirst({
      where: {
        id,
        parentId: userId,
      },
    });

    if (!existingChild) {
      return Response.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Profil enfant non trouvé',
          },
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validation des données (si fournies)
    if (body.name !== undefined && (!body.name || typeof body.name !== 'string' || !body.name.trim())) {
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

    if (body.age !== undefined && (typeof body.age !== 'number' || body.age < 6 || body.age > 14)) {
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
      body.timeRewardMinutes !== undefined &&
      (typeof body.timeRewardMinutes !== 'number' ||
        body.timeRewardMinutes < 5 ||
        body.timeRewardMinutes > 60)
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
    if (body.difficultyLevel !== undefined && !validDifficultyLevels.includes(body.difficultyLevel)) {
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

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (body.name !== undefined) {
      updateData.name = body.name.trim();
    }

    if (body.age !== undefined) {
      updateData.age = body.age;
    }

    if (body.difficultyLevel !== undefined) {
      updateData.difficultyLevel = body.difficultyLevel.toUpperCase(); // Convertir en enum Prisma
    }

    if (body.timeRewardMinutes !== undefined) {
      updateData.timeRewardMinutes = body.timeRewardMinutes;
    }

    if (body.avatar !== undefined) {
      updateData.avatar = body.avatar;
    }

    if (body.exerciseTypes !== undefined) {
      updateData.exerciseTypes = body.exerciseTypes.map((t: string) => t.toUpperCase());
    }

    if (body.blockedAppCategories !== undefined) {
      updateData.blockedAppCategories = body.blockedAppCategories;
    }

    // Mettre à jour le profil
    const updatedChild = await prisma.childProfile.update({
      where: {
        id,
      },
      data: updateData,
    });

    return Response.json(updatedChild);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return Response.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erreur lors de la mise à jour du profil',
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/child/:id
 * Supprime un profil enfant
 */
export async function DELETE(request: Request, { id }: { id: string }) {
  try {
    // TODO: Ajouter l'authentification avec Better Auth
    // const session = await auth.api.getSession({ headers: request.headers });
    // if (!session?.user?.id) {
    //   return Response.json({ error: { code: 'UNAUTHORIZED', message: 'Non authentifié' } }, { status: 401 });
    // }

    // Pour l'instant, utiliser un ID de test
    const userId = 'test-user-id';

    // Vérifier que le profil existe et appartient au parent
    const existingChild = await prisma.childProfile.findFirst({
      where: {
        id,
        parentId: userId,
      },
    });

    if (!existingChild) {
      return Response.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Profil enfant non trouvé',
          },
        },
        { status: 404 }
      );
    }

    // Supprimer le profil
    await prisma.childProfile.delete({
      where: {
        id,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    return Response.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erreur lors de la suppression du profil',
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}