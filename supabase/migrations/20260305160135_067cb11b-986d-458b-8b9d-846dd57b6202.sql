
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
    CASE WHEN NEW.raw_user_meta_data->>'register_as' = 'developer' THEN 'approved' ELSE NULL END
  );

  IF NEW.raw_user_meta_data->>'register_as' = 'developer' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'developer');
  END IF;

  RETURN NEW;
END;
$function$;
