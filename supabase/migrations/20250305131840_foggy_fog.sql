/*
  # Add RLS policies for pets table

  1. Security Changes
    - Enable RLS on pets table
    - Add policies for:
      - Anyone can view pets (SELECT)
      - Authenticated users can create pets (INSERT)
      - Users can update/delete their own pets (UPDATE/DELETE)

  2. Notes
    - SELECT policy is public to allow browsing pets without authentication
    - INSERT policy requires authentication
    - UPDATE/DELETE policies restricted to pet owners
*/

-- Enable RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Allow public access to view pets
CREATE POLICY "Anyone can view pets"
  ON pets
  FOR SELECT
  USING (true);

-- Allow authenticated users to create pets
CREATE POLICY "Authenticated users can create pets"
  ON pets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own pets
CREATE POLICY "Users can update their own pets"
  ON pets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own pets
CREATE POLICY "Users can delete their own pets"
  ON pets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);