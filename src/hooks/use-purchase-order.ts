import { purchaseOrderService } from '@/services/purchase-order.service';
import { CreatePurchaseOrderRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

export const usePurchaseOrders = (page = 1) => {
    return useQuery({
        queryKey: ['purchase-orders', page],
        queryFn: () => purchaseOrderService.getAll(page),
    });
};

export const usePurchaseOrder = (id: string) => {
    return useQuery({
        queryKey: ['purchase-order', id],
        queryFn: () => purchaseOrderService.getById(id),
        enabled: !!id,
    });
};

export const useCreatePurchaseOrder = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: CreatePurchaseOrderRequest) => purchaseOrderService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
            toast({
                title: "Success",
                description: "Purchase Order created successfully",
                variant: "success",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to create purchase order",
                variant: "destructive",
            });
        },
    });
};

export const useUpdatePurchaseOrder = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreatePurchaseOrderRequest> }) =>
            purchaseOrderService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['purchase-order', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
            toast({
                title: "Success",
                description: "Purchase Order updated successfully",
                variant: "success",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to update purchase order",
                variant: "destructive",
            });
        },
    });
};
