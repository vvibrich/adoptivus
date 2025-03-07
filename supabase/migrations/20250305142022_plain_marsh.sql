/*
  # Create pets table

  1. New Tables
    - `pets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `species` (text)
      - `breed` (text, optional)
      - `description` (text)
      - `image_url` (text, optional)
      - `contact_whatsapp` (text)
      - `is_litter` (boolean)
      - `litter_size` (integer, optional)
      - `males_count` (integer, optional)
      - `females_count` (integer, optional)
      - `birth_date` (date, optional)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `pets` table
    - Add policies for:
      - Anyone can read pets
      - Authenticated users can create pets
      - Users can update/delete their own pets
*/

CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  description text NOT NULL,
  image_url text,
  contact_whatsapp text NOT NULL,
  is_litter boolean DEFAULT false,
  litter_size integer,
  males_count integer,
  females_count integer,
  birth_date date,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read pets
CREATE POLICY "Anyone can read pets"
  ON pets
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create pets
CREATE POLICY "Authenticated users can create pets"
  ON pets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

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