import { requestService } from '@/services';
import {
    CreateRequestInput,
    ProcurementRequestDetail,
    RequestListResponse
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

/**
 * Hook to get all procurement requests (paginated)
 */
export const useRequests = (page = 1) => {
    return useQuery<RequestListResponse, Error>({
        queryKey: ['requests', page],
        queryFn: () => requestService.getRequests(page),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to get a single procurement request by ID
 */
export const useRequest = (id: string) => {
    return useQuery<ProcurementRequestDetail, Error>({
        queryKey: ['request', id],
        queryFn: () => requestService.getRequest(id),
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: !!id, // Only run query if id is provided
    });
};

/**
 * Hook to get current user's procurement requests
 */
export const useMyRequests = () => {
    return useQuery<RequestListResponse, Error>({
        queryKey: ['my-requests'],
        queryFn: () => requestService.getMyRequests(),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to create a new procurement request
 */
export const useCreateRequest = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation<ProcurementRequestDetail, Error, CreateRequestInput>({
        mutationFn: requestService.createRequest,
        onSuccess: () => {
            toast({
                title: 'Request Created',
                description: 'Your procurement request has been successfully created.',
            });
            // Invalidate and refetch request lists
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            queryClient.invalidateQueries({ queryKey: ['my-requests'] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.detail || error.message || 'Failed to create request.';
            toast({
                title: 'Creation Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        },
    });
};
