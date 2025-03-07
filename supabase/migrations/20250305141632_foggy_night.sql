/*
  # Update pets table policies

  1. Changes
    - Add existence checks before creating policies
    - Drop existing policies if they exist
    - Recreate policies with proper checks

  2. Security
    - Maintain same security rules:
      - Anyone can view pets
      - Only authenticated users can create pets
      - Only pet owners can update their pets
      - Only pet owners can delete their pets
*/

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can view pets" ON pets;
  DROP POLICY IF EXISTS "Authenticated users can create pets" ON pets;
  DROP POLICY IF EXISTS "Users can update own pets" ON pets;
  DROP POLICY IF EXISTS "Users can delete own pets" ON pets;
END $$;

-- Allow anyone to view pets
CREATE POLICY "Anyone can view pets"
  ON pets
  FOR SELECT
  USING (true);

-- Allow authenticated users to create pets
CREATE POLICY "Authenticated users can create pets"
  ON pets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to update their own pets
CREATE POLICY "Users can update own pets"
  ON pets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own pets
CREATE POLICY "Users can delete own pets"
  ON pets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);