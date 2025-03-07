/*
  # Add relationship between pets and profiles tables

  1. Changes
    - Add foreign key constraint from pets.user_id to profiles.id
    - Update pets table to ensure user_id is not null
    - Add indexes for better query performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add foreign key constraint
ALTER TABLE pets
ADD CONSTRAINT pets_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id)
ON DELETE CASCADE;

-- Add index for better join performance
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);

-- Ensure user_id is not null
ALTER TABLE pets
ALTER COLUMN user_id SET NOT NULL;