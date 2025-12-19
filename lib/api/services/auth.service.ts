import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    password: string;
}

export interface VerifyEmailData {
    token: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: any;
}

/**
 * Authentication service
 * Handles all auth-related API calls
 */
export const authService = {
    /**
     * Login user
     */
    login: (credentials: LoginCredentials) =>
        apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials),

    /**
     * Register new user
     */
    register: (data: RegisterData) =>
        apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data),

    /**
     * Logout user
     */
    logout: () => apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGOUT),

    /**
     * Request password reset
     */
    forgotPassword: (data: ForgotPasswordData) =>
        apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data),

    /**
     * Reset password with token
     */
    resetPassword: (data: ResetPasswordData) =>
        apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),

    /**
     * Verify email with token
     */
    verifyEmail: (data: VerifyEmailData) =>
        apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data),
};
