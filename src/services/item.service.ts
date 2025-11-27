import apiClient from '@/lib/api-client';
import {
    CreateItemRequest,
    RequestItem,
    UpdateItemRequest
} from '@/types';

/**
 * Item Service
 * Handles all procurement request item related API calls
 */
export const itemService = {
    /**
     * Get a single item by ID
     */
    getItem: async (id: string): Promise<RequestItem> => {
        const response = await apiClient.get<RequestItem>(
            `/procurement/items/${id}/`
        );
        return response.data;
    },

    /**
     * Create a new item for a request
     */
    createItem: async (data: CreateItemRequest): Promise<RequestItem> => {
        const response = await apiClient.post<RequestItem>(
            '/procurement/items/',
            data
        );
        return response.data;
    },

    /**
     * Update an existing item
     */
    updateItem: async (id: string, data: UpdateItemRequest): Promise<RequestItem> => {
        const response = await apiClient.patch<RequestItem>(
            `/procurement/items/${id}/`,
            data
        );
        return response.data;
    },
};
