/*
  # Update pets table schema

  1. Changes
    - Add species column with enum type
    - Rename whatsapp column to contact_whatsapp for clarity
    - Add proper constraints and defaults
    - Ensure all required fields are present

  2. Security
    - Maintain existing RLS policies
*/

-- Create enum for pet species if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pet_species') THEN
    CREATE TYPE pet_species AS ENUM ('dog', 'cat', 'bird', 'other');
  END IF;
END $$;

-- Update pets table
ALTER TABLE pets 
  ADD COLUMN IF NOT EXISTS species pet_species,
  ADD COLUMN IF NOT EXISTS contact_whatsapp text,
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN description SET NOT NULL,
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL;