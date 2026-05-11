
CREATE TABLE public.developer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  legal_name text NOT NULL,
  tax_id text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'Paraguay',
  phone text NOT NULL,
  website text,
  description text,
  logo_url text,
  contact_name text NOT NULL,
  contact_role text NOT NULL,
  contact_email text NOT NULL,
  selected_plan text NOT NULL DEFAULT 'basico',
  onboarding_status text NOT NULL DEFAULT 'pending_payment',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.developer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Devs view own developer profile" ON public.developer_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Devs insert own developer profile" ON public.developer_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Devs update own developer profile" ON public.developer_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins manage developer profiles" ON public.developer_profiles
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_developer_profiles_updated_at
BEFORE UPDATE ON public.developer_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
