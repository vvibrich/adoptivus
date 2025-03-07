/*
  # Update pets table columns

  1. Changes
    - Rename whatsapp column to contact_whatsapp
    - Ensure all columns have proper constraints

  2. Security
    - Maintain existing RLS policies
*/

-- Rename whatsapp column if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'whatsapp'
  ) THEN
    ALTER TABLE pets RENAME COLUMN whatsapp TO contact_whatsapp;
  END IF;
END $$;

-- Add contact_whatsapp column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'contact_whatsapp'
  ) THEN
    ALTER TABLE pets ADD COLUMN contact_whatsapp text NOT NULL;
  END IF;
END $$;