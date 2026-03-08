import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/hooks/useCurrency";
import Index from "./pages/Index";
import CheRogaPora from "./pages/CheRogaPora";
import ProyectosCheRogaPora from "./pages/ProyectosCheRogaPora";
import ProjectDetail from "./pages/ProjectDetail";
import ParaPromotores from "./pages/ParaPromotores";
import Inversion from "./pages/Inversion";
import Proyectos from "./pages/Proyectos";
import DeveloperProfile from "./pages/DeveloperProfile";
import Promotores from "./pages/Promotores";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import UserPreferences from "./pages/UserPreferences";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProjectsList from "./pages/admin/ProjectsList";
import ProjectForm from "./pages/admin/ProjectForm";
import ProjectImages from "./pages/admin/ProjectImages";
import LeadsList from "./pages/admin/LeadsList";
import SubscribersList from "./pages/admin/SubscribersList";
import DeveloperApprovals from "./pages/admin/DeveloperApprovals";
import DeveloperLayout from "./components/developer/DeveloperLayout";
import DeveloperDashboard from "./pages/developer/DeveloperDashboard";
import DeveloperProjectsList from "./pages/developer/DeveloperProjectsList";
import DeveloperProjectForm from "./pages/developer/DeveloperProjectForm";
import DeveloperLeadsList from "./pages/developer/DeveloperLeadsList";
import Marketplace from "./pages/developer/Marketplace";
import DeveloperSettings from "./pages/developer/DeveloperSettings";
import { useTheme } from "./hooks/useTheme";

const queryClient = new QueryClient();

const App = () => {
  useTheme();
  return (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/che-roga-pora" element={<CheRogaPora />} />
          <Route path="/proyectos-che-roga-pora" element={<ProyectosCheRogaPora />} />
          <Route path="/proyecto/:slug" element={<ProjectDetail />} />
          <Route path="/para-promotores" element={<ParaPromotores />} />
          <Route path="/promotores" element={<Promotores />} />
          <Route path="/promotor/:slug" element={<DeveloperProfile />} />
          <Route path="/inversion" element={<Inversion />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/mis-preferencias" element={<UserPreferences />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id" element={<ProjectForm />} />
            <Route path="projects/:id/images" element={<ProjectImages />} />
            <Route path="leads" element={<LeadsList />} />
            <Route path="subscribers" element={<SubscribersList />} />
            <Route path="developers" element={<DeveloperApprovals />} />
          </Route>

          {/* Developer routes */}
          <Route path="/developer" element={<DeveloperLayout />}>
            <Route index element={<DeveloperDashboard />} />
            <Route path="projects" element={<DeveloperProjectsList />} />
            <Route path="projects/new" element={<DeveloperProjectForm />} />
            <Route path="projects/:id" element={<DeveloperProjectForm />} />
            <Route path="leads" element={<DeveloperLeadsList />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="settings" element={<DeveloperSettings />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
  );
};

export default App;
