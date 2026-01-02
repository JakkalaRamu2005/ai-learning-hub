"use client";

import React from 'react';

interface SearchBarProps {
    query: string;
    setQuery: (query: string) => void;
    onSearch: (e: React.FormEvent) => void;
    loading: boolean;
    hasResults: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, loading, hasResults }) => {
    return (
        <form className="video-search-bar" onSubmit={onSearch}>
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="video-search-input"
                    placeholder="Search AI topics... (e.g., Machine Learning, Neural Networks)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <button type="submit" className="video-search-button" disabled={loading}>
                {loading && !hasResults ? "Searching..." : "Search"}
            </button>
        </form>
    );
};

export default SearchBar;
