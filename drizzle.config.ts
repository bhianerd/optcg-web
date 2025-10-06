import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.VITE_DATABASE_URL || 'postgresql://postgres:postgres@localhost:54322/postgres',
  },
} satisfies Config;