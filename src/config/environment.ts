// Environment configuration
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here',
  },
  database: {
    url: import.meta.env.VITE_DATABASE_URL || 'postgresql://postgres:postgres@localhost:54322/postgres',
  },
}

