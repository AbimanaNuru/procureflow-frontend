// Authentication related types
import { UserProfile } from './user.types';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    refresh: string;
    access: string;
}

export interface AuthState {
    user: UserProfile | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

export interface RefreshTokenRequest {
    refresh: string;
}

export interface RefreshTokenResponse {
    access: string;
}
