-- Add WhatsApp field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Create adoption_requests table
CREATE TABLE IF NOT EXISTS adoption_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS adoption_requests_pet_id_idx ON adoption_requests(pet_id);
CREATE INDEX IF NOT EXISTS adoption_requests_requester_id_idx ON adoption_requests(requester_id);
CREATE INDEX IF NOT EXISTS adoption_requests_owner_id_idx ON adoption_requests(owner_id);
CREATE INDEX IF NOT EXISTS adoption_requests_status_idx ON adoption_requests(status);

-- Create RLS policies
ALTER TABLE adoption_requests ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own requests (as requester)
CREATE POLICY "Users can view their own adoption requests"
    ON adoption_requests FOR SELECT
    USING (auth.uid() = requester_id);

-- Policy for users to view requests for their pets (as owner)
CREATE POLICY "Users can view adoption requests for their pets"
    ON adoption_requests FOR SELECT
    USING (auth.uid() = owner_id);

-- Policy for users to create adoption requests
CREATE POLICY "Users can create adoption requests"
    ON adoption_requests FOR INSERT
    WITH CHECK (auth.uid() = requester_id);

-- Policy for pet owners to update request status
CREATE POLICY "Pet owners can update request status"
    ON adoption_requests FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_adoption_requests_updated_at
    BEFORE UPDATE ON adoption_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 