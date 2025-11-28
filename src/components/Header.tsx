import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/config/permission-config";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/use-permission";
import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  userName?: string;
  role?: string;
  onLogout?: () => void;
}

export const Header = ({ userName = "User", role = "Staff", onLogout }: HeaderProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const canViewRequests = usePermission(PERMISSIONS.VIEW_PURCHASE_REQUEST);
  const canViewPOs = usePermission(PERMISSIONS.VIEW_PURCHASE_ORDER);
  const isAdmin = user?.groups.some(g => g.name === 'Admin');
  // Assuming only Admin can view users, or we need a specific permission. 
  // For now, I'll leave Users link as is or check if I should hide it. 
  // The user only provided procurement permissions. 
  // I'll check if the user has ANY procurement permission to show Requests? 
  // No, specific permissions are better.

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-lg">ProcureFlow</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </Link>
              {canViewRequests && (
                <Link
                  to="/requests"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith("/requests")
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Requests
                </Link>
              )}
              {canViewPOs && (
                <Link
                  to="/purchase-orders"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith("/purchase-orders")
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Purchase Orders
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/users"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/users"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Users
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/approval-configs"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/approval-configs"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Approval Configs
                </Link>
              )}
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/profile"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Profile
              </Link>

              
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
        
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-muted-foreground">{role}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
