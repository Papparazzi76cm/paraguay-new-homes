import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, KeyRound, Building2, User } from "lucide-react";

const DeveloperSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile data
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");

  // Company data from developer info (stored in user metadata + profile)
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["dev-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
    }
    if (user) {
      setPhone(user.user_metadata?.phone ?? "");
      setCompanyName(user.user_metadata?.company_name ?? user.user_metadata?.display_name ?? "");
      setCompanyWebsite(user.user_metadata?.company_website ?? "");
      setCompanyDescription(user.user_metadata?.company_description ?? "");
      setCompanyPhone(user.user_metadata?.company_phone ?? "");
      setCompanyEmail(user.email ?? "");
    }
  }, [profile, user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else {
      toast.success("Contraseña actualizada");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update profile display name
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("user_id", user!.id);
    if (profileError) {
      toast.error(profileError.message);
      return;
    }

    // Update user metadata with company info
    const { error: metaError } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        phone,
        company_name: companyName,
        company_website: companyWebsite,
        company_description: companyDescription,
        company_phone: companyPhone,
      },
    });
    if (metaError) {
      toast.error(metaError.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["dev-profile"] });
    toast.success("Datos actualizados correctamente");
  };

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Ajustes</h2>
        <p className="text-sm text-muted-foreground">Gestiona tu cuenta y los datos de tu empresa.</p>
      </div>

      {/* Account Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Cuenta</h3>
        </div>
        <div className="bg-muted/30 rounded-xl p-5 space-y-4">
          <div className="space-y-2">
            <Label>Email actual</Label>
            <Input value={user?.email ?? ""} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Para cambiar tu email, contacta a soporte.</p>
          </div>
          <div className="space-y-2">
            <Label>Nombre de contacto</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Tu nombre" />
          </div>
          <div className="space-y-2">
            <Label>Teléfono personal</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+595 9XX XXX XXX" />
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Datos de la empresa</h3>
        </div>
        <form onSubmit={handleProfileSave} className="bg-muted/30 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre de la empresa</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Mi Empresa S.A" />
            </div>
            <div className="space-y-2">
              <Label>Sitio web</Label>
              <Input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Email de la empresa</Label>
              <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="info@empresa.com" disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Teléfono de la empresa</Label>
              <Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="+595 21 XXX XXX" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descripción de la empresa</Label>
            <Textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} rows={4} placeholder="Breve descripción de tu empresa y servicios..." />
          </div>
          <Button type="submit" className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Guardar datos
          </Button>
        </form>
      </section>

      {/* Password Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Cambiar contraseña</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="bg-muted/30 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nueva contraseña</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label>Confirmar contraseña</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
            </div>
          </div>
          <Button type="submit" variant="outline" className="flex items-center gap-2">
            <KeyRound className="w-4 h-4" /> Cambiar contraseña
          </Button>
        </form>
      </section>
    </div>
  );
};

export default DeveloperSettings;
