import apiClient from '@/lib/api-client';
import {
    ApprovalConfig,
    ApprovalConfigListResponse,
    CreateApprovalConfigRequest
} from '@/types';

/**
 * Approval Service
 * Handles all approval configuration related API calls
 */
export const approvalService = {
    /**
     * Get all approval configurations
     */
    getApprovalConfigs: async (page = 1): Promise<ApprovalConfigListResponse> => {
        const response = await apiClient.get<ApprovalConfigListResponse>(
            `/procurement/approval-configs/?page=${page}`
        );
        return response.data;
    },

    /**
     * Create a new approval configuration
     */
    createApprovalConfig: async (data: CreateApprovalConfigRequest): Promise<ApprovalConfig> => {
        const response = await apiClient.post<ApprovalConfig>(
            '/procurement/approval-configs/',
            data
        );
        return response.data;
    },
};
