
-- Create enum for unit typology
CREATE TYPE public.unit_typology AS ENUM ('monoambiente', '1_dormitorio', '2_dormitorios', '3_dormitorios');

-- Create table for project units
CREATE TABLE public.project_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  unit_name TEXT NOT NULL,
  typology unit_typology NOT NULL DEFAULT 'monoambiente',
  area_m2 NUMERIC,
  price NUMERIC,
  price_currency TEXT NOT NULL DEFAULT 'USD',
  floor TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_units ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Units are publicly readable" ON public.project_units FOR SELECT USING (true);

-- Admin manage
CREATE POLICY "Admins can insert units" ON public.project_units FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update units" ON public.project_units FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete units" ON public.project_units FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
