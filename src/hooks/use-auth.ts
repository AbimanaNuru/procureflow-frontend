import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services';
import { LoginRequest, LoginResponse } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';

/**
 * Hook for user login
 */
export const useLogin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: authService.login,
        onSuccess: (data) => {
            // Store tokens and update state
            login(data.access, data.refresh);

            toast({
                title: 'Login Successful',
                description: 'Welcome back to ProcureFlow',
                className: "bg-green-600 text-white border-green-600",
            });

            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: ['user'] });

            // Navigate to dashboard
            navigate('/dashboard');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.detail || error.message || 'Invalid credentials. Please try again.';
            toast({
                title: 'Login Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        },
    });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { logout } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<void, Error, void>({
        mutationFn: authService.logout,
        onSuccess: () => {
            // Clear state and storage
            logout();
            // Clear all queries
            queryClient.clear();

            toast({
                title: 'Logged Out',
                description: 'You have been successfully logged out.',
            });

            // Navigate to login
            navigate('/login');
        },
        onError: (error) => {
            toast({
                title: 'Logout Failed',
                description: error.message || 'An error occurred during logout.',
                variant: 'destructive',
            });
        },
    });
};
