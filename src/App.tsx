import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/hooks/useCurrency";
import { useTheme } from "./hooks/useTheme";

// Eagerly load the landing page for fastest first paint
import Index from "./pages/Index";

// Lazy-load other pages
const CheRogaPora = lazy(() => import("./pages/CheRogaPora"));
const ProyectosCheRogaPora = lazy(() => import("./pages/ProyectosCheRogaPora"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ParaPromotores = lazy(() => import("./pages/ParaPromotores"));
const CheckoutReturn = lazy(() => import("./pages/CheckoutReturn"));
const Inversion = lazy(() => import("./pages/Inversion"));
const Proyectos = lazy(() => import("./pages/Proyectos"));
const DeveloperProfile = lazy(() => import("./pages/DeveloperProfile"));
const Promotores = lazy(() => import("./pages/Promotores"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ChatBot = lazy(() => import("./components/ChatBot"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const UserPreferences = lazy(() => import("./pages/UserPreferences"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProjectsList = lazy(() => import("./pages/admin/ProjectsList"));
const ProjectForm = lazy(() => import("./pages/admin/ProjectForm"));
const ProjectImages = lazy(() => import("./pages/admin/ProjectImages"));
const LeadsList = lazy(() => import("./pages/admin/LeadsList"));
const SubscribersList = lazy(() => import("./pages/admin/SubscribersList"));
const DeveloperApprovals = lazy(() => import("./pages/admin/DeveloperApprovals"));
const DeveloperLayout = lazy(() => import("./components/developer/DeveloperLayout"));
const DeveloperDashboard = lazy(() => import("./pages/developer/DeveloperDashboard"));
const DeveloperProjectsList = lazy(() => import("./pages/developer/DeveloperProjectsList"));
const DeveloperProjectForm = lazy(() => import("./pages/developer/DeveloperProjectForm"));
const DeveloperLeadsList = lazy(() => import("./pages/developer/DeveloperLeadsList"));
const Marketplace = lazy(() => import("./pages/developer/Marketplace"));
const DeveloperSettings = lazy(() => import("./pages/developer/DeveloperSettings"));
const DeveloperOnboarding = lazy(() => import("./pages/developer/Onboarding"));

const queryClient = new QueryClient();

// Minimal fallback — just a transparent container so the transition feels instant
const MinimalFallback = () => (
  <div className="min-h-screen bg-background" />
);

const App = () => {
  useTheme();
  return (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<MinimalFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/che-roga-pora" element={<CheRogaPora />} />
            <Route path="/proyectos-che-roga-pora" element={<ProyectosCheRogaPora />} />
            <Route path="/proyecto/:slug" element={<ProjectDetail />} />
            <Route path="/para-promotores" element={<ParaPromotores />} />
            <Route path="/checkout/return" element={<CheckoutReturn />} />
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
            <Route path="/developer/onboarding" element={<DeveloperOnboarding />} />
            <Route path="/developer/onboarding/done" element={<DeveloperOnboarding />} />
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
        </Suspense>
        <Suspense fallback={null}>
          <ChatBot />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
  );
};

export default App;
