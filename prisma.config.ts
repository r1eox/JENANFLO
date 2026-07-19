import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
config({ path: path.resolve(process.cwd(), '.env'), override: true });

const defaultDatabaseUrl = 'postgresql://postgres:Jnoa%401243%40%40@db.aksvhjtcukixjqibpcyn.supabase.co:5432/postgres';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL ?? defaultDatabaseUrl,
  },
});
