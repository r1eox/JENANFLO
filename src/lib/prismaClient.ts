import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const defaultDatabaseUrl = 'postgresql://postgres:Jnoa%401243%40%40@db.aksvhjtcukixjqibpcyn.supabase.co:5432/postgres';

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL ?? defaultDatabaseUrl;

  const adapter = new PrismaPg(connectionString);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
