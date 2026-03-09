
-- Table to store API keys per developer
CREATE TABLE public.developer_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid NOT NULL,
  api_key text NOT NULL UNIQUE,
  key_name text NOT NULL DEFAULT 'default',
  active boolean NOT NULL DEFAULT true,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  revoked_at timestamp with time zone
);

-- Index for fast API key lookups
CREATE INDEX idx_developer_api_keys_api_key ON public.developer_api_keys (api_key) WHERE active = true;
CREATE INDEX idx_developer_api_keys_developer ON public.developer_api_keys (developer_id);

-- Enable RLS
ALTER TABLE public.developer_api_keys ENABLE ROW LEVEL SECURITY;

-- Developers can view their own keys
CREATE POLICY "Developers can view own API keys"
ON public.developer_api_keys FOR SELECT
TO authenticated
USING (auth.uid() = developer_id);

-- Developers can insert their own keys
CREATE POLICY "Developers can insert own API keys"
ON public.developer_api_keys FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = developer_id);

-- Developers can update (revoke) their own keys
CREATE POLICY "Developers can update own API keys"
ON public.developer_api_keys FOR UPDATE
TO authenticated
USING (auth.uid() = developer_id);

-- Admins can view all keys
CREATE POLICY "Admins can view all API keys"
ON public.developer_api_keys FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Function to validate API key and return developer_id (used by edge functions)
CREATE OR REPLACE FUNCTION public.validate_api_key(_api_key text)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT developer_id
  FROM public.developer_api_keys
  WHERE api_key = _api_key
    AND active = true
    AND revoked_at IS NULL
$$;

-- CRM sync log table for audit trail
CREATE TABLE public.crm_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid NOT NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code int NOT NULL,
  request_body jsonb,
  response_summary text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Developers can view own sync logs"
ON public.crm_sync_logs FOR SELECT
TO authenticated
USING (auth.uid() = developer_id);

CREATE POLICY "Admins can view all sync logs"
ON public.crm_sync_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Service role can insert logs (from edge functions)
CREATE POLICY "Service can insert sync logs"
ON public.crm_sync_logs FOR INSERT
TO authenticated
WITH CHECK (true);
