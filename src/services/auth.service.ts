import apiClient from '@/lib/api-client';
import {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse
} from '@/types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
    /**
     * Login user with username and password
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>(
            '/users/auth/login/',
            credentials
        );
        return response.data;
    },

    /**
     * Refresh access token using refresh token
     */
    refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post<RefreshTokenResponse>(
            '/users/auth/refresh/',
            data
        );
        return response.data;
    },

    /**
     * Logout user (client-side only, clear tokens)
     */
    logout: async (): Promise<void> => {
        // Clear tokens from storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },
};
