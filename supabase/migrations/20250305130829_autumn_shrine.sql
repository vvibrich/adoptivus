/*
  # Create pets table

  1. New Tables
    - `pets`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `breed` (text)
      - `description` (text)
      - `image_url` (text)
      - `whatsapp` (text, required)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with timezone)
      - `is_litter` (boolean)
      - `litter_size` (integer)
      - `males_count` (integer)
      - `females_count` (integer)
      - `birth_date` (date)

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
  breed text,
  description text,
  image_url text,
  whatsapp text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  is_litter boolean DEFAULT false,
  litter_size integer,
  males_count integer,
  females_count integer,
  birth_date date
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view pets
CREATE POLICY "Anyone can view pets"
  ON pets
  FOR SELECT
  TO public
  USING (true);

-- Policy to allow authenticated users to create pets
CREATE POLICY "Authenticated users can create pets"
  ON pets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own pets
CREATE POLICY "Users can update their own pets"
  ON pets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own pets
CREATE POLICY "Users can delete their own pets"
  ON pets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);