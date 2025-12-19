/**
 * API endpoint constants
 * Centralized place for all API routes
 */

export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        LOGOUT: "/api/auth/logout",
        FORGOT_PASSWORD: "/api/auth/forgot-password",
        RESET_PASSWORD: "/api/auth/reset-password",
        VERIFY_EMAIL: "/api/auth/verify-email",
    },

    // User
    USER: {
        PROFILE: "/api/user/profile",
        UPDATE_PROFILE: "/api/user/update-profile",
    },

    // Tools
    TOOLS: {
        LIST: "/api/tools",
        SAVE: "/api/tools/save",
        SAVED: "/api/tools/saved",
    },

    // Resources
    RESOURCES: {
        LIST: "/api/resources",
    },

    // Learning
    LEARNING: {
        MODULES: "/api/learning-modules",
    },
} as const;
