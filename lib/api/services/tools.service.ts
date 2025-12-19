import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";

export interface Tool {
    _id: string;
    name: string;
    category: string;
    description: string;
    link: string;
    pricing: string;
    weekAdded?: string;
    createdAt: string;
}

export interface ToolsResponse {
    success: boolean;
    tools: Tool[];
}

export interface SaveToolResponse {
    success: boolean;
    message: string;
}

/**
 * Tools service
 * Handles all tool-related API calls
 */
export const toolsService = {
    /**
     * Get all tools
     */
    getAll: () => apiClient.get<ToolsResponse>(API_ENDPOINTS.TOOLS.LIST),

    /**
     * Save/unsave a tool
     */
    toggleSave: (toolId: string) =>
        apiClient.post<SaveToolResponse>(API_ENDPOINTS.TOOLS.SAVE, { toolId }),

    /**
     * Get saved tools
     */
    getSaved: () => apiClient.get<ToolsResponse>(API_ENDPOINTS.TOOLS.SAVED),
};
