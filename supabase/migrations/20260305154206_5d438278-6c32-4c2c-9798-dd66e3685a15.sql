
-- Add 'developer' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'developer';

-- Table for marketplace service catalog
CREATE TABLE public.marketplace_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  description text,
  price_label text,
  icon_name text,
  sort_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.marketplace_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Marketplace services are publicly readable"
  ON public.marketplace_services FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage marketplace services"
  ON public.marketplace_services FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Table for service requests from developers
CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.marketplace_services(id) ON DELETE SET NULL,
  service_title text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Developers can view own requests"
  ON public.service_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Developers can insert requests"
  ON public.service_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests"
  ON public.service_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update requests"
  ON public.service_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Developer approval status on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS developer_status text DEFAULT NULL;
