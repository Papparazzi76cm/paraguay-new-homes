import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, useIsDeveloper } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DeveloperSidebar } from "./DeveloperSidebar";
import { Loader2 } from "lucide-react";

const DeveloperLayout = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isDeveloper, loading: roleLoading } = useIsDeveloper(user?.id);
  const navigate = useNavigate();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  console.log("[DeveloperLayout] state:", { 
    authLoading, roleLoading, userId: user?.id, isDeveloper, 
    path: location.pathname, redirecting 
  });

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) {
      console.log("[DeveloperLayout] No user, redirecting to auth");
      setRedirecting(true);
      navigate("/auth?role=developer", { replace: true });
    } else if (!isDeveloper) {
      console.log("[DeveloperLayout] User not developer, redirecting to home");
      setRedirecting(true);
      navigate("/", { replace: true });
    }
  }, [authLoading, roleLoading, user, isDeveloper, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Verificando acceso...</span>
      </div>
    );
  }

  if (!user || !isDeveloper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Redirigiendo...</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DeveloperSidebar user={user} onSignOut={signOut} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-display text-lg font-semibold text-foreground">Panel de Desarrollador</h1>
          </header>
          <main className="flex-1 p-4 md:p-6 bg-background overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DeveloperLayout;
