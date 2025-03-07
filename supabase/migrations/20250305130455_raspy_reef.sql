/*
  # Initial Schema for PetSpace

  1. New Tables
    - `pets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `species` (text) - dog, cat, etc.
      - `breed` (text)
      - `age` (int)
      - `description` (text)
      - `contact_whatsapp` (text)
      - `image_url` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `is_litter` (boolean)
      - `litter_size` (int, nullable)
      - `males_count` (int, nullable)
      - `females_count` (int, nullable)
      - `birth_date` (date, nullable)

  2. Security
    - Enable RLS on `pets` table
    - Add policies for:
      - Anyone can view pets
      - Authenticated users can create pets
      - Users can only update/delete their own pets
*/

CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  age int,
  description text,
  contact_whatsapp text NOT NULL,
  image_url text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_litter boolean DEFAULT false,
  litter_size int,
  males_count int,
  females_count int,
  birth_date date,
  
  CONSTRAINT valid_litter_data CHECK (
    (is_litter = false) OR 
    (is_litter = true AND litter_size IS NOT NULL AND males_count IS NOT NULL AND females_count IS NOT NULL AND birth_date IS NOT NULL)
  )
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view pets
CREATE POLICY "Anyone can view pets" 
  ON pets
  FOR SELECT 
  USING (true);

-- Policy to allow authenticated users to create pets
CREATE POLICY "Authenticated users can create pets" 
  ON pets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own pets
CREATE POLICY "Users can update own pets" 
  ON pets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own pets
CREATE POLICY "Users can delete own pets" 
  ON pets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);