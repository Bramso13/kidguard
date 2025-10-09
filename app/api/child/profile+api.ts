import { PrismaClient } from '@/prisma/generated/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { auth } from '@/lib/auth';

/**
 * API Route: /api/child/profile
 * Handles child profile creation (POST) and listing (GET)
 */

// Helper function to get authenticated user
async function getAuthenticatedUserId(request: Request): Promise<string> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    throw new Error('UNAUTHORIZED');
  }

  return session.user.id;
}

// Helper function to create Prisma client
function createPrismaClient() {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());
}

// GET: List all children for authenticated parent
export async function GET(request: Request) {
  const prisma = createPrismaClient();

  try {
    const parentId = await getAuthenticatedUserId(request);

    const children = await prisma.childProfile.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json(children);
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
        { status: 401 }
      );
    }

    console.error('Error fetching children:', error);
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create new child profile
export async function POST(request: Request) {
  const prisma = createPrismaClient();

  try {
    const parentId = await getAuthenticatedUserId(request);
    const body = await request.json();

    // Validation
    const { name, age, avatar } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return Response.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Le nom est requis',
          },
        },
        { status: 400 }
      );
    }

    if (!age || typeof age !== 'number' || age < 6 || age > 14) {
      return Response.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: "L'âge doit être entre 6 et 14 ans",
          },
        },
        { status: 400 }
      );
    }

    // Create child profile
    const child = await prisma.childProfile.create({
      data: {
        parentId,
        name: name.trim(),
        age,
        avatar: avatar || null,
      },
    });

    return Response.json(child, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
        { status: 401 }
      );
    }

    console.error('Error creating child:', error);
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}