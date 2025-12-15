
"use client";
import { useState, useEffect } from "react";
import "./learn.css";

interface LearningModule {
    Category: string;
    SkillLevel: string;
    VideoNumber: string;
    VideoTitle: string;
    ChannelName: string;
    Duration: string;
    VideoLink: string;
}

export default function LearnPage() {
    const [allModules, setAllModules] = useState<LearningModule[]>([]);
    const [filteredModules, setFilteredModules] = useState<LearningModule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter States
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");

    // Video Modal State
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    // Expanded Cards State
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/learning-modules");
                if (!res.ok) throw new Error("Failed to fetch data");
                const data = await res.json();

                // Flatten the grouped data for filtering
                const flatModules: LearningModule[] = [];
                Object.values(data.modules).forEach((group: any) => {
                    flatModules.push(...group);
                });

                setAllModules(flatModules);
                // Initial set will be handled by the filter effect
            } catch (err) {
                setError("Failed to load learning modules. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = allModules;

        // Search Filter
        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            filtered = filtered.filter(module =>
                module.VideoTitle.toLowerCase().includes(lowerSearch) ||
                module.ChannelName.toLowerCase().includes(lowerSearch)
            );
        }

        // Category Filter
        if (selectedCategory !== "All") {
            filtered = filtered.filter(module => module.Category === selectedCategory);
        }

        // Difficulty Filter (Skill Level)
        if (selectedDifficulty !== "All") {
            filtered = filtered.filter(module => module.SkillLevel === selectedDifficulty);
        }

        setFilteredModules(filtered);
        setCurrentPage(1); // Reset to first page on filter change

    }, [searchText, selectedCategory, selectedDifficulty, allModules]);

    const handleThumbnailClick = (link: string) => {
        const videoId = extractVideoID(link);
        if (videoId) {
            setSelectedVideo(videoId);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedCards(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Pagination Logic
    const indexOfLastModule = currentPage * itemsPerPage;
    const indexOfFirstModule = indexOfLastModule - itemsPerPage;
    const currentModules = filteredModules.slice(indexOfFirstModule, indexOfLastModule);
    const totalPages = Math.ceil(filteredModules.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage > 3) {
                pageNumbers.push(1);
                pageNumbers.push('...');
            } else {
                for (let i = 1; i <= 3; i++) {
                    pageNumbers.push(i);
                }
            }

            if (currentPage > 3 && currentPage < totalPages - 2) {
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else {
                if (currentPage > 3) {
                    // handled by simplePages logic below better
                }
            }
        }

        // Consistent simplified logic
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

    // Group current page modules for display
    const displayedGroupedModules: Record<string, LearningModule[]> = {};
    currentModules.forEach(module => {
        if (!displayedGroupedModules[module.Category]) {
            displayedGroupedModules[module.Category] = [];
        }
        displayedGroupedModules[module.Category].push(module);
    });

    // Get unique categories and difficulties for dropdowns
    const categories = ["All", ...Array.from(new Set(allModules.map(m => m.Category)))];
    const difficulties = ["All", ...Array.from(new Set(allModules.map(m => m.SkillLevel)))];

    if (loading) {
        return (
            <div className="learn-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your curriculum...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="learn-container">
                <div className="loading-error">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const totalModulesFound = filteredModules.length;

    return (
        <div className="learn-container">
            {selectedVideo && (
                <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
                    <div className="video-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedVideo(null)}>&times;</button>
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                            title="YouTube video player"
                            className="video-frame"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            <header className="learn-header">
                <h1 className="learn-title">AI Learning Curriculum</h1>
                <p className="learn-subtitle">
                    Comprehensive, step-by-step learning paths curated to take you from beginner to expert.
                    Updated weekly from our community resources.
                </p>
            </header>

            {/* Filter Section */}
            <div className="filter-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="category-filter">
                    <label className="filter-label">Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="category-filter">
                    <label className="filter-label">Skill Level:</label>
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="category-select"
                    >
                        {difficulties.map((diff) => (
                            <option key={diff} value={diff}>{diff}</option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="results-count">{totalModulesFound} videos found</p>

            {totalModulesFound === 0 ? (
                <div className="no-results">
                    <p>No learning modules found matching your criteria.</p>
                </div>
            ) : (
                <>
                    {Object.entries(displayedGroupedModules).map(([category, modules]) => (
                        <section key={category} id={toSlug(category)} className="path-section">
                            <div className="path-header">
                                <h2 className="path-name">{category}</h2>
                                <span className="modules-count">
                                    {modules.length} Videos
                                </span>
                            </div>

                            <div className="modules-grid">
                                {modules.map((module, index) => {
                                    const uniqueId = `${module.Category}-${module.VideoNumber}`;
                                    const videoId = extractVideoID(module.VideoLink);
                                    const isExpanded = expandedCards[uniqueId];

                                    return (
                                        <div key={index} className="module-card">
                                            {/* Thumbnail */}
                                            <div
                                                className="module-thumbnail-container"
                                                onClick={() => handleThumbnailClick(module.VideoLink)}
                                            >
                                                {videoId ? (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                        alt={module.VideoTitle}
                                                        className="module-thumbnail"
                                                    />
                                                ) : (
                                                    <div className="thumbnail-placeholder">No Thumbnail</div>
                                                )}
                                                <div className="play-overlay">
                                                    <span className="play-icon">▶</span>
                                                </div>
                                            </div>

                                            <div className="module-content">
                                                <h3 className="module-name">{module.VideoTitle}</h3>

                                                <button
                                                    className="know-more-btn"
                                                    onClick={() => toggleExpand(uniqueId)}
                                                >
                                                    {isExpanded ? "Show Less" : "Know More"}
                                                </button>

                                                {isExpanded && (
                                                    <div className="module-details">
                                                        <div className="detail-row">
                                                            <span className="detail-label">Channel:</span>
                                                            <span className="detail-value">{module.ChannelName}</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <span className="detail-label">Duration:</span>
                                                            <span className="detail-value">{module.Duration} mins</span>
                                                        </div>
                                                        <div className="detail-row">
                                                            <span className="detail-label">Level:</span>
                                                            <span className={`module-difficulty ${module.SkillLevel}`}>
                                                                {module.SkillLevel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}

                    {/* Pagination Controls */}
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
            )}
        </div>
    );
}

function toSlug(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function extractVideoID(url: string) {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : null;
}
