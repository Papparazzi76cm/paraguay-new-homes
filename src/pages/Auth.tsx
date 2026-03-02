import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Sesión iniciada");
        navigate("/admin");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Revisá tu email para confirmar tu cuenta");
      }
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Te enviamos un link para restablecer tu contraseña");
    setLoading(false);
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Helmet><title>Restablecer contraseña — ProyectPY</title></Helmet>
        <form onSubmit={handleForgot} className="w-full max-w-sm space-y-4 bg-card p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-foreground">Restablecer contraseña</h1>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setShowForgot(false)}>
            Volver al login
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Helmet><title>{isLogin ? "Iniciar sesión" : "Registrarse"} — ProyectPY</title></Helmet>
      <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4 bg-card p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-foreground">{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h1>

        {!isLogin && (
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
        )}

        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Contraseña</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Cargando..." : isLogin ? "Entrar" : "Registrarse"}
        </Button>

        {isLogin && (
          <Button variant="link" className="w-full" onClick={() => setShowForgot(true)} type="button">
            ¿Olvidaste tu contraseña?
          </Button>
        )}

        <p className="text-sm text-center text-muted-foreground">
          {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button type="button" className="text-primary underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Registrate" : "Iniciá sesión"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Auth;
