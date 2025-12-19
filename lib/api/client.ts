/**
 * Centralized API client with error handling and request/response interceptors
 */

export class APIError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = "APIError";
    }
}

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

/**
 * Base API client
 */
class APIClient {
    private baseURL: string;

    constructor(baseURL: string = "") {
        this.baseURL = baseURL;
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, ...fetchOptions } = options;

        // Build URL with query params
        let url = `${this.baseURL}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        // Default headers
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...fetchOptions.headers,
        };

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers,
                credentials: "include", // Include cookies
            });

            // Handle non-JSON responses
            const contentType = response.headers.get("content-type");
            const isJSON = contentType?.includes("application/json");

            if (!response.ok) {
                const errorData = isJSON ? await response.json() : await response.text();
                throw new APIError(
                    response.status,
                    errorData?.message || errorData || "An error occurred",
                    errorData
                );
            }

            // Return JSON if available, otherwise return text
            return isJSON ? await response.json() : (await response.text()) as T;
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }

            // Network or other errors
            throw new APIError(0, error instanceof Error ? error.message : "Network error");
        }
    }

    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "GET" });
    }

    async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "DELETE" });
    }
}

export const apiClient = new APIClient();
