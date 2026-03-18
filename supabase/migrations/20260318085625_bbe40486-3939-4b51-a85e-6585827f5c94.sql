CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are publicly readable" ON public.site_settings FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.site_settings (key, value) VALUES ('hero_project_slug', '');