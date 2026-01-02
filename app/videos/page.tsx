"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/videos/SearchBar";
import VideoCard from "@/components/videos/VideoCard";
import VideoModal from "@/components/videos/VideoModal";
import "./videos.css";

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelName: string;
    publishedAt: string;
}

export default function VideoSearchPage() {
    const [query, setQuery] = useState("");
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [totalResults, setTotalResults] = useState(0);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    /**
     * Fetches videos from the internal API route which proxies the YouTube Data API.
     * @param searchQuery The topic to search for
     * @param token Pagination token for next set of results
     */
    const fetchVideos = async (searchQuery: string, token: string = "") => {
        setLoading(true);
        setError(null);
        try {
            // We append ' AI' to help the YouTube API filter for educational content
            const response = await fetch(
                `/api/youtube/search?q=${encodeURIComponent(searchQuery)}&pageToken=${token}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch videos");
            }

            // If we have a token, we are appending to existing results (Load More)
            if (token) {
                setVideos((prev) => [...prev, ...data.videos]);
            } else {
                setVideos(data.videos);
            }

            setNextPageToken(data.nextPageToken);
            setTotalResults(data.totalResults);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            setError("Please enter a topic to search");
            return;
        }
        fetchVideos(query);
    };

    const handleLoadMore = () => {
        if (nextPageToken) {
            fetchVideos(query, nextPageToken);
        }
    };

    /**
     * Helper to format the ISO date into a human-readable 'time ago' string.
     */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    // Load initial trending AI content on mount
    useEffect(() => {
        fetchVideos("Latest AI News");
    }, []);

    return (
        <div className="video-search-container">
            {/* Embedded Player in Modal */}
            <VideoModal
                videoId={selectedVideoId}
                onClose={() => setSelectedVideoId(null)}
            />

            <header className="search-header">
                <h1>AI Video Hub</h1>
                <p>
                    Curated educational content and the latest AI breakthroughs from top creators.
                    Learn at your own pace with our dynamic video search.
                </p>
            </header>

            {/* Reusable Search Bar */}
            <SearchBar
                query={query}
                setQuery={setQuery}
                onSearch={handleSearch}
                loading={loading}
                hasResults={videos.length > 0}
            />

            {/* Error Handling UI */}
            {error && (
                <div className="error-message">
                    <p>⚠️ {error}</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && videos.length === 0 && !isInitialLoad && !error && (
                <div className="no-results">
                    <p>No videos found for "{query}". Try keywords like "Machine Learning" or "LLMs".</p>
                </div>
            )}

            {/* Results Grid */}
            {videos.length > 0 && (
                <>
                    <div className="videos-stats">
                        <p>{totalResults.toLocaleString()} educational videos discovered</p>
                    </div>

                    <div className="videos-grid">
                        {videos.map((video, index) => (
                            <VideoCard
                                key={`${video.id}-${index}`}
                                video={video}
                                onWatch={setSelectedVideoId}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>

                    {/* Pagination - Load More */}
                    {nextPageToken && (
                        <div className="load-more-container">
                            <button
                                className="load-more-btn"
                                onClick={handleLoadMore}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="mini-spinner"></span> Loading...
                                    </>
                                ) : "Explore More Videos"}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Global Loading state for initial fetch */}
            {loading && videos.length === 0 && (
                <div className="loader-container">
                    <div className="spinner"></div>
                    <p>Fetching the smartest AI videos...</p>
                </div>
            )}
        </div>
    );
}
