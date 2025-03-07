/*
  # Update pets table policies

  1. Changes
    - Add safety checks before creating policies
    - Ensure policies are created only if they don't exist

  2. Security
    - Maintain existing RLS policies with proper checks
    - Keep the same security rules:
      - Public read access
      - Authenticated users can create
      - Users can update/delete their own pets
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pets' 
    AND policyname = 'Anyone can read pets'
  ) THEN
    DROP POLICY "Anyone can read pets" ON pets;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pets' 
    AND policyname = 'Authenticated users can create pets'
  ) THEN
    DROP POLICY "Authenticated users can create pets" ON pets;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pets' 
    AND policyname = 'Users can update their own pets'
  ) THEN
    DROP POLICY "Users can update their own pets" ON pets;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pets' 
    AND policyname = 'Users can delete their own pets'
  ) THEN
    DROP POLICY "Users can delete their own pets" ON pets;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "Anyone can read pets"
  ON pets
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create pets"
  ON pets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own pets"
  ON pets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets"
  ON pets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);