/*
  # Create pets table and storage

  1. New Tables
    - `pets`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `breed` (text)
      - `description` (text, required)
      - `whatsapp` (text, required)
      - `image_url` (text)
      - `is_litter` (boolean)
      - `litter_size` (integer)
      - `males_count` (integer)
      - `females_count` (integer)
      - `birth_date` (date)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on pets table
    - Add policies for:
      - Public read access
      - Authenticated users can create
      - Users can update/delete their own pets
*/

CREATE TABLE public.pets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    breed text,
    description text NOT NULL,
    whatsapp text NOT NULL,
    image_url text,
    is_litter boolean DEFAULT false,
    litter_size integer,
    males_count integer,
    females_count integer,
    birth_date date,
    user_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view pets"
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