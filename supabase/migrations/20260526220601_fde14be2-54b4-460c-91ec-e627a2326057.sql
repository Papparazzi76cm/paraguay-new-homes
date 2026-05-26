
-- 1. Fix user_preferences: remove broad developer SELECT
DROP POLICY IF EXISTS "Developers can view preferences" ON public.user_preferences;

-- 2. Add user_roles write protection (admin-only)
CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Tighten contact_leads dev policy to authenticated only
DROP POLICY IF EXISTS "Devs can view leads for own projects" ON public.contact_leads;
CREATE POLICY "Devs can view leads for own projects" ON public.contact_leads
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = contact_leads.project_id AND projects.developer_id = auth.uid()));

-- 4. developer_profiles: require developer role for INSERT; allow self DELETE; admin DELETE already covered
DROP POLICY IF EXISTS "Devs insert own developer profile" ON public.developer_profiles;
CREATE POLICY "Devs insert own developer profile" ON public.developer_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND has_role(auth.uid(), 'developer'::app_role));
CREATE POLICY "Devs delete own developer profile" ON public.developer_profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 5. Revoke EXECUTE on SECURITY DEFINER trigger/internal functions from anon/authenticated
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.dispatch_lead_webhook() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_api_key(text) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.ensure_user_setup() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_matched_leads_for_developer(uuid) FROM anon;
