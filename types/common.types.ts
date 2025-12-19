/**
 * Common types used across the application
 */

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface ErrorState {
    message: string;
    code?: string;
    details?: any;
}
