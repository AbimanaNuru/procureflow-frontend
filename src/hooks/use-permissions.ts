import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to check user permissions
 */
export const usePermissions = () => {
    const { user } = useAuth();

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

    const userGroup = user?.groups && user.groups.length > 0 ? user.groups[0].name : "";
    const userPermissions = permissionMap[userGroup] || [];

    /**
     * Check if user has a specific permission
     */
    const hasPermission = (permission: string): boolean => {
        return userPermissions.includes(permission);
    };

    /**
     * Check if user has any of the specified permissions
     */
    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some((perm) => userPermissions.includes(perm));
    };

    /**
     * Check if user has all of the specified permissions
     */
    const hasAllPermissions = (permissions: string[]): boolean => {
        return permissions.every((perm) => userPermissions.includes(perm));
    };

    /**
     * Check if user can add requests
     */
    const canAddRequest = (): boolean => {
        return hasPermission("procurement.add_purchaserequest");
    };

    /**
     * Check if user can approve requests
     */
    const canApproveRequest = (): boolean => {
        return hasPermission("procurement.approve_purchaserequest");
    };

    /**
     * Check if user can reject requests
     */
    const canRejectRequest = (): boolean => {
        return hasPermission("procurement.reject_purchaserequest");
    };

    /**
     * Check if user can manage purchase orders
     */
    const canManagePurchaseOrders = (): boolean => {
        return hasAnyPermission([
            "procurement.view_purchaseorder",
            "procurement.add_purchaseorder",
            "procurement.change_purchaseorder",
        ]);
    };

    return {
        userPermissions,
        userGroup,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canAddRequest,
        canApproveRequest,
        canRejectRequest,
        canManagePurchaseOrders,
    };
};
