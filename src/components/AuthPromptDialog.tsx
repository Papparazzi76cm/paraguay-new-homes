import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, MailCheck } from "lucide-react";

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthPromptDialog = ({ open, onOpenChange }: AuthPromptDialogProps) => {
  const [mode, setMode] = useState<"prompt" | "register" | "login" | "confirm">("prompt");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const reset = () => {
    setMode("prompt");
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setMode("confirm");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("¡Sesión iniciada!");
      handleClose(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {mode === "prompt" && (
          <>
            <DialogHeader className="items-center text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <Heart className="h-7 w-7 text-destructive" />
              </div>
              <DialogTitle className="text-xl">Guardá tus favoritos</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Creá una cuenta gratuita para guardar proyectos favoritos, definir tus preferencias de inversión y recibir alertas de nuevas publicaciones.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button onClick={() => setMode("register")} className="w-full">
                Crear cuenta gratis
              </Button>
              <Button variant="outline" onClick={() => setMode("login")} className="w-full">
                Ya tengo cuenta
              </Button>
            </div>
          </>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Crear cuenta</DialogTitle>
              <DialogDescription>Registrate como inversor para acceder a todas las funciones.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required placeholder="Tu nombre" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrarme"}
            </Button>
            <button type="button" className="text-sm text-muted-foreground underline w-full text-center" onClick={() => setMode("login")}>
              Ya tengo cuenta
            </button>
          </form>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Iniciar sesión</DialogTitle>
              <DialogDescription>Accedé a tu cuenta para ver tus favoritos.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <button type="button" className="text-sm text-muted-foreground underline w-full text-center" onClick={() => setMode("register")}>
              Crear cuenta nueva
            </button>
          </form>
        )}

        {mode === "confirm" && (
          <>
            <DialogHeader className="items-center text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <MailCheck className="h-7 w-7 text-primary" />
              </div>
              <DialogTitle className="text-xl">¡Revisá tu correo!</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Te enviamos un enlace de confirmación a <span className="font-semibold text-foreground">{email}</span>. Confirmá tu cuenta para empezar a guardar favoritos y recibir alertas.
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full mt-2" onClick={() => handleClose(false)}>
              Entendido
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthPromptDialog;
