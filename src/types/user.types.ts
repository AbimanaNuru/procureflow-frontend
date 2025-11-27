// User related types

export interface UserGroup {
    id: number;
    name: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    department: string;
    employee_id: string;
    groups: UserGroup[];
    is_active: boolean;
    is_staff: boolean;
    date_joined: string;
}

export interface UserDetail extends User {
    permissions: string;
    is_superuser: boolean;
    last_login: string;
    created_at: string;
    updated_at: string;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    department: string;
    employee_id: string;
    groups: UserGroup[];
}

export interface PaginatedUsersResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    department?: string;
    employee_id?: string;
    group_ids?: number[];
}

export interface UpdateUserRequest {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    department?: string;
    employee_id?: string;
    group_ids?: number[];
    is_active?: boolean;
    is_staff?: boolean;
}

export interface UpdateProfileRequest {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    department?: string;
    employee_id?: string;
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
}

export interface UserPermission {
    id: number;
    name: string;
    codename: string;
}
