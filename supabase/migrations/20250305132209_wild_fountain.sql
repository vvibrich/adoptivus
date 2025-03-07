/*
  # Add species column to pets table

  1. Changes
    - Add required `species` column to `pets` table
    - Add enum type for species
    - Set default policies for the new column

  2. Security
    - Maintain existing RLS policies
*/

-- Create enum for species
CREATE TYPE pet_species AS ENUM ('dog', 'cat', 'bird', 'other');

-- Add species column
ALTER TABLE pets ADD COLUMN species pet_species NOT NULL;