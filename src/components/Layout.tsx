import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@/hooks/use-auth";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const Layout = () => {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Derive display name and role from user profile
  const userName = user ? `${user.first_name} ${user.last_name}` : "User";
  // Assuming the first group is the primary role for display, or default to 'Staff'
  const userRole = user?.groups?.[0]?.name || "Staff";

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={userName} 
        role={userRole} 
        onLogout={handleLogout} 
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
