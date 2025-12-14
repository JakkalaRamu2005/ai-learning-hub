
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
    const [displayedModules, setDisplayedModules] = useState<Record<string, LearningModule[]>>({});
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
                setDisplayedModules(data.modules);
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

        // Re-group by Category
        const grouped: Record<string, LearningModule[]> = {};
        filtered.forEach(module => {
            if (!grouped[module.Category]) {
                grouped[module.Category] = [];
            }
            grouped[module.Category].push(module);
        });

        setDisplayedModules(grouped);

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

    const totalModulesFound = Object.values(displayedModules).reduce((acc, curr) => acc + curr.length, 0);

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
                Object.entries(displayedModules).map(([category, modules]) => (
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
                ))
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
