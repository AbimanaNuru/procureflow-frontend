import apiClient from '@/lib/api-client';
import {
    ApiResponse,
    ApproveRequestInput,
    CreateRequestInput,
    ExtractProformaRequest,
    ProcurementRequestDetail,
    RejectRequestInput,
    RequestListResponse,
    ValidateReceiptRequest
} from '@/types';

/**
 * Request Service
 * Handles all procurement request related API calls
 */
export const requestService = {
    /**
     * Get all procurement requests (paginated)
     */
    getRequests: async (page = 1): Promise<RequestListResponse> => {
        const response = await apiClient.get<RequestListResponse>(
            `/procurement/requests/?page=${page}`
        );
        return response.data;
    },

    /**
     * Get a single procurement request by ID
     */
    getRequest: async (id: string): Promise<ProcurementRequestDetail> => {
        const response = await apiClient.get<ProcurementRequestDetail>(
            `/procurement/requests/${id}/`
        );
        return response.data;
    },

    /**
     * Get current user's procurement requests
     */
    getMyRequests: async (): Promise<RequestListResponse> => {
        const response = await apiClient.get<RequestListResponse>(
            '/procurement/requests/my_requests/'
        );
        return response.data;
    },

    /**
     * Create a new procurement request
     */
    createRequest: async (data: CreateRequestInput): Promise<ProcurementRequestDetail> => {
        const response = await apiClient.post<ProcurementRequestDetail>(
            '/procurement/requests/',
            data
        );
        return response.data;
    },

    /**
     * Extract proforma invoice data using AI
     */
    extractProforma: async (data: ExtractProformaRequest): Promise<ApiResponse> => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('amount', data.amount.toString());

        if (data.current_level !== undefined) {
            formData.append('current_level', data.current_level.toString());
        }
        if (data.required_levels !== undefined) {
            formData.append('required_levels', data.required_levels.toString());
        }
        formData.append('proforma', data.proforma);

        const response = await apiClient.post<ApiResponse>(
            '/procurement/requests/extract_proforma/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    /**
     * Validate receipt against purchase order using AI
     */
    validateReceipt: async (id: string, data: ValidateReceiptRequest): Promise<ApiResponse> => {
        const formData = new FormData();

        if (data.title) formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        if (data.amount !== undefined) formData.append('amount', data.amount.toString());
        if (data.current_level !== undefined) formData.append('current_level', data.current_level.toString());
        if (data.required_levels !== undefined) formData.append('required_levels', data.required_levels.toString());
        if (data.proforma) formData.append('proforma', data.proforma);
        formData.append('receipt', data.receipt);

        const response = await apiClient.post<ApiResponse>(
            `/procurement/requests/${id}/validate_receipt/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    /**
     * Approve a procurement request
     */
    approveRequest: async (id: string, data: ApproveRequestInput): Promise<ApiResponse> => {
        const response = await apiClient.post<ApiResponse>(
            `/procurement/requests/${id}/approve/`,
            data
        );
        return response.data;
    },

    /**
     * Reject a procurement request
     */
    rejectRequest: async (id: string, data: RejectRequestInput): Promise<ApiResponse> => {
        const response = await apiClient.post<ApiResponse>(
            `/procurement/requests/${id}/reject/`,
            data
        );
        return response.data;
    },
};
