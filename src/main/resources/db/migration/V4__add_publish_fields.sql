-- Add publication-related fields to thesis table
ALTER TABLE thesis ADD COLUMN year_published INTEGER;
ALTER TABLE thesis ADD COLUMN faculty VARCHAR(128);
ALTER TABLE thesis ADD COLUMN major VARCHAR(128);
ALTER TABLE thesis ADD COLUMN published_at TIMESTAMP;
