export interface ApprovalLevel {
    id?: string;
    level: number;
    group: number;
    group_name?: string;
    created_at?: string;
}

export interface ApprovalConfig {
    id: string;
    min_amount: string;
    max_amount: string;
    is_active: boolean;
    levels: ApprovalLevel[];
    levels_count?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateApprovalLevelRequest {
    level: number;
    group: number;
}

export interface CreateApprovalConfigRequest {
    min_amount: string;
    max_amount: string;
    is_active?: boolean;
    levels: CreateApprovalLevelRequest[];
}

export interface ApprovalConfigListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ApprovalConfig[];
}
