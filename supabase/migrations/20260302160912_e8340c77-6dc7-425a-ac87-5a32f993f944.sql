
ALTER TABLE public.projects
  ADD COLUMN phase_preventa_date text DEFAULT NULL,
  ADD COLUMN phase_en_pozo_date text DEFAULT NULL,
  ADD COLUMN phase_construccion_date text DEFAULT NULL,
  ADD COLUMN phase_entrega_date text DEFAULT NULL;
