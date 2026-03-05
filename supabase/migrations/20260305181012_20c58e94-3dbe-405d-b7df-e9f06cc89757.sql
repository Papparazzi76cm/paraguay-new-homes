
-- 1. Add developer_id to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS developer_id uuid;

-- 2. Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  preferred_cities text[] DEFAULT '{}',
  preferred_zones text[] DEFAULT '{}',
  preferred_project_types text[] DEFAULT '{}',
  preferred_typologies text[] DEFAULT '{}',
  price_min numeric,
  price_max numeric,
  price_currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all preferences" ON public.user_preferences FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Developers can view preferences" ON public.user_preferences FOR SELECT USING (public.has_role(auth.uid(), 'developer'));

-- 3. Developer project RLS
CREATE POLICY "Developers can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = developer_id);
CREATE POLICY "Developers can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = developer_id);
CREATE POLICY "Developers can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = developer_id);

-- 4. Developer image RLS
CREATE POLICY "Devs can insert own project images" ON public.project_images FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND developer_id = auth.uid()));
CREATE POLICY "Devs can update own project images" ON public.project_images FOR UPDATE USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND developer_id = auth.uid()));
CREATE POLICY "Devs can delete own project images" ON public.project_images FOR DELETE USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND developer_id = auth.uid()));

-- 5. Developer unit RLS
CREATE POLICY "Devs can insert own project units" ON public.project_units FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND developer_id = auth.uid()));
CREATE POLICY "Devs can update own project units" ON public.project_units FOR UPDATE USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND developer_id = auth.uid()));
CREATE POLICY "Devs can delete own project units" ON public.project_units FOR DELETE USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND developer_id = auth.uid()));

-- 6. Developer lead visibility
CREATE POLICY "Devs can view leads for own projects" ON public.contact_leads FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND developer_id = auth.uid()));

-- 7. Matching function
CREATE OR REPLACE FUNCTION public.get_matched_leads_for_developer(_developer_id uuid)
RETURNS TABLE (
  lead_id uuid,
  full_name text,
  email text,
  phone text,
  lead_type text,
  created_at timestamptz,
  match_count int
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cl.id AS lead_id,
    cl.full_name,
    cl.email,
    cl.phone,
    cl.lead_type,
    cl.created_at,
    (
      (CASE WHEN EXISTS (SELECT 1 FROM projects p WHERE p.developer_id = _developer_id AND p.location_city = ANY(up.preferred_cities)) THEN 1 ELSE 0 END)
      + (CASE WHEN EXISTS (SELECT 1 FROM projects p WHERE p.developer_id = _developer_id AND p.location_zone = ANY(up.preferred_zones)) THEN 1 ELSE 0 END)
      + (CASE WHEN EXISTS (SELECT 1 FROM projects p WHERE p.developer_id = _developer_id AND p.project_type::text = ANY(up.preferred_project_types)) THEN 1 ELSE 0 END)
      + (CASE WHEN EXISTS (SELECT 1 FROM project_units pu JOIN projects p ON p.id = pu.project_id WHERE p.developer_id = _developer_id AND pu.available = true AND pu.typology::text = ANY(up.preferred_typologies)) THEN 1 ELSE 0 END)
      + (CASE WHEN EXISTS (SELECT 1 FROM project_units pu JOIN projects p ON p.id = pu.project_id WHERE p.developer_id = _developer_id AND pu.available = true AND pu.price IS NOT NULL AND (up.price_min IS NULL OR pu.price >= up.price_min) AND (up.price_max IS NULL OR pu.price <= up.price_max)) THEN 1 ELSE 0 END)
    )::int AS match_count
  FROM contact_leads cl
  JOIN user_preferences up ON cl.email = (SELECT p2.display_name FROM profiles p2 WHERE p2.user_id = up.user_id LIMIT 1)
  WHERE (
      (CASE WHEN EXISTS (SELECT 1 FROM projects p WHERE p.developer_id = _developer_id AND p.location_city = ANY(up.preferred_cities)) THEN 1 ELSE 0 END)
      + (CASE WHEN EXISTS (SELECT 1 FROM projects p WHERE p.developer_id = _developer_id AND p.location_zone = ANY(up.preferred_zones)) THEN 1 ELSE 0 END)
      + (CASE WHEN EXISTS (SELECT 1 FROM projects p WHERE p.developer_id = _developer_id AND p.project_type::text = ANY(up.preferred_project_types)) THEN 1 ELSE 0 END)
      + (CASE WHEN EXISTS (SELECT 1 FROM project_units pu JOIN projects p ON p.id = pu.project_id WHERE p.developer_id = _developer_id AND pu.available = true AND pu.typology::text = ANY(up.preferred_typologies)) THEN 1 ELSE 0 END)
      + (CASE WHEN EXISTS (SELECT 1 FROM project_units pu JOIN projects p ON p.id = pu.project_id WHERE p.developer_id = _developer_id AND pu.available = true AND pu.price IS NOT NULL AND (up.price_min IS NULL OR pu.price >= up.price_min) AND (up.price_max IS NULL OR pu.price <= up.price_max)) THEN 1 ELSE 0 END)
    ) >= 3;
END;
$$;
