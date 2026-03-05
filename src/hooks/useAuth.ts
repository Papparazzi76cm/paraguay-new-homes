import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, loading, signOut };
};

const useRoleCheck = (userId: string | undefined, role: "admin" | "moderator" | "user" | "developer") => {
  const [hasRole, setHasRole] = useState(false);
  const [checkedUserId, setCheckedUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!userId) {
      setHasRole(false);
      setCheckedUserId(userId);
      return;
    }
    let cancelled = false;
    setCheckedUserId(undefined);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", role)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) {
          setHasRole(!!data);
          setCheckedUserId(userId);
        }
      });
    return () => { cancelled = true; };
  }, [userId, role]);

  const loading = checkedUserId !== userId;
  return { hasRole, loading };
};

export const useIsAdmin = (userId: string | undefined) => {
  const { hasRole, loading } = useRoleCheck(userId, "admin");
  return { isAdmin: hasRole, loading };
};

export const useIsDeveloper = (userId: string | undefined) => {
  const { hasRole, loading } = useRoleCheck(userId, "developer");
  return { isDeveloper: hasRole, loading };
};
