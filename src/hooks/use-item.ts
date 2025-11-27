import { itemService } from '@/services';
import {
    CreateItemRequest,
    RequestItem,
    UpdateItemRequest
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

/**
 * Hook to get a single item by ID
 */
export const useItem = (id: string) => {
    return useQuery<RequestItem, Error>({
        queryKey: ['item', id],
        queryFn: () => itemService.getItem(id),
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: !!id, // Only run query if id is provided
    });
};

/**
 * Hook to create a new item
 */
export const useCreateItem = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation<RequestItem, Error, CreateItemRequest>({
        mutationFn: itemService.createItem,
        onSuccess: (data) => {
            toast({
                title: 'Item Added',
                description: 'The item has been successfully added to the request.',
            });
            // Invalidate the request detail to refetch with new item
            queryClient.invalidateQueries({ queryKey: ['request', data.request] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.detail || error.message || 'Failed to add item.';
            toast({
                title: 'Failed to Add Item',
                description: errorMessage,
                variant: 'destructive',
            });
        },
    });
};

/**
 * Hook to update an existing item
 */
export const useUpdateItem = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation<RequestItem, Error, { id: string; data: UpdateItemRequest }>({
        mutationFn: ({ id, data }) => itemService.updateItem(id, data),
        onSuccess: (data) => {
            toast({
                title: 'Item Updated',
                description: 'The item has been successfully updated.',
            });
            // Invalidate the request detail and item queries
            queryClient.invalidateQueries({ queryKey: ['request', data.request] });
            queryClient.invalidateQueries({ queryKey: ['item', data.id] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.detail || error.message || 'Failed to update item.';
            toast({
                title: 'Failed to Update Item',
                description: errorMessage,
                variant: 'destructive',
            });
        },
    });
};
