"use client";

import { useEffect, useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(query);
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query, onSearch]);

    return (
        <div className="search-container">
            <div className="search-icon">
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    width="100%"
                    height="100%"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                className="search-input"
                placeholder="Search resources, topics, or platforms..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search resources"
            />
            {query && (
                <button
                    onClick={() => setQuery("")}
                    className="search-clear"
                    aria-label="Clear search"
                >
                    <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
