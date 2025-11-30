-- Add major column to lecturer_profile
ALTER TABLE lecturer_profile ADD COLUMN IF NOT EXISTS major VARCHAR(255);
