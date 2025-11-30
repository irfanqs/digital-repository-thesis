-- Delete any existing user with email student1@su.ac.id to avoid duplicate email
DELETE FROM "user" WHERE email = 'student1@su.ac.id';

-- Update the email from student!@su.ac.id to student1@su.ac.id
UPDATE "user" SET email = 'student1@su.ac.id' WHERE email = 'student!@su.ac.id';
