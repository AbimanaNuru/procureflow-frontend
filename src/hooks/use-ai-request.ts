import { toast } from '@/hooks/use-toast';
import { requestService } from '@/services/request.service';
import {
    ApiResponse,
    ApproveRequestInput,
    ExtractProformaRequest,
    RejectRequestInput,
    ValidateReceiptRequest
} from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook for extracting proforma invoice data using AI
 */
export const useExtractProforma = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, Error, ExtractProformaRequest>({
        mutationFn: (data: ExtractProformaRequest) => requestService.extractProforma(data),
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: data.detail || 'Proforma extracted successfully',
            });
            // Invalidate requests list to refresh data
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            queryClient.invalidateQueries({ queryKey: ['my-requests'] });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to extract proforma',
                variant: 'destructive',
            });
        },
    });
};

/**
 * Hook for validating receipt against purchase order using AI
 */
export const useValidateReceipt = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, Error, { id: string; data: ValidateReceiptRequest }>({
        mutationFn: ({ id, data }) => requestService.validateReceipt(id, data),
        onSuccess: (data, variables) => {
            toast({
                title: 'Success',
                description: data.detail || 'Receipt validated successfully',
            });
            // Invalidate the specific request to refresh its data
            queryClient.invalidateQueries({ queryKey: ['request', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['requests'] });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to validate receipt',
                variant: 'destructive',
            });
        },
    });
};

/**
 * Hook for approving a procurement request
 */
export const useApproveRequest = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, Error, { id: string; data: ApproveRequestInput }>({
        mutationFn: ({ id, data }) => requestService.approveRequest(id, data),
        onSuccess: (data, variables) => {
            toast({
                title: 'Success',
                description: data.detail || 'Request approved successfully',
            });
            // Invalidate the specific request and lists
            queryClient.invalidateQueries({ queryKey: ['request', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            queryClient.invalidateQueries({ queryKey: ['my-requests'] });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to approve request',
                variant: 'destructive',
            });
        },
    });
};

/**
 * Hook for rejecting a procurement request
 */
export const useRejectRequest = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, Error, { id: string; data: RejectRequestInput }>({
        mutationFn: ({ id, data }) => requestService.rejectRequest(id, data),
        onSuccess: (data, variables) => {
            toast({
                title: 'Success',
                description: data.detail || 'Request rejected successfully',
            });
            // Invalidate the specific request and lists
            queryClient.invalidateQueries({ queryKey: ['request', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            queryClient.invalidateQueries({ queryKey: ['my-requests'] });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to reject request',
                variant: 'destructive',
            });
        },
    });
};
