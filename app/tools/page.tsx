"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ShareModal from "@/components/ShareModal"
import "./tool.css"

const StarRating = ({ rating, interactive = false, onSetRating }: { rating: number, interactive?: boolean, onSetRating?: (r: number) => void }) => {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((s) => (
                <span
                    key={s}
                    className={`star ${s <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
                    onClick={() => interactive && onSetRating?.(s)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

const ReviewSection = ({ toolId, onClose }: { toolId: string, onClose: () => void }) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?toolId=${toolId}`);
                const data = await res.json();
                if (data.success) setReviews(data.reviews);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchReviews();
    }, [toolId]);

    const handlePostReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toolId, rating: newRating, comment: newComment })
            });
            const data = await res.json();
            if (data.success) {
                setReviews([data.review, ...reviews]);
                setNewComment("");
                setNewRating(5);
            } else {
                alert(data.message || "Failed to post review");
            }
        } catch (err) { console.error(err); }
        finally { setSubmitting(false); }
    };

    const handleLike = async (reviewId: string) => {
        // Optimistic UI for likes
        setReviews(prev => prev.map(r => {
            if (r._id === reviewId) {
                const isLiked = r.isLiked; // Needs to be calculated or stored
                return { ...r, likes: isLiked ? r.likes.slice(0, -1) : [...r.likes, "temp"], isLiked: !isLiked };
            }
            return r;
        }));

        try {
            await fetch("/api/reviews/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId })
            });
        } catch (err) { console.error(err); }
    };

    return (
        <div className="review-section-overlay">
            <div className="review-section">
                <div className="review-header">
                    <h4>User Reviews</h4>
                    <button className="close-reviews" onClick={onClose}>×</button>
                </div>

                <form className="add-review-form" onSubmit={handlePostReview}>
                    <StarRating rating={newRating} interactive onSetRating={setNewRating} />
                    <textarea
                        placeholder="Write a micro-review (max 280 chars)..."
                        maxLength={280}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={submitting} className="post-review-btn">
                        {submitting ? "Posting..." : "Post Review"}
                    </button>
                </form>

                <div className="reviews-list">
                    {loading ? <p>Loading reviews...</p> :
                        reviews.length === 0 ? <p className="no-reviews">No reviews yet. Be the first!</p> :
                            reviews.map(review => (
                                <div key={review._id} className="review-item">
                                    <div className="review-user-info">
                                        <div className="user-avatar">{review.user.name[0]}</div>
                                        <div className="user-meta">
                                            <span className="user-name">{review.user.name}</span>
                                            <StarRating rating={review.rating} />
                                        </div>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                    <div className="review-footer">
                                        <button className={`like-btn ${review.isLiked ? 'active' : ''}`} onClick={() => handleLike(review._id)}>
                                            <span className="heart">❤</span> {review.likes.length}
                                        </button>
                                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                </div>
            </div>
        </div>
    );
};

const ToolCard = ({ tool, isSaved, onToggleSave, onShare }: {
    tool: any,
    isSaved: boolean,
    onToggleSave: (id: string) => void,
    onShare: (tool: any) => void
}) => {
    const [showReviews, setShowReviews] = useState(false);

    return (
        <div className="tool-card">
            <div className="tool-header">
                <h3 className="tool-name">
                    <a href={tool.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {tool.name}
                    </a>
                </h3>
                <div className="tool-actions">
                    <button
                        onClick={() => onShare(tool)}
                        className="share-btn-icon"
                        title="Share this tool"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onToggleSave(tool._id)}
                        className={`save-btn ${isSaved ? 'saved' : ''}`}
                        title={isSaved ? "Remove from saved" : "Save tool"}
                    >
                        {isSaved ? '★' : '☆'}
                    </button>
                </div>
            </div>

            <div className="tool-meta">
                <div className="rating-info">
                    <StarRating rating={Math.round(tool.averageRating || 0)} />
                    <span className="rating-value">{tool.averageRating || "0.0"}</span>
                    <span className="rating-count">({tool.reviewCount})</span>
                </div>
                {tool.weekAdded && <span className="tool-week-badge">{tool.weekAdded}</span>}
            </div>

            <div className="tool-genre">
                <span className="tool-category">{tool.category}</span>
                {tool.averageRating >= 4.5 && <span className="sentiment-tag highly-recommended">Highly Recommended</span>}
                {tool.averageRating >= 4.0 && tool.averageRating < 4.5 && <span className="sentiment-tag popular">Popular</span>}
            </div>

            <p className="tool-description">{tool.description}</p>

            <button className="reviews-toggle-btn" onClick={() => setShowReviews(true)}>
                💬 Reviews & Ratings
            </button>

            <div className="tool-footer">
                <span className="tool-pricing">{tool.pricing}</span>
                <a href={tool.link} target="_blank" className="tool-link" rel="noopener noreferrer">Visit Tool →</a>
            </div>

            {showReviews && <ReviewSection toolId={tool._id} onClose={() => setShowReviews(false)} />}
        </div>
    );
};

function ToolsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [tools, setTools] = useState([]);
    const [filteredTools, setFilteredTools] = useState([]);
    const [savedTools, setSavedTools] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Share Modal State
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareData, setShareData] = useState<{ url: string; title: string }>({ url: "", title: "" });

    // Initialize from URL parameters
    useEffect(() => {
        const urlSearch = searchParams.get('search');
        const urlCategory = searchParams.get('category');

        if (urlSearch) setSearchText(urlSearch);
        if (urlCategory) setSelectedCategory(urlCategory);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchTools = async () => {
        try {
            const res = await fetch("/api/tools");
            const data = await res.json();
            setTools(data.tools || []);
            setFilteredTools(data.tools || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tools:", error);
            setLoading(false);
        }
    };

    const fetchSavedTools = async () => {
        try {
            const res = await fetch("/api/saved-tools");
            const data = await res.json();
            setSavedTools(data.savedToolIds || []);
        } catch (error) {
            console.error("Error fetching saved tools:", error);
        }
    };

    useEffect(() => {
        fetchTools(); // eslint-disable-line react-hooks/exhaustive-deps
        fetchSavedTools(); // eslint-disable-line react-hooks/exhaustive-deps
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const filterTools = () => {
        let filtered = tools;

        // Filter by search text
        if (searchText) {
            filtered = filtered.filter((tool: any) =>
                tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== "All") {
            filtered = filtered.filter((tool: any) => tool.category === selectedCategory);
        }

        setFilteredTools(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Share functionality
    const handleShareTool = (tool: any) => {
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?search=${encodeURIComponent(tool.name)}`;

        setShareData({
            url: shareUrl,
            title: `Check out ${tool.name} - ${tool.category} AI Tool`
        });
        setShareModalOpen(true);
    };

    const handleShareCurrentView = () => {
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();

        if (searchText) params.set('search', searchText);
        if (selectedCategory !== "All") params.set('category', selectedCategory);

        const shareUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
        const title = params.toString()
            ? `AI Tools - ${selectedCategory !== "All" ? selectedCategory : "All Categories"}`
            : "AI Tools Collection - Discover Amazing AI Tools";

        setShareData({ url: shareUrl, title });
        setShareModalOpen(true);
    };

    // Pagination Logic
    const indexOfLastTool = currentPage * itemsPerPage;
    const indexOfFirstTool = indexOfLastTool - itemsPerPage;
    const currentTools = filteredTools.slice(indexOfFirstTool, indexOfLastTool);
    const totalPages = Math.ceil(filteredTools.length / itemsPerPage);

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
            // Always show first page
            if (currentPage > 3) {
                pageNumbers.push(1);
                pageNumbers.push('...');
            } else {
                for (let i = 1; i <= 3; i++) {
                    pageNumbers.push(i);
                }
            }

            // Middle pages
            if (currentPage > 3 && currentPage < totalPages - 2) {
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
            }

            // Last pages
            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else {
                if (currentPage > 3) {
                    // If we are at the end, show the last 3-4 pages properly
                    // Do nothing here since the first block handles the start, and we just need the end
                }
                // Actually simpler logic for "1 2 3 4 5 ... 9" style:
            }
        }

        // Let's refine the logic to match "1 2 3 4 5 ... 9" style exactly
        const simplePages = [];
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

    useEffect(() => {
        filterTools(); // eslint-disable-line react-hooks/exhaustive-deps
    }, [searchText, selectedCategory, tools]);

    const handleSaveTool = async (toolId: string) => {
        try {
            const res = await fetch("/api/save-tool", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toolId })
            });

            const data = await res.json();

            if (data.saved) {
                setSavedTools([...savedTools, toolId]);
            } else {
                setSavedTools(savedTools.filter(id => id !== toolId));
            }

        } catch (error) {
            console.error("Error saving tool:", error);
        }
    };

    const isSaved = (toolId: string) => savedTools.includes(toolId);

    const categories = ["All", "AI Writing", "AI Image", "AI Video", "AI Voice", "AI Code", "AI Chat", "AI Marketing", "AI Analytics", "AI Productivity", "AI Workflow", "AI Presentation", "AI Data", "AI Research", "AI Notes", "AI Design", "AI Enterprise"];

    if (loading) {
        return <div className="loading">Loading tools...</div>;
    }

    return (
        <div className="tools-container">
            {/* Share Modal */}
            <ShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                shareUrl={shareData.url}
                title={shareData.title}
            />

            <h1 className="tools-title">AI Tools Collection</h1>
            <p className="tools-subtitle">Discover and save your favorite AI tools</p>

            <div className="filter-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search tools..."
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
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleShareCurrentView}
                    className="share-view-btn"
                    title="Share current filtered view"
                >
                    🔗 Share View
                </button>
            </div>

            <p className="results-count">
                {selectedCategory === "All"
                    ? `Total Tools: ${filteredTools.length}`
                    : `${selectedCategory} Tools: ${filteredTools.length}`
                }
            </p>

            {filteredTools.length === 0 ? (
                <div className="no-results">
                    <p>No tools found. Try a different search or category.</p>
                </div>
            ) : (
                <>
                    <div className="tools-grid">
                        {currentTools.map((tool: any, index: number) => (
                            <ToolCard
                                key={index}
                                tool={tool}
                                isSaved={isSaved(tool._id)}
                                onToggleSave={handleSaveTool}
                                onShare={handleShareTool}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-container">
                            {/* Page Numbers */}
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

                            {/* Next Button */}
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

export default function Tools() {
    return (
        <Suspense fallback={<div className="loading">Loading tools...</div>}>
            <ToolsContent />
        </Suspense>
    );
}
