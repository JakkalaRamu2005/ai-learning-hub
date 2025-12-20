import { NextResponse } from "next/server";
import { AuthError } from "@/types/auth";

/**
 * Standard API Response Interface
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    errors?: Record<string, string[]>;
}

/**
 * Success Response
 */
export function successResponse<T>(
    data: T,
    message?: string,
    status: number = 200
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            message,
            data,
        },
        { status }
    );
}

/**
 * Error Response
 */
export function errorResponse(
    message: string,
    status: number = 400,
    errors?: Record<string, string[]>
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error: message,
            errors,
        },
        { status }
    );
}

/**
 * Unauthorized Response
 */
export function unauthorizedResponse(
    message: string = "Authentication required"
): NextResponse<ApiResponse> {
    return errorResponse(message, 401);
}

/**
 * Forbidden Response
 */
export function forbiddenResponse(
    message: string = "Access denied"
): NextResponse<ApiResponse> {
    return errorResponse(message, 403);
}

/**
 * Not Found Response
 */
export function notFoundResponse(
    message: string = "Resource not found"
): NextResponse<ApiResponse> {
    return errorResponse(message, 404);
}

/**
 * Validation Error Response
 */
export function validationErrorResponse(
    errors: Record<string, string[]>,
    message: string = "Validation failed"
): NextResponse<ApiResponse> {
    return errorResponse(message, 422, errors);
}

/**
 * Server Error Response
 */
export function serverErrorResponse(
    message: string = "Internal server error"
): NextResponse<ApiResponse> {
    return errorResponse(message, 500);
}

/**
 * Handle Auth Error
 */
export function handleAuthError(error: AuthError): NextResponse<ApiResponse> {
    return errorResponse(error.message, error.statusCode);
}

/**
 * Handle API Error
 * Centralized error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
    console.error("API Error:", error);

    // Handle AuthError
    if (error instanceof AuthError) {
        return handleAuthError(error);
    }

    // Handle Mongoose Validation Error
    if (error && typeof error === "object" && "name" in error) {
        if (error.name === "ValidationError") {
            const validationError = error as any;
            const errors: Record<string, string[]> = {};

            Object.keys(validationError.errors || {}).forEach((key) => {
                errors[key] = [validationError.errors[key].message];
            });

            return validationErrorResponse(errors);
        }

        // Handle Mongoose CastError (invalid ObjectId)
        if (error.name === "CastError") {
            return errorResponse("Invalid ID format", 400);
        }

        // Handle Mongoose Duplicate Key Error
        if (error.name === "MongoServerError" && "code" in error && error.code === 11000) {
            return errorResponse("Duplicate entry found", 409);
        }
    }

    // Handle standard Error
    if (error instanceof Error) {
        return serverErrorResponse(error.message);
    }

    // Unknown error
    return serverErrorResponse("An unexpected error occurred");
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers with error handling
 */
export function asyncHandler<T = any>(
    handler: (...args: any[]) => Promise<NextResponse<ApiResponse<T>>>
) {
    return async (...args: any[]): Promise<NextResponse<ApiResponse<T>>> => {
        try {
            return await handler(...args);
        } catch (error) {
            return handleApiError(error) as NextResponse<ApiResponse<T>>;
        }
    };
}
