import { useAuth } from "@/contexts/AuthContext";

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 * @param permissions - Array of permission strings to check
 * @param requireAll - If true, user must have ALL permissions. If false, user needs ANY permission
 * @param fallback - Optional component to render when user doesn't have permission
 */
export const PermissionGuard = ({
  children,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) => {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  // Get user's primary group/role from groups array
  const userGroup = user.groups && user.groups.length > 0 ? user.groups[0].name : "";

  // Define permission mappings
  const permissionMap: Record<string, string[]> = {
    Staff: [
      "procurement.add_purchaserequest",
      "procurement.view_purchaserequest",
      "procurement.change_purchaserequest",
      "procurement.add_requestitem",
      "procurement.view_requestitem",
      "procurement.change_requestitem",
    ],
    Manager: [
      "procurement.add_purchaserequest",
      "procurement.view_purchaserequest",
      "procurement.change_purchaserequest",
      "procurement.approve_purchaserequest",
      "procurement.reject_purchaserequest",
      "procurement.add_requestitem",
      "procurement.view_requestitem",
      "procurement.change_requestitem",
    ],
    Finance: [
      "procurement.view_purchaserequest",
      "procurement.approve_purchaserequest",
      "procurement.reject_purchaserequest",
      "procurement.view_purchaseorder",
      "procurement.add_purchaseorder",
      "procurement.change_purchaseorder",
    ],
    Admin: [
      // Admin has all permissions
      "procurement.add_purchaserequest",
      "procurement.view_purchaserequest",
      "procurement.change_purchaserequest",
      "procurement.approve_purchaserequest",
      "procurement.reject_purchaserequest",
      "procurement.add_requestitem",
      "procurement.view_requestitem",
      "procurement.change_requestitem",
      "procurement.view_purchaseorder",
      "procurement.add_purchaseorder",
      "procurement.change_purchaseorder",
    ],
  };

  const userPermissions = permissionMap[userGroup] || [];

  // Check permissions
  const hasPermission = requireAll
    ? permissions.every((perm) => userPermissions.includes(perm))
    : permissions.some((perm) => userPermissions.includes(perm));

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
