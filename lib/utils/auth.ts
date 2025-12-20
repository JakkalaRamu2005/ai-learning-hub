import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/lib/db/models/User.model";
import {
    AuthUser,
    AuthError,
    AuthErrorType,
    RoleCheckOptions,
    PermissionCheckOptions,
} from "@/types/auth";
import {
    UserRole,
    Permission,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
} from "@/lib/utils/permissions";

/**
 * Get authenticated user from session
 * @throws AuthError if user is not authenticated
 */
export async function getAuthUser(): Promise<AuthUser> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        throw new AuthError(
            AuthErrorType.UNAUTHORIZED,
            "You must be logged in to access this resource",
            401
        );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email })
        .select("_id email name role permissions image isVerified")
        .lean();

    if (!user) {
        throw new AuthError(
            AuthErrorType.UNAUTHORIZED,
            "User not found",
            401
        );
    }

    return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions || [],
        image: user.image,
        isVerified: user.isVerified,
    };
}

/**
 * Require authentication
 * @throws AuthError if user is not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
    return getAuthUser();
}

/**
 * Require specific role(s)
 * @throws AuthError if user doesn't have required role
 */
export async function requireRole(
    options: RoleCheckOptions | UserRole[]
): Promise<AuthUser> {
    const user = await getAuthUser();

    const { allowedRoles, requireAll } =
        Array.isArray(options)
            ? { allowedRoles: options, requireAll: false }
            : options;

    const hasRole = requireAll
        ? allowedRoles.every((role) => user.role === role)
        : allowedRoles.includes(user.role);

    if (!hasRole) {
        throw new AuthError(
            AuthErrorType.FORBIDDEN,
            `Access denied. Required role(s): ${allowedRoles.join(", ")}`,
            403
        );
    }

    return user;
}

/**
 * Require admin role
 * @throws AuthError if user is not an admin
 */
export async function requireAdmin(): Promise<AuthUser> {
    return requireRole(["admin"]);
}

/**
 * Require instructor or admin role
 * @throws AuthError if user is not an instructor or admin
 */
export async function requireInstructor(): Promise<AuthUser> {
    return requireRole(["instructor", "admin"]);
}

/**
 * Require specific permission(s)
 * @throws AuthError if user doesn't have required permission
 */
export async function requirePermission(
    options: PermissionCheckOptions | Permission[]
): Promise<AuthUser> {
    const user = await getAuthUser();

    const { requiredPermissions, requireAll } =
        Array.isArray(options)
            ? { requiredPermissions: options, requireAll: false }
            : options;

    const hasRequiredPermission = requireAll
        ? hasAllPermissions(user.role, requiredPermissions, user.permissions)
        : hasAnyPermission(user.role, requiredPermissions, user.permissions);

    if (!hasRequiredPermission) {
        throw new AuthError(
            AuthErrorType.INSUFFICIENT_PERMISSIONS,
            `Access denied. Required permission(s): ${requiredPermissions.join(", ")}`,
            403
        );
    }

    return user;
}

/**
 * Check if user has permission (without throwing error)
 */
export async function checkPermission(permission: Permission): Promise<boolean> {
    try {
        const user = await getAuthUser();
        return hasPermission(user.role, permission, user.permissions);
    } catch {
        return false;
    }
}

/**
 * Check if user has role (without throwing error)
 */
export async function checkRole(role: UserRole): Promise<boolean> {
    try {
        const user = await getAuthUser();
        return user.role === role;
    } catch {
        return false;
    }
}

/**
 * Check if user is admin (without throwing error)
 */
export async function isAdmin(): Promise<boolean> {
    return checkRole("admin");
}

/**
 * Check if user is instructor (without throwing error)
 */
export async function isInstructor(): Promise<boolean> {
    try {
        const user = await getAuthUser();
        return user.role === "instructor" || user.role === "admin";
    } catch {
        return false;
    }
}

/**
 * Optional auth - returns user if authenticated, null otherwise
 */
export async function getOptionalAuthUser(): Promise<AuthUser | null> {
    try {
        return await getAuthUser();
    } catch {
        return null;
    }
}
