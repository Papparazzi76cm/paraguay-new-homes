import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, KeyRound, Building2, User, Upload, X, Plug } from "lucide-react";
import ApiKeyManager from "@/components/developer/ApiKeyManager";

const DeveloperSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile data
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");

  // Logo
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setLogoUrl(profile.avatar_url ?? null);
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato no soportado. Usá PNG, JPG, WebP o SVG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("El archivo no debe superar 2 MB.");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/logo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("developer-logos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Error al subir el logo: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("developer-logos")
      .getPublicUrl(filePath);

    const newUrl = publicData.publicUrl + "?t=" + Date.now();

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: newUrl })
      .eq("user_id", user.id);

    if (profileError) {
      toast.error(profileError.message);
    } else {
      setLogoUrl(newUrl);
      queryClient.invalidateQueries({ queryKey: ["dev-profile"] });
      toast.success("Logo actualizado");
    }
    setUploading(false);
  };

  const handleLogoRemove = async () => {
    if (!user) return;
    setUploading(true);

    // List and delete files in user folder
    const { data: files } = await supabase.storage
      .from("developer-logos")
      .list(user.id);

    if (files?.length) {
      await supabase.storage
        .from("developer-logos")
        .remove(files.map((f) => `${user.id}/${f.name}`));
    }

    await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("user_id", user.id);

    setLogoUrl(null);
    queryClient.invalidateQueries({ queryKey: ["dev-profile"] });
    toast.success("Logo eliminado");
    setUploading(false);
  };

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
          {/* Logo upload */}
          <div className="space-y-2">
            <Label>Logo de la empresa</Label>
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <div className="relative group">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-20 w-20 rounded-lg object-contain border border-border bg-background p-1"
                  />
                  <button
                    type="button"
                    onClick={handleLogoRemove}
                    disabled={uploading}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/50">
                  <Building2 className="w-8 h-8 text-muted-foreground/40" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Subiendo..." : "Subir logo"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP o SVG. Máx 2 MB.</p>
              </div>
            </div>
          </div>
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
      {/* CRM Integration Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Plug className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Integración CRM (API)</h3>
        </div>
        <div className="bg-muted/30 rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-4">
            Conectá tu CRM para sincronizar proyectos, unidades y disponibilidad en tiempo real.
          </p>
          <ApiKeyManager />
        </div>
      </section>
    </div>
  );
};

export default DeveloperSettings;
