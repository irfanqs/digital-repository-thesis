-- Add name and faculty columns to student_profile
ALTER TABLE student_profile ADD COLUMN name VARCHAR(255);
ALTER TABLE student_profile ADD COLUMN faculty VARCHAR(255);

-- Add name and faculty columns to lecturer_profile
ALTER TABLE lecturer_profile ADD COLUMN name VARCHAR(255);
ALTER TABLE lecturer_profile ADD COLUMN faculty VARCHAR(255);
