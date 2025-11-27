import { UserDetail } from './user.types';

/**
 * Request Item Types
 */
export interface RequestItem {
    id: string;
    request: string;
    name: string;
    description: string;
    quantity: number;
    unit_price: string;
    total_price: string;
    created_at: string;
}

export interface CreateRequestItem {
    name: string;
    description: string;
    quantity: number;
    unit_price: string;
}

/**
 * Item API Types (for standalone item operations)
 */
export interface CreateItemRequest {
    request: string;
    name: string;
    description: string;
    quantity: number;
    unit_price: string;
}

export interface UpdateItemRequest {
    request?: string;
    name?: string;
    description?: string;
    quantity?: number;
    unit_price?: string;
}


/**
 * Approval Level Types
 */
export interface ApprovalLevelDetail {
    id: string;
    level: number;
    group: number;
    group_name: string;
    approver: string;
    approver_name: string;
    status: 'pending' | 'approved' | 'rejected';
    comments: string;
    timestamp: string;
    created_at: string;
}

/**
 * Purchase Order Types
 */
export interface PurchaseOrderItem {
    name: string;
    total: number;
    quantity: number;
    unit_price: number;
}

export interface PurchaseOrder {
    id: string;
    request_title: string;
    vendor: string;
    vendor_name: string;
    vendor_address: string;
    payment_terms: string;
    items: PurchaseOrderItem[];
    extracted_items: any[];
    total_amount: string;
    generated_at: string;
    file: string | null;
    notes: string;
}

export interface CreatePurchaseOrderRequest {
    vendor: string;
    vendor_name: string;
    vendor_address: string;
    payment_terms: string;
    items: PurchaseOrderItem[];
    extracted_items: any[];
    total_amount: string;
    file: string;
    notes: string;
}

/**
 * Request Types
 */
export interface ProcurementRequest {
    id: string;
    title: string;
    description: string;
    amount: string;
    status: 'pending' | 'approved' | 'rejected';
    status_display: string;
    created_by: string;
    created_by_name: string;
    created_at: string;
    updated_at: string;
    current_level: number;
    required_levels: number;
    items_count: string;
    proforma: string;
    receipt: string;
    proforma_data: string;
    receipt_data: string;
    validation_result: string;
}

export interface ProcurementRequestDetail {
    id: string;
    title: string;
    description: string;
    amount: string;
    status: 'pending' | 'approved' | 'rejected';
    status_display: string;
    created_by: string;
    created_by_detail: UserDetail;
    created_at: string;
    updated_at: string;
    proforma: string;
    receipt: string;
    current_level: number;
    required_levels: number;
    is_fully_approved: boolean;
    approval_levels: ApprovalLevelDetail[];
    items: RequestItem[];
    purchase_order: PurchaseOrder | null;
    proforma_data: string;
    receipt_data: string;
    validation_result: string;
}

/**
 * Request List Response (Paginated)
 */
export interface RequestListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProcurementRequest[];
}

/**
 * Create Request Types
 */
export interface CreateRequestInput {
    title: string;
    description: string;
    items: CreateRequestItem[];
}

export interface PurchaseOrderListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PurchaseOrder[];
}

/**
 * AI-Based Endpoint Types
 */

// Generic API Response
export interface ApiResponse {
    detail: string;
}

// Extract Proforma Request
export interface ExtractProformaRequest {
    title: string;
    description: string;
    amount: number;
    current_level?: number;
    required_levels?: number;
    proforma: File;
}

// Validate Receipt Request
export interface ValidateReceiptRequest {
    title?: string;
    description?: string;
    amount?: number;
    current_level?: number;
    required_levels?: number;
    proforma?: File;
    receipt: File;
}

// Approve Request Input
export interface ApproveRequestInput {
    title: string;
}

// Reject Request Input
export interface RejectRequestInput {
    title: string;
}
