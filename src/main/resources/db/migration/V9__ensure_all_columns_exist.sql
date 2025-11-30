-- Migration V9: Ensure all required columns exist for StudentProfile and update thesis table constraints
-- This migration adds any missing columns and ensures data consistency

-- Ensure student_id column exists in thesis table (rename from student_user_id if needed)
ALTER TABLE thesis RENAME COLUMN IF EXISTS student_user_id TO student_id;

-- Ensure all required columns exist in student_profile
ALTER TABLE student_profile ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE student_profile ADD COLUMN IF NOT EXISTS faculty VARCHAR(255);

-- Ensure all required columns exist in lecturer_profile (already done in previous migrations)
-- Just ensure they're nullable or have appropriate defaults
ALTER TABLE lecturer_profile ALTER COLUMN name DROP NOT NULL;
ALTER TABLE lecturer_profile ALTER COLUMN faculty DROP NOT NULL;
ALTER TABLE lecturer_profile ALTER COLUMN major DROP NOT NULL;

-- Ensure thesis table has all necessary columns for publishing
ALTER TABLE thesis ADD COLUMN IF NOT EXISTS student_id BIGINT;
ALTER TABLE thesis ADD COLUMN IF NOT EXISTS year_published INTEGER;
ALTER TABLE thesis ADD COLUMN IF NOT EXISTS faculty VARCHAR(255);
ALTER TABLE thesis ADD COLUMN IF NOT EXISTS major VARCHAR(255);
ALTER TABLE thesis ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;
ALTER TABLE thesis ADD COLUMN IF NOT EXISTS student_name VARCHAR(255);
ALTER TABLE thesis ADD COLUMN IF NOT EXISTS supervisor_name VARCHAR(255);
ALTER TABLE thesis ADD COLUMN IF NOT EXISTS program VARCHAR(255);
ALTER TABLE thesis ADD COLUMN IF NOT EXISTS submission_year INTEGER;
