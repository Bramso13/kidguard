import { PrismaClient } from '@/prisma/generated/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { auth } from '@/lib/auth';

/**
 * API Route: /api/child/[id]
 * Handles individual child profile operations (GET, PUT, DELETE)
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

// Helper function to extract child ID from URL
function getChildId(request: Request): string {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

// GET: Get specific child profile
export async function GET(request: Request) {
  const prisma = createPrismaClient();

  try {
    const parentId = await getAuthenticatedUserId(request);
    const childId = getChildId(request);

    const child = await prisma.childProfile.findFirst({
      where: {
        id: childId,
        parentId, // Ensure parent owns this child
      },
    });

    if (!child) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: 'Enfant non trouvé' } },
        { status: 404 }
      );
    }

    return Response.json(child);
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
        { status: 401 }
      );
    }

    console.error('Error fetching child:', error);
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Update child profile
export async function PUT(request: Request) {
  const prisma = createPrismaClient();

  try {
    const parentId = await getAuthenticatedUserId(request);
    const childId = getChildId(request);
    const body = await request.json();

    // Check if child exists and belongs to parent
    const existingChild = await prisma.childProfile.findFirst({
      where: {
        id: childId,
        parentId,
      },
    });

    if (!existingChild) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: 'Enfant non trouvé' } },
        { status: 404 }
      );
    }

    // Validation
    const { name, age, avatar } = body;

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
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
    }

    if (age !== undefined) {
      if (typeof age !== 'number' || age < 6 || age > 14) {
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
    }

    // Update child profile
    const updatedChild = await prisma.childProfile.update({
      where: { id: childId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(age !== undefined && { age }),
        ...(avatar !== undefined && { avatar: avatar || null }),
      },
    });

    return Response.json(updatedChild);
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
        { status: 401 }
      );
    }

    console.error('Error updating child:', error);
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Delete child profile
export async function DELETE(request: Request) {
  const prisma = createPrismaClient();

  try {
    const parentId = await getAuthenticatedUserId(request);
    const childId = getChildId(request);

    // Check if child exists and belongs to parent
    const existingChild = await prisma.childProfile.findFirst({
      where: {
        id: childId,
        parentId,
      },
    });

    if (!existingChild) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: 'Enfant non trouvé' } },
        { status: 404 }
      );
    }

    // Delete child profile
    await prisma.childProfile.delete({
      where: { id: childId },
    });

    return Response.json({ success: true, message: 'Enfant supprimé' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
        { status: 401 }
      );
    }

    console.error('Error deleting child:', error);
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}