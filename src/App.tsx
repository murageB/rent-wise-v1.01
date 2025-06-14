
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import CaretakerDashboard from "./pages/caretaker/CaretakerDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return "/auth";
    
    switch (user.role) {
      case "landlord":
        return "/landlord";
      case "caretaker":
        return "/caretaker";
      case "tenant":
        return "/tenant";
      default:
        return "/auth";
    }
  };

  return (
    <Routes>
      <Route path="/auth" element={
        user ? <Navigate to={getDashboardRoute()} replace /> : <AuthPage />
      } />
      
      <Route path="/landlord" element={
        <ProtectedRoute allowedRoles={["landlord"]}>
          <Index />
        </ProtectedRoute>
      } />
      
      <Route path="/caretaker" element={
        <ProtectedRoute allowedRoles={["caretaker"]}>
          <CaretakerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/tenant" element={
        <ProtectedRoute allowedRoles={["tenant"]}>
          <TenantDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      <Route path="/" element={
        <Navigate to={getDashboardRoute()} replace />
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
