import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

/**
 * GET /api/child/[id]
 * Récupère un profil enfant spécifique
 */
export async function GET(request: Request, { id }: { id: string }) {
  try {
    const child = await prisma.childProfile.findUnique({
      where: { id },
    });

    if (!child) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'NOT_FOUND',
            message: 'Profil enfant non trouvé',
          },
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(child), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil enfant:', error);
    return new Response(
      JSON.stringify({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erreur serveur',
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PUT /api/child/[id]
 * Met à jour un profil enfant (y compris les préférences d'exercices)
 */
export async function PUT(request: Request, { id }: { id: string }) {
  try {
    const body = await request.json();
    const {
      name,
      age,
      avatar,
      difficultyLevel,
      exerciseTypes,
      timeRewardMinutes,
      blockedAppCategories,
    } = body;

    // Validation: au moins un type d'exercice doit être sélectionné
    if (exerciseTypes && (!Array.isArray(exerciseTypes) || exerciseTypes.length === 0)) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Au moins un type d\'exercice doit être sélectionné',
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation de l'âge
    if (age && (age < 6 || age > 14)) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'L\'âge doit être entre 6 et 14 ans',
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation du temps de récompense
    if (timeRewardMinutes && (timeRewardMinutes < 5 || timeRewardMinutes > 60)) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Le temps de récompense doit être entre 5 et 60 minutes',
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Mise à jour du profil
    const updatedChild = await prisma.childProfile.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(age !== undefined && { age }),
        ...(avatar !== undefined && { avatar }),
        ...(difficultyLevel !== undefined && { difficultyLevel }),
        ...(exerciseTypes !== undefined && { exerciseTypes }),
        ...(timeRewardMinutes !== undefined && { timeRewardMinutes }),
        ...(blockedAppCategories !== undefined && { blockedAppCategories }),
      },
    });

    return new Response(JSON.stringify(updatedChild), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil enfant:', error);
    
    if (error.code === 'P2025') {
      return new Response(
        JSON.stringify({
          error: {
            code: 'NOT_FOUND',
            message: 'Profil enfant non trouvé',
          },
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erreur serveur',
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await prisma.$disconnect();
  }
}