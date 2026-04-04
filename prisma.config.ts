import path from 'node:path';
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasourceUrl: process.env.DATABASE_URL ?? "postgresql://postgres:Jnoa%401243%40%40@db.rbqaumrqibkpnrdlggvk.supabase.co:5432/postgres",
});
