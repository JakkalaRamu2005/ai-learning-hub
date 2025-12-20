"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { UserRole, Permission, hasPermission } from "@/lib/utils/permissions";

/**
 * Auth Hook Return Type
 */
interface UseAuthReturn {
    user: {
        id?: string;
        email?: string;
        name?: string;
        image?: string;
        role?: UserRole;
        permissions?: string[];
        isVerified?: boolean;
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isAdmin: boolean;
    isInstructor: boolean;
    hasRole: (role: UserRole) => boolean;
    hasPermission: (permission: Permission) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
}

/**
 * Custom hook for authentication and authorization
 * Client-side only
 */
export function useAuth(): UseAuthReturn {
    const { data: session, status } = useSession();

    const user = useMemo(() => {
        if (!session?.user) return null;

        return {
            id: (session.user as any).id,
            email: session.user.email || undefined,
            name: session.user.name || undefined,
            image: session.user.image || undefined,
            role: (session.user as any).role as UserRole | undefined,
            permissions: (session.user as any).permissions as string[] | undefined,
            isVerified: (session.user as any).isVerified as boolean | undefined,
        };
    }, [session]);

    const isAuthenticated = status === "authenticated" && !!user;
    const isLoading = status === "loading";

    const isAdmin = useMemo(() => {
        return user?.role === "admin";
    }, [user]);

    const isInstructor = useMemo(() => {
        return user?.role === "instructor" || user?.role === "admin";
    }, [user]);

    const hasRole = (role: UserRole): boolean => {
        return user?.role === role;
    };

    const hasAnyRole = (roles: UserRole[]): boolean => {
        return roles.some((role) => user?.role === role);
    };

    const checkPermission = (permission: Permission): boolean => {
        if (!user?.role) return false;
        return hasPermission(user.role, permission, user.permissions || []);
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        isInstructor,
        hasRole,
        hasPermission: checkPermission,
        hasAnyRole,
    };
}
