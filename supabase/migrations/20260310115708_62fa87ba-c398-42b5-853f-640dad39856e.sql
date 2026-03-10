
-- Table for developer webhook URLs
CREATE TABLE public.developer_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid NOT NULL,
  url text NOT NULL,
  secret text,
  events text[] NOT NULL DEFAULT '{new_lead}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_triggered_at timestamptz,
  last_status_code integer,
  description text
);

-- RLS
ALTER TABLE public.developer_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Developers can view own webhooks"
  ON public.developer_webhooks FOR SELECT
  TO authenticated
  USING (auth.uid() = developer_id);

CREATE POLICY "Developers can insert own webhooks"
  ON public.developer_webhooks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can update own webhooks"
  ON public.developer_webhooks FOR UPDATE
  TO authenticated
  USING (auth.uid() = developer_id);

CREATE POLICY "Developers can delete own webhooks"
  ON public.developer_webhooks FOR DELETE
  TO authenticated
  USING (auth.uid() = developer_id);

CREATE POLICY "Admins can view all webhooks"
  ON public.developer_webhooks FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to dispatch webhooks via pg_net when a lead is created
CREATE OR REPLACE FUNCTION public.dispatch_lead_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _project record;
  _webhook record;
  _payload jsonb;
  _headers jsonb;
  _supabase_url text;
  _service_key text;
BEGIN
  -- Get project info to find the developer
  IF NEW.project_id IS NOT NULL THEN
    SELECT id, developer_id, title, slug INTO _project
    FROM public.projects
    WHERE id = NEW.project_id;
  END IF;

  -- If no project or no developer, skip
  IF _project IS NULL OR _project.developer_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Build payload
  _payload := jsonb_build_object(
    'event', 'new_lead',
    'timestamp', now(),
    'lead', jsonb_build_object(
      'id', NEW.id,
      'full_name', NEW.full_name,
      'email', NEW.email,
      'phone', NEW.phone,
      'message', NEW.message,
      'lead_type', NEW.lead_type,
      'created_at', NEW.created_at
    ),
    'project', jsonb_build_object(
      'id', _project.id,
      'title', _project.title,
      'slug', _project.slug
    )
  );

  -- Call each active webhook for this developer
  FOR _webhook IN
    SELECT id, url, secret
    FROM public.developer_webhooks
    WHERE developer_id = _project.developer_id
      AND active = true
      AND 'new_lead' = ANY(events)
  LOOP
    _headers := jsonb_build_object(
      'Content-Type', 'application/json'
    );
    
    IF _webhook.secret IS NOT NULL THEN
      _headers := _headers || jsonb_build_object('X-Webhook-Secret', _webhook.secret);
    END IF;

    -- Use pg_net for async HTTP POST
    PERFORM net.http_post(
      url := _webhook.url,
      body := _payload,
      headers := _headers
    );

    -- Update last triggered
    UPDATE public.developer_webhooks
    SET last_triggered_at = now()
    WHERE id = _webhook.id;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Trigger on contact_leads
CREATE TRIGGER on_new_lead_dispatch_webhook
  AFTER INSERT ON public.contact_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.dispatch_lead_webhook();
