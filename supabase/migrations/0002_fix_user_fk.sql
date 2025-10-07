-- Drop the foreign key constraint from decks to users
ALTER TABLE "decks" DROP CONSTRAINT IF EXISTS "decks_user_id_users_id_fk";

-- Change user_id column type to UUID (it should already be, but just in case)
-- We'll rely on auth.uid() for RLS instead of a foreign key to our users table

-- Drop the users table since we're using Supabase's built-in auth.users
DROP TABLE IF EXISTS "users" CASCADE;
