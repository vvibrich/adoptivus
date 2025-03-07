/*
  # Update pets table schema

  1. Changes
    - Ensure species column exists and has proper constraints
    - Ensure contact_whatsapp column has proper constraints

  2. Security
    - Maintain existing RLS policies
*/

-- Add species column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'species'
  ) THEN
    ALTER TABLE pets ADD COLUMN species text NOT NULL;
  END IF;
END $$;

-- Add NOT NULL constraint to contact_whatsapp if not already set
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' 
    AND column_name = 'contact_whatsapp' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE pets ALTER COLUMN contact_whatsapp SET NOT NULL;
  END IF;
END $$;