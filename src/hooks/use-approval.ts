import { approvalService } from '@/services';
import {
    ApprovalConfig,
    ApprovalConfigListResponse,
    CreateApprovalConfigRequest
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

/**
 * Hook to get approval configurations
 */
export const useApprovalConfigs = (page = 1) => {
    return useQuery<ApprovalConfigListResponse, Error>({
        queryKey: ['approval-configs', page],
        queryFn: () => approvalService.getApprovalConfigs(page),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to create a new approval configuration
 */
export const useCreateApprovalConfig = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation<ApprovalConfig, Error, CreateApprovalConfigRequest>({
        mutationFn: approvalService.createApprovalConfig,
        onSuccess: () => {
            toast({
                title: 'Configuration Created',
                description: 'The approval configuration has been successfully created.',
            });
            queryClient.invalidateQueries({ queryKey: ['approval-configs'] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.detail || error.message || 'Failed to create configuration.';
            toast({
                title: 'Creation Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        },
    });
};
