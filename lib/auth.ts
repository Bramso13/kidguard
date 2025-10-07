import { PrismaClient } from '@/prisma/generated/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { expo } from '@better-auth/expo';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [expo()],
  user: {
    modelName: 'User',
  },
  trustedOrigins: ['http://localhost:8081', 'kidguard://'],
});
