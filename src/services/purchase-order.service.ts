import apiClient from '@/lib/api-client';
import {
    CreatePurchaseOrderRequest,
    PurchaseOrder,
    PurchaseOrderListResponse
} from '@/types';

export const purchaseOrderService = {
    getAll: async (page = 1): Promise<PurchaseOrderListResponse> => {
        const response = await apiClient.get<PurchaseOrderListResponse>(
            `/procurement/purchase-orders/?page=${page}`
        );
        return response.data;
    },

    create: async (data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> => {
        const response = await apiClient.post<PurchaseOrder>(
            '/procurement/purchase-orders/',
            data
        );
        return response.data;
    },

    getById: async (id: string): Promise<PurchaseOrder> => {
        const response = await apiClient.get<PurchaseOrder>(
            `/procurement/purchase-orders/${id}/`
        );
        return response.data;
    },

    update: async (id: string, data: Partial<CreatePurchaseOrderRequest>): Promise<PurchaseOrder> => {
        const response = await apiClient.patch<PurchaseOrder>(
            `/procurement/purchase-orders/${id}/`,
            data
        );
        return response.data;
    }
};
