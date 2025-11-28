-- Replace composite PK with a generated ID, keep pair unique
ALTER TABLE supervisor_assignment
  DROP CONSTRAINT IF EXISTS supervisor_assignment_pkey;

ALTER TABLE supervisor_assignment
  ADD COLUMN id bigserial;

ALTER TABLE supervisor_assignment
  ADD CONSTRAINT supervisor_assignment_pkey PRIMARY KEY (id);

ALTER TABLE supervisor_assignment
  ADD CONSTRAINT uq_supervisor_pair UNIQUE (lecturer_user_id, student_user_id);

ALTER TABLE checklist_item ADD COLUMN IF NOT EXISTS category VARCHAR(200);
