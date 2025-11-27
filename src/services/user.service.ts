import apiClient from '@/lib/api-client';
import {
    ChangePasswordRequest,
    CreateUserRequest,
    PaginatedUsersResponse,
    UpdateProfileRequest,
    UpdateUserRequest,
    User,
    UserDetail,
    UserProfile
} from '@/types';

/**
 * User Service
 * Handles all user-related API calls
 */
export const userService = {
    /**
     * Get paginated list of all users (admin only)
     * @param page - Page number (optional)
     */
    getUsers: async (page?: number): Promise<PaginatedUsersResponse> => {
        const params = page ? { page } : {};
        const response = await apiClient.get<PaginatedUsersResponse>('/users/', { params });
        return response.data;
    },

    /**
     * Create a new user (admin only)
     */
    createUser: async (data: CreateUserRequest): Promise<User> => {
        const response = await apiClient.post<User>('/users/', data);
        return response.data;
    },

    /**
     * Get user by ID with full details
     */
    getUserById: async (userId: string): Promise<UserDetail> => {
        const response = await apiClient.get<UserDetail>(`/users/${userId}/`);
        return response.data;
    },

    /**
     * Update user by ID (admin only)
     */
    updateUser: async (userId: string, data: UpdateUserRequest): Promise<User> => {
        const response = await apiClient.put<User>(`/users/${userId}/`, data);
        return response.data;
    },

    /**
     * Delete user by ID (admin only)
     */
    deleteUser: async (userId: string): Promise<void> => {
        await apiClient.delete(`/users/${userId}/`);
    },

    /**
     * Get user permissions by ID
     */
    getPermissions: async (userId: string): Promise<User> => {
        const response = await apiClient.get<User>(`/users/${userId}/permissions/`);
        return response.data;
    },

    /**
     * Get current user profile
     */
    getProfile: async (): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>('/users/profile/');
        return response.data;
    },

    /**
     * Update current user profile
     */
    updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
        const response = await apiClient.patch<UserProfile>('/users/profile/', data);
        return response.data;
    },

    /**
     * Change current user password
     */
    changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>(
            '/users/change_password/',
            data
        );
        return response.data;
    },
};
