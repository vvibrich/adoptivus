/*
  # Add user_id to pets table and create relationship with profiles

  1. Changes
    - Add user_id column to pets table
    - Add foreign key constraint to link pets with profiles
    - Update RLS policies to use user_id

  2. Security
    - Enable RLS on pets table
    - Add policies for authenticated users
*/

-- Add user_id column and foreign key constraint
ALTER TABLE pets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Enable RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all pets"
ON pets
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Users can create pets"
ON pets
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets"
ON pets
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets"
ON pets
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);