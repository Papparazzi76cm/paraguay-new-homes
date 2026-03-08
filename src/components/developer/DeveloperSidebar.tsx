import { Building2, Mail, LogOut, LayoutDashboard, ShoppingBag, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/developer", icon: LayoutDashboard },
  { title: "Proyectos", url: "/developer/projects", icon: Building2 },
  { title: "Leads", url: "/developer/leads", icon: Mail },
  { title: "Marketplace", url: "/developer/marketplace", icon: ShoppingBag },
  { title: "Ajustes", url: "/developer/settings", icon: Settings },
];

interface DeveloperSidebarProps {
  user: User;
  onSignOut: () => void;
}

export function DeveloperSidebar({ user, onSignOut }: DeveloperSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Desarrollador</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/developer"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        {!collapsed && (
          <p className="text-xs text-muted-foreground truncate mb-2">{user.email}</p>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Cerrar sesión"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
