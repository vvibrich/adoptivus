/*
  # Update pets and profiles relationship

  1. Changes
    - Add foreign key constraint if it doesn't exist
    - Add index for better query performance
    - Ensure user_id is not null

  2. Security
    - Maintain existing RLS policies
*/

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'pets_user_id_fkey'
  ) THEN
    ALTER TABLE pets
    ADD CONSTRAINT pets_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add index if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE indexname = 'idx_pets_user_id'
  ) THEN
    CREATE INDEX idx_pets_user_id ON pets(user_id);
  END IF;
END $$;

-- Ensure user_id is not null if it isn't already
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'pets' 
    AND column_name = 'user_id' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE pets
    ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;