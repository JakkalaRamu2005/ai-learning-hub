import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import type { Resource } from "@/types";

export interface ResourcesResponse {
    success: boolean;
    resources: Resource[];
}

/**
 * Resources service
 * Handles all resource-related API calls
 */
export const resourcesService = {
    /**
     * Get all resources
     */
    getAll: () => apiClient.get<ResourcesResponse>(API_ENDPOINTS.RESOURCES.LIST),
};
