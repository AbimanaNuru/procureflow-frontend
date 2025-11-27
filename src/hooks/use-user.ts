import { userService } from '@/services';
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
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useToast } from './use-toast';

/**
 * Hook to get paginated users list
 */
export const useUsers = (page?: number) => {
    return useQuery<PaginatedUsersResponse, Error>({
        queryKey: ['users', page],
        queryFn: () => userService.getUsers(page),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to create a new user
 */
export const useCreateUser = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation<User, Error, CreateUserRequest>({
        mutationFn: userService.createUser,
        onSuccess: () => {
            toast({
                title: 'User Created',
                description: 'The user has been successfully created.',
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            toast({
                title: 'Creation Failed',
                description: error.message || 'Failed to create user.',
                variant: 'destructive',
            });
        },
    });
};

/**
 * Hook to get user by ID
 */
export const useUser = (userId: string, options?: Omit<UseQueryOptions<UserDetail, Error>, 'queryKey' | 'queryFn'>) => {
    return useQuery<UserDetail, Error>({
        queryKey: ['user', userId],
        queryFn: () => userService.getUserById(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
};

/**
 * Hook to update user
 */
export const useUpdateUser = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation<User, Error, { userId: string; data: UpdateUserRequest }>({
        mutationFn: ({ userId, data }) => userService.updateUser(userId, data),
        onSuccess: (_, variables) => {
            toast({
                title: 'User Updated',
                description: 'The user has been successfully updated.',
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
        },
        onError: (error) => {
            toast({
                title: 'Update Failed',
                description: error.message || 'Failed to update user.',
                variant: 'destructive',
            });
        },
    });
};

/**
 * Hook to delete user
 */
export const useDeleteUser = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: userService.deleteUser,
        onSuccess: () => {
            toast({
                title: 'User Deleted',
                description: 'The user has been successfully deleted.',
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            toast({
                title: 'Deletion Failed',
                description: error.message || 'Failed to delete user.',
                variant: 'destructive',
            });
        },
    });
};

/**
 * Hook to get user permissions
 */
export const useUserPermissions = (userId: string) => {
    return useQuery<User, Error>({
        queryKey: ['user', userId, 'permissions'],
        queryFn: () => userService.getPermissions(userId),
        enabled: !!userId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Hook to get current user profile
 */
export const useUserProfile = () => {
    return useQuery<UserProfile, Error>({
        queryKey: ['user', 'profile'],
        queryFn: userService.getProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        enabled: !!localStorage.getItem('accessToken'), // Only fetch if token exists
    });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation<UserProfile, Error, UpdateProfileRequest>({
        mutationFn: userService.updateProfile,
        onSuccess: () => {
            toast({
                title: 'Profile Updated',
                description: 'Your profile has been successfully updated.',
            });
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
        },
        onError: (error) => {
            toast({
                title: 'Update Failed',
                description: error.message || 'Failed to update profile.',
                variant: 'destructive',
            });
        },
    });
};

/**
 * Hook to change password
 */
export const useChangePassword = () => {
    const { toast } = useToast();

    return useMutation<{ message: string }, Error, ChangePasswordRequest>({
        mutationFn: userService.changePassword,
        onSuccess: (data) => {
            toast({
                title: 'Password Changed',
                description: data.message || 'Your password has been successfully changed.',
            });
        },
        onError: (error) => {
            toast({
                title: 'Password Change Failed',
                description: error.message || 'Failed to change password.',
                variant: 'destructive',
            });
        },
    });
};
