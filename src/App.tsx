import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StoreBuilder from "./pages/features/StoreBuilder";
import AISupport from "./pages/features/AISupport";
import AIVision from "./pages/features/AIVision";
import OrderRouting from "./pages/features/OrderRouting";
import Reporting from "./pages/features/Reporting";
import Acquisition from "./pages/features/Acquisition";
import MultiStoreManagement from "./pages/features/MultiStoreManagement";
import AISuggestions from "./pages/features/AISuggestions";
import KPIReports from "./pages/features/KPIReports";
import SiteMigration from "./pages/features/SiteMigration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features/store-builder" element={<StoreBuilder />} />
          <Route path="/features/ai-support" element={<AISupport />} />
          <Route path="/features/ai-vision" element={<AIVision />} />
          <Route path="/features/order-routing" element={<OrderRouting />} />
          <Route path="/features/reporting" element={<Reporting />} />
          <Route path="/features/acquisition" element={<Acquisition />} />
          <Route path="/features/multi-store" element={<MultiStoreManagement />} />
          <Route path="/features/ai-suggestions" element={<AISuggestions />} />
          <Route path="/features/kpi-reports" element={<KPIReports />} />
          <Route path="/features/site-migration" element={<SiteMigration />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
