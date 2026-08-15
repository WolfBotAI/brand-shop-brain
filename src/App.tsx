import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StoreBuilder from "./pages/features/StoreBuilder";
import AISupport from "./pages/features/AISupport";
import AIVision from "./pages/features/AIVision";
import OrderRouting from "./pages/features/OrderRouting";
import FeatureReporting from "./pages/features/Reporting";
import Acquisition from "./pages/features/Acquisition";
import MultiStoreManagement from "./pages/features/MultiStoreManagement";
import AISuggestions from "./pages/features/AISuggestions";
import KPIReports from "./pages/features/KPIReports";
import SiteMigration from "./pages/features/SiteMigration";
import PopUpStores from "./pages/features/PopUpStores";
import ForDistributors from "./pages/personas/ForDistributors";
import ForDecorators from "./pages/personas/ForDecorators";
import ForReferralPartners from "./pages/personas/ForReferralPartners";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Onboarding from "./pages/app/Onboarding";
import StoreWorkspace from "./pages/app/StoreWorkspace";
import AIVisionJobs from "./pages/app/AIVisionJobs";
import OrderRoutingManager from "./pages/app/OrderRoutingManager";
import StoreList from "./pages/app/StoreList";
import Suppliers from "./pages/app/Suppliers";
import Settings from "./pages/app/Settings";
import PublicStorefront from "./pages/app/PublicStorefront";
import Reporting from "./pages/app/Reporting";
import SiteMigrationWizard from "./pages/app/SiteMigrationWizard";
import CustomerOrders from "./pages/app/CustomerOrders";
import OAuthConsent from "./pages/OAuthConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
            <Route path="/features/store-builder" element={<StoreBuilder />} />
            <Route path="/features/ai-support" element={<AISupport />} />
            <Route path="/features/ai-vision" element={<AIVision />} />
            <Route path="/features/order-routing" element={<OrderRouting />} />
            <Route path="/features/reporting" element={<FeatureReporting />} />
            <Route path="/features/acquisition" element={<Acquisition />} />
            <Route path="/features/multi-store" element={<MultiStoreManagement />} />
            <Route path="/features/ai-suggestions" element={<AISuggestions />} />
            <Route path="/features/kpi-reports" element={<KPIReports />} />
            <Route path="/features/site-migration" element={<SiteMigration />} />
            <Route path="/features/popup-stores" element={<PopUpStores />} />

            {/* Persona pages */}
            <Route path="/for/distributors" element={<ForDistributors />} />
            <Route path="/for/decorators" element={<ForDecorators />} />
            <Route path="/for/referral-partners" element={<ForReferralPartners />} />

            {/* Public storefront */}
            <Route path="/store/:slug" element={<PublicStorefront />} />
            <Route path="/store/:slug/orders" element={<CustomerOrders />} />

            {/* Protected platform app routes */}
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="stores" element={<StoreList />} />
              <Route path="stores/:storeId" element={<StoreWorkspace />} />
              <Route path="ai-vision" element={<AIVisionJobs />} />
              <Route path="routing" element={<OrderRoutingManager />} />
              <Route path="reporting" element={<Reporting />} />
              <Route path="migrate" element={<SiteMigrationWizard />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
