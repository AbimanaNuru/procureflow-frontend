import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AIRequest from "./pages/AIRequest";
import ApprovalConfigDetail from "./pages/ApprovalConfigDetail";
import ApprovalConfigs from "./pages/ApprovalConfigs";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NewRequest from "./pages/NewRequest";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import PurchaseOrderDetail from "./pages/PurchaseOrderDetail";
import PurchaseOrderList from "./pages/PurchaseOrderList";
import RequestDetail from "./pages/RequestDetail";
import RequestList from "./pages/RequestList";
import UserDetail from "./pages/UserDetail";
import UserPermissions from "./pages/UserPermissions";
import Users from "./pages/Users";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="procureflow-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/requests" element={<RequestList />} />
                <Route path="/requests/new" element={<NewRequest />} />
                <Route path="/requests/ai" element={<AIRequest />} />
                <Route path="/requests/:id" element={<RequestDetail />} />
                <Route path="/purchase-orders" element={<PurchaseOrderList />} />
                <Route path="/purchase-orders/:id" element={<PurchaseOrderDetail />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/users/:id/permissions" element={<UserPermissions />} />
                <Route path="/approval-configs" element={<ApprovalConfigs />} />
                <Route path="/approval-configs/:id" element={<ApprovalConfigDetail />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
