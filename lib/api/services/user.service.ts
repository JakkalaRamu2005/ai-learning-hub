import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";

export interface UserProfile {
    name: string;
    email: string;
    place?: string;
    bio?: string;
    profileImage?: string;
    savedTools: string[];
}

export interface UpdateProfileData {
    name?: string;
    place?: string;
    bio?: string;
    profileImage?: string;
}

export interface ProfileResponse {
    success: boolean;
    user?: UserProfile;
    message?: string;
}

/**
 * User service
 * Handles all user-related API calls
 */
export const userService = {
    /**
     * Get user profile
     */
    getProfile: () => apiClient.get<ProfileResponse>(API_ENDPOINTS.USER.PROFILE),

    /**
     * Update user profile
     */
    updateProfile: (data: UpdateProfileData) =>
        apiClient.post<ProfileResponse>(API_ENDPOINTS.USER.UPDATE_PROFILE, data),
};
