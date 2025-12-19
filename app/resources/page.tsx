"use client";

import { useState, useEffect, useMemo } from "react";
import SearchBar from "../../components/resources/SearchBar";
import FilterTabs from "../../components/resources/FilterTabs";
import ResourceCard from "../../components/resources/ResourceCard";
import { Resource, SortOption } from "../../types/resource";
import "./resources.css";


const CATEGORIES = [
    "All Resources",
    "Channel",
    "Free Course",
    "Practice Platform",
    "GitHub Repository",
    "AI Newsletter",
    "eBook",
    "Community",
    "Certification"
];

const DIFFICULTIES = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function ResourcesPage() {
    // State
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");




    const [activeCategory, setActiveCategory] = useState("All Resources");
    const [activeDifficulty, setActiveDifficulty] = useState("All Levels");
    const [sortBy, setSortBy] = useState<SortOption>("Newest");
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Effect to set "For You" if personalized


    // Load initial data and bookmarks
    useEffect(() => {
        async function fetchResources() {
            try {
                const res = await fetch("/api/resources");
                if (!res.ok) throw new Error("Failed to fetch resources");
                const data = await res.json();
                setResources(data.resources || []);
            } catch (error) {
                console.error("Error loading resources:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchResources();

        // Load bookmarks from local storage
        const savedBookmarks = localStorage.getItem("ai_resource_bookmarks");
        if (savedBookmarks) {
            setBookmarkedIds(new Set(JSON.parse(savedBookmarks)));
        }
    }, []);

    // Toggle Bookmark
    const toggleBookmark = (resourceName: string) => {
        const newBookmarks = new Set(bookmarkedIds);
        if (newBookmarks.has(resourceName)) {
            newBookmarks.delete(resourceName);
        } else {
            newBookmarks.add(resourceName);
        }
        setBookmarkedIds(newBookmarks);
        localStorage.setItem("ai_resource_bookmarks", JSON.stringify(Array.from(newBookmarks)));
    };

    // Filter and Sort Logic
    const filteredResources = useMemo(() => {
        let result = resources;

        // 1. Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.ResourceName.toLowerCase().includes(lowerQuery) ||
                r.Description.toLowerCase().includes(lowerQuery) ||
                r.Platform.toLowerCase().includes(lowerQuery) ||
                r.WhatYouLearn.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Category Filter
        if (activeCategory === "Bookmarked") {
            result = result.filter(r => bookmarkedIds.has(r.ResourceName));
        } else if (activeCategory !== "All Resources") {
            result = result.filter(r => r.Type === activeCategory || (activeCategory === "eBooks & Guides" && r.Type === "eBook"));
        }

        // 3. Difficulty Filter (Only apply if NOT in "For You" or if user manually changed it?)
        // Let's allow manual override even in "For You" if they want specific level. 
        // But if "All Levels", let "For You" logic prevail? 
        // Actually, let's strictly respect the dropdown if it's NOT "All Levels".
        if (activeDifficulty !== "All Levels") {
            result = result.filter(r => r.Difficulty === activeDifficulty);
        }

        // 4. Sorting
        return [...result].sort((a, b) => {
            switch (sortBy) {
                case "Newest":
                    return new Date(b.DateAdded).getTime() - new Date(a.DateAdded).getTime();
                case "Alphabetical":
                    return a.ResourceName.localeCompare(b.ResourceName);
                case "Difficulty":
                    const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
                    // Default to Intermediate if difficulty is unknown
                    const getDifficultyValue = (d: string) => difficultyOrder[d as keyof typeof difficultyOrder] || 2;
                    return getDifficultyValue(a.Difficulty) - getDifficultyValue(b.Difficulty);
                default:
                    return 0;
            }
        });
    }, [resources, searchQuery, activeCategory, activeDifficulty, sortBy, bookmarkedIds]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeCategory, activeDifficulty, sortBy]);

    // Pagination Logic
    const indexOfLastResource = currentPage * itemsPerPage;
    const indexOfFirstResource = indexOfLastResource - itemsPerPage;
    const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, '...', totalPages];
        } else if (currentPage >= totalPages - 3) {
            return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    };

    // Calculate Counts for Tabs
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};

        let baseForCounts = resources;
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            baseForCounts = baseForCounts.filter(r =>
                r.ResourceName.toLowerCase().includes(lowerQuery) ||
                r.Description.toLowerCase().includes(lowerQuery)
            );
        }
        if (activeDifficulty !== "All Levels") {
            baseForCounts = baseForCounts.filter(r => r.Difficulty === activeDifficulty);
        }

        counts["All Resources"] = baseForCounts.length;
        counts["Bookmarked"] = baseForCounts.filter(r => bookmarkedIds.has(r.ResourceName)).length;

        // Count for "For You" - Replicate logic briefly


        baseForCounts.forEach(r => {
            counts[r.Type] = (counts[r.Type] || 0) + 1;
        });

        return counts;
    }, [resources, searchQuery, activeDifficulty, bookmarkedIds]);


    return (
        <main className="resources-container">
            {/* Hero Section */}
            <div className="resources-hero">
                <div className="hero-background">
                    <div className="hero-blob blob-1"></div>
                    <div className="hero-blob blob-2"></div>
                </div>

                <div className="hero-content">
                    <span className="hero-badge">
                        Free Education
                    </span>
                    <h1 className="hero-title">
                        Free AI Learning Resources
                    </h1>
                    <p className="hero-subtitle">
                        Curated collection of <span className="highlight-text">130+ free resources</span> to master AI - from beginner friendly tools to advanced engineering certifications.
                    </p>

                    <SearchBar onSearch={setSearchQuery} />

                    <p className="results-count">
                        Showing {filteredResources.length} of {resources.length} resources
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="resources-filters">
                <div className="filters-wrapper">
                    <div className="filters-content">
                        {/* Categories */}
                        <FilterTabs
                            categories={CATEGORIES}
                            activeCategory={activeCategory}
                            onSelect={setActiveCategory}
                            counts={categoryCounts}
                        />

                        {/* Secondary Filters Row */}
                        <div className="secondary-filters">
                            {/* Difficulty Pills */}
                            <div className="level-filters">
                                <span className="filter-label">Level:</span>
                                {DIFFICULTIES.map(diff => (
                                    <button
                                        key={diff}
                                        onClick={() => setActiveDifficulty(diff)}
                                        className={`level-btn ${activeDifficulty === diff ? 'active' : ''}`}
                                        aria-pressed={activeDifficulty === diff}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>

                            {/* Sorting */}
                            <div className="sort-container">
                                <span className="filter-label">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="sort-select"
                                >
                                    <option value="Newest">Newest First</option>
                                    <option value="Alphabetical">Alphabetical</option>
                                    <option value="Difficulty">Difficulty (Low-High)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resources Grid */}
            <div className="resources-grid-container">
                {isLoading ? (
                    // Loading State skeletons
                    <div className="resources-grid">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="skeleton"></div>
                        ))}
                    </div>
                ) : filteredResources.length > 0 ? (
                    <>
                        <div className="resources-grid">
                            {currentResources.map((resource, idx) => (
                                <ResourceCard
                                    key={`${resource.ResourceName}-${idx}`}
                                    resource={resource}
                                    index={idx}
                                    isBookmarked={bookmarkedIds.has(resource.ResourceName)}
                                    onToggleBookmark={toggleBookmark}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination-container">
                                {getPageNumbers().map((number, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof number === 'number' ? handlePageChange(number) : null}
                                        className={`pagination-btn ${currentPage === number ? 'active' : ''} ${number === '...' ? 'dots' : ''}`}
                                        disabled={number === '...'}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="pagination-btn next-btn"
                                >
                                    Next &gt;
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // Empty State
                    // Empty State
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg style={{ width: 40, height: 40 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>No resources found</h3>
                        <p className="card-desc" style={{ maxWidth: '28rem', margin: '0 auto' }}>
                            We couldn&apos;t find any resources matching your current filters. Try adjusting your search or clearing filters.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setActiveCategory("All Resources");
                                setActiveDifficulty("All Levels");
                            }}
                            className="reset-btn"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            <div style={{ height: '5rem' }}></div>
        </main>
    );
}

