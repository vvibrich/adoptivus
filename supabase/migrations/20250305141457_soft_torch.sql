/*
  # Create pets table and security policies

  1. New Tables
    - `pets`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `species` (text, required)
      - `breed` (text)
      - `description` (text, required)
      - `contact_whatsapp` (text, required)
      - `image_url` (text)
      - `is_litter` (boolean)
      - `litter_size` (integer)
      - `males_count` (integer)
      - `females_count` (integer)
      - `birth_date` (date)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `pets` table
    - Add policies for:
      - Anyone can view pets (SELECT)
      - Only authenticated users can create pets (INSERT)
      - Only pet owners can update their pets (UPDATE)
      - Only pet owners can delete their pets (DELETE)
*/

CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  description text NOT NULL,
  contact_whatsapp text NOT NULL,
  image_url text,
  is_litter boolean DEFAULT false,
  litter_size integer,
  males_count integer,
  females_count integer,
  birth_date date,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

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