
-- Enum for project types
CREATE TYPE public.project_type AS ENUM ('departamentos', 'casas', 'barrio_cerrado', 'mixto');

-- Enum for project status
CREATE TYPE public.project_status AS ENUM ('en_pozo', 'en_construccion', 'entrega_inmediata');

-- Main projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  location_city TEXT NOT NULL,
  location_zone TEXT,
  project_type project_type NOT NULL DEFAULT 'departamentos',
  status project_status NOT NULL DEFAULT 'en_construccion',
  price_from NUMERIC,
  price_currency TEXT NOT NULL DEFAULT 'USD',
  estimated_yield NUMERIC,
  delivery_date TEXT,
  financing_available BOOLEAN DEFAULT false,
  amenities TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  developer_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Project images
CREATE TABLE public.project_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact leads
CREATE TABLE public.contact_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  lead_type TEXT DEFAULT 'contact', -- contact, dossier, visit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

-- Projects are publicly readable
CREATE POLICY "Projects are publicly readable"
ON public.projects FOR SELECT
USING (true);

-- Project images are publicly readable
CREATE POLICY "Project images are publicly readable"
ON public.project_images FOR SELECT
USING (true);

-- Anyone can submit a contact lead
CREATE POLICY "Anyone can submit contact leads"
ON public.contact_leads FOR INSERT
WITH CHECK (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_type ON public.projects(project_type);
CREATE INDEX idx_projects_city ON public.projects(location_city);
CREATE INDEX idx_projects_featured ON public.projects(featured);
CREATE INDEX idx_project_images_project ON public.project_images(project_id);
