-- Align with entity that uses a generated ID and keeps (thesis_id,item_id) unique
ALTER TABLE thesis_checklist
  DROP CONSTRAINT IF EXISTS thesis_checklist_pkey;

ALTER TABLE thesis_checklist
  ADD COLUMN id bigserial;

ALTER TABLE thesis_checklist
  ADD CONSTRAINT thesis_checklist_pkey PRIMARY KEY (id);

ALTER TABLE thesis_checklist
  ADD CONSTRAINT uq_thesis_checklist_pair UNIQUE (thesis_id, item_id);
