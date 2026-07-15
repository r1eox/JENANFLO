import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasourceUrl: process.env.DATABASE_URL ?? "postgresql://postgres:Jnoa%401243%40%40@db.aksvhjtcukixjqibpcyn.supabase.co:5432/postgres",
});
