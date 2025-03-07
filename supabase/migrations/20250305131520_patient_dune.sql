/*
  # Add birth date to pets table

  1. Changes
    - Add `birth_date` column to `pets` table to store pet's birth date
    - Column is optional (nullable) since exact birth date may not be known
    - Uses `date` type to store only the date portion without time
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE pets ADD COLUMN birth_date date;
  END IF;
END $$;