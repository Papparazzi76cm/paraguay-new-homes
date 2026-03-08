
-- Add unit_type (custom denomination) to project_units
ALTER TABLE public.project_units ADD COLUMN IF NOT EXISTS unit_type text;

-- Create unit_media table for photos, floor plans, and virtual tours
CREATE TABLE public.unit_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.project_units(id) ON DELETE CASCADE,
  media_type text NOT NULL CHECK (media_type IN ('photo', 'floor_plan', 'virtual_tour')),
  media_url text NOT NULL,
  alt_text text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.unit_media ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Unit media is publicly readable" ON public.unit_media FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admins can insert unit media" ON public.unit_media FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update unit media" ON public.unit_media FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete unit media" ON public.unit_media FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Developer access for own project units
CREATE POLICY "Devs can insert own unit media" ON public.unit_media FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM project_units pu JOIN projects p ON p.id = pu.project_id
    WHERE pu.id = unit_media.unit_id AND p.developer_id = auth.uid()
  ));
CREATE POLICY "Devs can update own unit media" ON public.unit_media FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM project_units pu JOIN projects p ON p.id = pu.project_id
    WHERE pu.id = unit_media.unit_id AND p.developer_id = auth.uid()
  ));
CREATE POLICY "Devs can delete own unit media" ON public.unit_media FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM project_units pu JOIN projects p ON p.id = pu.project_id
    WHERE pu.id = unit_media.unit_id AND p.developer_id = auth.uid()
  ));
