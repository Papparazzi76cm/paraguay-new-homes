import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MailCheck } from "lucide-react";

type RegisterMode = "user" | "developer";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const forceDeveloper = searchParams.get("role") === "developer";
  const [isLogin, setIsLogin] = useState(!forceDeveloper);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [registerMode, setRegisterMode] = useState<RegisterMode>(forceDeveloper ? "developer" : "user");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Detect existing session (e.g. after email confirmation redirect)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.rpc("ensure_user_setup");
        const userId = session.user.id;
        const { data: adminRole } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
        if (adminRole) { navigate("/admin", { replace: true }); return; }
        const { data: devRole } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "developer").maybeSingle();
        if (devRole) { navigate("/developer", { replace: true }); return; }
        navigate("/", { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        const userId = data.user?.id;
        if (userId) {
          const { data: adminRole } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
          if (adminRole) {
            toast.success(t("auth.sessionStarted"));
            navigate("/admin");
          } else {
            const { data: devRole } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "developer").maybeSingle();
            if (devRole) {
              toast.success(t("auth.sessionStarted"));
              navigate("/developer");
            } else {
              toast.success(t("auth.sessionStarted"));
              navigate("/");
            }
          }
        }
      }
    } else {
      const metadata: Record<string, string> = { display_name: displayName };
      if (registerMode === "developer") {
        metadata.register_as = "developer";
        metadata.company_name = companyName;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin + "/auth",
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        setShowConfirmDialog(true);
      }
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) toast.error(error.message);
    else toast.success(t("auth.resetEmailSent"));
    setLoading(false);
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Helmet><title>{t("auth.resetPassword")} — ProyectPY</title></Helmet>
        <form onSubmit={handleForgot} className="w-full max-w-sm space-y-4 bg-card p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-foreground">{t("auth.resetPassword")}</h1>
          <div className="space-y-2"><Label>{t("auth.email")}</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? t("auth.sending") : t("auth.sendLink")}</Button>
          <Button variant="ghost" className="w-full" onClick={() => setShowForgot(false)}>{t("auth.backToLogin")}</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Helmet><title>{isLogin ? t("auth.login") : t("auth.signup")} — ProyectPY</title></Helmet>
      <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4 bg-card p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-foreground">{isLogin ? t("auth.login") : t("auth.signup")}</h1>

        {!isLogin && !forceDeveloper && (
          <div className="flex gap-2">
            <Button type="button" variant={registerMode === "user" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setRegisterMode("user")}>
              Usuario
            </Button>
            <Button type="button" variant={registerMode === "developer" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setRegisterMode("developer")}>
              Desarrollador
            </Button>
          </div>
        )}

        {!isLogin && (
          <div className="space-y-2">
            <Label>{t("auth.name")}</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
        )}

        {!isLogin && registerMode === "developer" && (
          <div className="space-y-2">
            <Label>Empresa / Desarrolladora</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder="Nombre de tu empresa" />
          </div>
        )}

        <div className="space-y-2"><Label>{t("auth.email")}</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="space-y-2"><Label>{t("auth.password")}</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? t("auth.loading") : isLogin ? t("auth.enter") : t("auth.register")}</Button>

        {isLogin && (
          <>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">o</span></div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const { error } = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (error) toast.error(error.message);
                setLoading(false);
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const { error } = await lovable.auth.signInWithOAuth("apple", {
                  redirect_uri: window.location.origin,
                });
                if (error) toast.error(error.message);
                setLoading(false);
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Sign in with Apple
            </Button>
          </>
        )}

        {isLogin && (<Button variant="link" className="w-full" onClick={() => setShowForgot(true)} type="button">{t("auth.forgotPassword")}</Button>)}
        <p className="text-sm text-center text-muted-foreground">
          {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
          <button type="button" className="text-primary underline" onClick={() => setIsLogin(!isLogin)}>{isLogin ? t("auth.signupLink") : t("auth.loginLink")}</button>
        </p>
      </form>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-xl">¡Revisa tu correo!</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Te hemos enviado un enlace de confirmación a <span className="font-semibold text-foreground">{email}</span>. Haz clic en el enlace para activar tu cuenta y acceder a tu panel.
            </DialogDescription>
          </DialogHeader>
          <Button className="w-full mt-2" onClick={() => { setShowConfirmDialog(false); setIsLogin(true); }}>
            Entendido, ir al login
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
