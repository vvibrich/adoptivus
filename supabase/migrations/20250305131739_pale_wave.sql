/*
  # Add WhatsApp contact column to pets table

  1. Changes
    - Add `whatsapp` column to store the contact number for the pet listing
    
  2. Notes
    - Column is required since we need a way to contact the person listing the pet
    - Using text type to accommodate international numbers and special characters
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'whatsapp'
  ) THEN
    ALTER TABLE pets ADD COLUMN whatsapp text NOT NULL;
  END IF;
END $$;