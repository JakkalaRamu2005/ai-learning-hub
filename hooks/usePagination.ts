import { useState, useMemo } from "react";

export interface PaginationOptions {
    initialPage?: number;
    pageSize?: number;
}

export interface PaginationResult<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    currentData: T[];
    goToPage: (page: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
}

/**
 * Custom hook for pagination logic
 */
export function usePagination<T>(
    data: T[],
    options: PaginationOptions = {}
): PaginationResult<T> {
    const { initialPage = 1, pageSize = 9 } = options;

    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = Math.ceil(data.length / pageSize);

    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, pageSize]);

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        goToPage(currentPage + 1);
    };

    const previousPage = () => {
        goToPage(currentPage - 1);
    };

    const canGoNext = currentPage < totalPages;
    const canGoPrevious = currentPage > 1;

    return {
        currentPage,
        totalPages,
        pageSize,
        currentData,
        goToPage,
        nextPage,
        previousPage,
        canGoNext,
        canGoPrevious,
    };
}
