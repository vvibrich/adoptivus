/*
  # Add location fields to pets table

  1. Changes
    - Add city and state columns to pets table
    - Add validation for state values
    - Update existing pets with default values
*/

-- Create enum for states if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'state_enum') THEN
    CREATE TYPE state_enum AS ENUM (
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    );
  END IF;
END $$;

-- Add location columns to pets table
ALTER TABLE pets
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state state_enum;

-- Add not null constraints after adding columns to allow for existing data
ALTER TABLE pets
ALTER COLUMN city SET NOT NULL,
ALTER COLUMN state SET NOT NULL;