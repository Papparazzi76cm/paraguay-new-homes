
-- Add unique constraint on profiles.user_id for ON CONFLICT
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Create ensure_user_setup() function
CREATE OR REPLACE FUNCTION public.ensure_user_setup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _meta jsonb;
  _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN RETURN; END IF;
  
  SELECT raw_user_meta_data INTO _meta
  FROM auth.users WHERE id = _uid;
  
  -- Ensure profile exists
  INSERT INTO public.profiles (user_id, display_name, developer_status)
  VALUES (
    _uid,
    COALESCE(_meta->>'display_name', _meta->>'email'),
    CASE WHEN _meta->>'register_as' = 'developer' THEN 'approved' ELSE NULL END
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Ensure developer role exists
  IF _meta->>'register_as' = 'developer' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_uid, 'developer')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;
