/*
  # Add litter-related columns to pets table

  1. Changes
    - Add `is_litter` column to indicate if the pet entry is for a litter
    - Add `litter_size` column to store the total number of puppies/kittens
    - Add `males_count` column to store the number of male puppies/kittens
    - Add `females_count` column to store the number of female puppies/kittens
    
  2. Notes
    - All new columns are nullable since they're only used for litters
    - Using snake_case for column names to follow PostgreSQL conventions
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'is_litter'
  ) THEN
    ALTER TABLE pets ADD COLUMN is_litter boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'litter_size'
  ) THEN
    ALTER TABLE pets ADD COLUMN litter_size integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'males_count'
  ) THEN
    ALTER TABLE pets ADD COLUMN males_count integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'females_count'
  ) THEN
    ALTER TABLE pets ADD COLUMN females_count integer;
  END IF;
END $$;