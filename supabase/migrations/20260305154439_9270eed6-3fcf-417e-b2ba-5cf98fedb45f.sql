
-- Update handle_new_user to support developer registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, developer_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    CASE WHEN NEW.raw_user_meta_data->>'register_as' = 'developer' THEN 'pending' ELSE NULL END
  );

  -- Auto-assign developer role if registering as developer
  IF NEW.raw_user_meta_data->>'register_as' = 'developer' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'developer');
  END IF;

  RETURN NEW;
END;
$function$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
