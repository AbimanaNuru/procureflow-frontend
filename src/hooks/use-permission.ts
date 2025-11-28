import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to check if the current user has a specific permission
 * @param permission The permission codename to check (e.g., 'procurement.add_purchaserequest')
 * @returns boolean indicating if the user has the permission
 */
export const usePermission = (permission: string): boolean => {
    const { user } = useAuth();

    if (!user) return false;

    // Check if user is in Admin group (Admin has all permissions)
    const isAdmin = user.groups.some(g => g.name === 'Admin');
    if (isAdmin) return true;

    // Check if user has the permission (permissions is an array of strings from backend)
    return user.permissions?.includes(permission) ?? false;
};

/**
 * Hook to check if the current user has ANY of the provided permissions
 */
export const useAnyPermission = (permissions: string[]): boolean => {
    const { user } = useAuth();

    if (!user) return false;

    const isAdmin = user.groups.some(g => g.name === 'Admin');
    if (isAdmin) return true;

    return permissions.some(permission =>
        user.permissions?.includes(permission)
    ) ?? false;
};
