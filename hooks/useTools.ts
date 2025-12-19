import { useState, useEffect, useCallback } from "react";
import { toolsService, type Tool } from "@/lib/api/services";

interface UseToolsResult {
    tools: Tool[];
    savedTools: string[];
    loading: boolean;
    error: string | null;
    toggleSaveTool: (toolId: string) => Promise<void>;
    refreshTools: () => Promise<void>;
}

/**
 * Custom hook for managing tools
 * Handles fetching, saving, and state management
 */
export function useTools(): UseToolsResult {
    const [tools, setTools] = useState<Tool[]>([]);
    const [savedTools, setSavedTools] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTools = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [toolsResponse, savedResponse] = await Promise.all([
                toolsService.getAll(),
                toolsService.getSaved().catch(() => ({ success: false, tools: [] })),
            ]);

            if (toolsResponse.success) {
                setTools(toolsResponse.tools);
            }

            if (savedResponse.success) {
                setSavedTools(savedResponse.tools.map((tool) => tool._id));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch tools");
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleSaveTool = useCallback(async (toolId: string) => {
        try {
            const response = await toolsService.toggleSave(toolId);

            if (response.success) {
                setSavedTools((prev) =>
                    prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
                );
            }
        } catch (err) {
            console.error("Failed to toggle save tool:", err);
            throw err;
        }
    }, []);

    useEffect(() => {
        fetchTools();
    }, [fetchTools]);

    return {
        tools,
        savedTools,
        loading,
        error,
        toggleSaveTool,
        refreshTools: fetchTools,
    };
}
