/**
 * Permission Constants
 * Defines all available permissions in the system
 */

export const PERMISSIONS = {
    // User Management
    USERS_VIEW: "users:view",
    USERS_CREATE: "users:create",
    USERS_UPDATE: "users:update",
    USERS_DELETE: "users:delete",
    USERS_BAN: "users:ban",

    // Course Management
    COURSES_VIEW_ALL: "courses:view_all",
    COURSES_CREATE: "courses:create",
    COURSES_UPDATE: "courses:update",
    COURSES_DELETE: "courses:delete",
    COURSES_PUBLISH: "courses:publish",

    // Quiz Management
    QUIZZES_CREATE: "quizzes:create",
    QUIZZES_UPDATE: "quizzes:update",
    QUIZZES_DELETE: "quizzes:delete",

    // Resource Management
    RESOURCES_CREATE: "resources:create",
    RESOURCES_UPDATE: "resources:update",
    RESOURCES_DELETE: "resources:delete",

    // Tool Management
    TOOLS_CREATE: "tools:create",
    TOOLS_UPDATE: "tools:update",
    TOOLS_DELETE: "tools:delete",

    // Analytics
    ANALYTICS_VIEW: "analytics:view",
    ANALYTICS_EXPORT: "analytics:export",

    // Content Moderation
    CONTENT_MODERATE: "content:moderate",
    FORUM_MODERATE: "forum:moderate",

    // System Settings
    SETTINGS_UPDATE: "settings:update",
    SETTINGS_VIEW: "settings:view",
} as const;

/**
 * Role Definitions
 * Maps roles to their default permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly string[]> = {
    user: [
        // Users can only view their own data and enrolled courses
    ] as const,

    instructor: [
        // Instructors can manage their own courses
        PERMISSIONS.COURSES_VIEW_ALL,
        PERMISSIONS.COURSES_CREATE,
        PERMISSIONS.COURSES_UPDATE,
        PERMISSIONS.QUIZZES_CREATE,
        PERMISSIONS.QUIZZES_UPDATE,
        PERMISSIONS.QUIZZES_DELETE,
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.FORUM_MODERATE,
    ] as const,

    admin: [
        // Admins have all permissions
        ...Object.values(PERMISSIONS),
    ] as const,
};

/**
 * User Roles
 */
export type UserRole = "user" | "admin" | "instructor";

/**
 * Permission type
 */
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
    role: UserRole,
    permission: Permission,
    customPermissions: string[] = []
): boolean {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    return (
        rolePermissions.includes(permission) || customPermissions.includes(permission)
    );
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(
    role: UserRole,
    permissions: Permission[],
    customPermissions: string[] = []
): boolean {
    return permissions.some((permission) =>
        hasPermission(role, permission, customPermissions)
    );
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(
    role: UserRole,
    permissions: Permission[],
    customPermissions: string[] = []
): boolean {
    return permissions.every((permission) =>
        hasPermission(role, permission, customPermissions)
    );
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(
    role: UserRole,
    customPermissions: string[] = []
): string[] {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    return [...new Set([...rolePermissions, ...customPermissions])];
}
