import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) { toast.error(t("auth.invalidLink")); navigate("/auth"); }
  }, [navigate, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) toast.error(error.message);
    else { toast.success(t("auth.passwordUpdated")); navigate("/admin"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-card p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-foreground">{t("auth.resetTitle")}</h1>
        <div className="space-y-2"><Label>{t("auth.newPassword")}</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? t("auth.saving") : t("auth.updatePassword")}</Button>
      </form>
    </div>
  );
};

export default ResetPassword;
