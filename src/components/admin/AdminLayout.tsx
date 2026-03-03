import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Loader2 } from "lucide-react";

const AdminLayout = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[AdminLayout] authLoading:", authLoading, "roleLoading:", roleLoading, "user:", user?.email, "isAdmin:", isAdmin);
    if (authLoading || roleLoading) return;
    if (!user) {
      console.log("[AdminLayout] No user, redirecting to /auth");
      navigate("/auth");
    } else if (!isAdmin) {
      console.log("[AdminLayout] Not admin, redirecting to /");
      navigate("/");
    } else {
      console.log("[AdminLayout] Admin confirmed, staying on /admin");
    }
  }, [authLoading, roleLoading, user, isAdmin, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar user={user} onSignOut={signOut} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-display text-lg font-semibold text-foreground">Panel de Administración</h1>
          </header>
          <main className="flex-1 p-4 md:p-6 bg-background overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
