

## Diagnosis

The root cause is a **race condition between environments**. The `handle_new_user` trigger is attached to `auth.users` (a reserved schema). When the app is published to Live, this trigger may not fire correctly or may not exist in the Live environment. Result: new developers who register on the published site never get a row in `user_roles` or `profiles`, so `DeveloperLayout` sees `isDeveloper = false` and redirects them to `/` (which appears as a blank page flash).

Evidence: All existing developer users were bulk-created in the Test environment. No new users have registered since deployment. The trigger on `auth.users` is inherently fragile across environments.

## Solution: Client-side Fallback with a SECURITY DEFINER Function

Create a robust fallback that guarantees profile and role setup regardless of whether the trigger fired.

### 1. Database migration: `ensure_user_setup()` function

Create a `SECURITY DEFINER` function that:
- Reads the calling user's `raw_user_meta_data` from `auth.users`
- Creates a `profiles` row if missing
- Creates a `user_roles` row with `developer` role if `register_as = 'developer'` and the role doesn't exist yet
- Is idempotent (safe to call multiple times)

```sql
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
```

Note: This requires a unique constraint on `profiles(user_id)` -- need to verify and add if missing.

### 2. Call `ensure_user_setup()` after login

In `Auth.tsx`, after successful `signInWithPassword` or session detection, call:
```ts
await supabase.rpc("ensure_user_setup");
```

This ensures that even if the trigger didn't fire (Live environment issue), the profile and role are created before any redirect logic runs.

### 3. Call it from `DeveloperLayout` as well

Before checking the developer role, call `ensure_user_setup()` as a safety net. Modify the `useIsDeveloper` hook or the layout itself to call the RPC once, then check the role.

### 4. Add unique constraint on `profiles.user_id`

Needed for the `ON CONFLICT` clause to work:
```sql
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
```

### Summary of changes

| File/Resource | Change |
|---|---|
| **DB migration** | Create `ensure_user_setup()` function + unique constraint on `profiles.user_id` |
| `src/pages/Auth.tsx` | Call `supabase.rpc("ensure_user_setup")` after login and session detection |
| `src/components/developer/DeveloperLayout.tsx` | Call `ensure_user_setup()` before role check as fallback |

This approach is environment-safe because it runs as client-side RPC with `SECURITY DEFINER`, bypassing any trigger dependency.

