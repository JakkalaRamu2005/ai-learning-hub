import { UserRole, Permission } from "@/lib/utils/permissions";

/**
 * Authenticated User Session
 */
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    permissions: string[];
    image?: string;
    isVerified: boolean;
}

/**
 * Auth Error Types
 */
export enum AuthErrorType {
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    INVALID_TOKEN = "INVALID_TOKEN",
    SESSION_EXPIRED = "SESSION_EXPIRED",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
}

/**
 * Auth Error
 */
export class AuthError extends Error {
    type: AuthErrorType;
    statusCode: number;

    constructor(type: AuthErrorType, message: string, statusCode: number = 401) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.name = "AuthError";
    }
}

/**
 * Role Check Options
 */
export interface RoleCheckOptions {
    requireAll?: boolean; // Require all roles (AND) vs any role (OR)
    allowedRoles: UserRole[];
}

/**
 * Permission Check Options
 */
export interface PermissionCheckOptions {
    requireAll?: boolean; // Require all permissions (AND) vs any permission (OR)
    requiredPermissions: Permission[];
}
