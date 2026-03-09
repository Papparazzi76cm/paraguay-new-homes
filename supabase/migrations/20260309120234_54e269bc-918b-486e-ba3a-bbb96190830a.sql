
-- Fix overly permissive INSERT on crm_sync_logs - only allow service role inserts via RPC
DROP POLICY "Service can insert sync logs" ON public.crm_sync_logs;

-- No authenticated INSERT needed - edge functions use service role key directly
