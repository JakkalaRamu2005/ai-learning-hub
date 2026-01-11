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

const ReviewSection = ({ toolId, onClose, isInModal = false }: { toolId: string, onClose: () => void, isInModal?: boolean }) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editComment, setEditComment] = useState("");
    const [editRating, setEditRating] = useState(5);

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

    const handleEditReview = async (reviewId: string) => {
        if (!editComment.trim()) return;

        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: editComment, rating: editRating })
            });
            const data = await res.json();
            if (data.success) {
                setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, comment: editComment, rating: editRating } : r));
                setEditingReviewId(null);
                setEditComment("");
                setEditRating(5);
            } else {
                alert(data.message || "Failed to edit review");
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                setReviews(prev => prev.filter(r => r._id !== reviewId));
            } else {
                alert(data.message || "Failed to delete review");
            }
        } catch (err) { console.error(err); }
    };

    const startEdit = (review: any) => {
        setEditingReviewId(review._id);
        setEditComment(review.comment);
        setEditRating(review.rating);
    };

    if (isInModal) {
        return (
            <div className="review-section-inline">
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
                                    {editingReviewId === review._id ? (
                                        <div className="edit-review-form">
                                            <StarRating rating={editRating} interactive onSetRating={setEditRating} />
                                            <textarea
                                                value={editComment}
                                                onChange={(e) => setEditComment(e.target.value)}
                                                maxLength={280}
                                                className="edit-textarea"
                                            />
                                            <div className="edit-actions">
                                                <button onClick={() => handleEditReview(review._id)} className="save-edit-btn">Save</button>
                                                <button onClick={() => setEditingReviewId(null)} className="cancel-edit-btn">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="review-comment">{review.comment}</p>
                                    )}
                                    <div className="review-footer">
                                        <button className={`like-btn ${review.isLiked ? 'active' : ''}`} onClick={() => handleLike(review._id)}>
                                            <span className="heart">❤</span> {review.likes.length}
                                        </button>
                                        <div className="review-actions">
                                            <button onClick={() => startEdit(review)} className="edit-review-btn">Edit</button>
                                            <button onClick={() => handleDeleteReview(review._id)} className="delete-review-btn">Delete</button>
                                        </div>
                                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                </div>
            </div>
        );
    }

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
                                    {editingReviewId === review._id ? (
                                        <div className="edit-review-form">
                                            <StarRating rating={editRating} interactive onSetRating={setEditRating} />
                                            <textarea
                                                value={editComment}
                                                onChange={(e) => setEditComment(e.target.value)}
                                                maxLength={280}
                                                className="edit-textarea"
                                            />
                                            <div className="edit-actions">
                                                <button onClick={() => handleEditReview(review._id)} className="save-edit-btn">Save</button>
                                                <button onClick={() => setEditingReviewId(null)} className="cancel-edit-btn">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="review-comment">{review.comment}</p>
                                    )}
                                    <div className="review-footer">
                                        <button className={`like-btn ${review.isLiked ? 'active' : ''}`} onClick={() => handleLike(review._id)}>
                                            <span className="heart">❤</span> {review.likes.length}
                                        </button>
                                        <div className="review-actions">
                                            <button onClick={() => startEdit(review)} className="edit-review-btn">Edit</button>
                                            <button onClick={() => handleDeleteReview(review._id)} className="delete-review-btn">Delete</button>
                                        </div>
                                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                </div>
            </div>
        </div>
    );
};

const ToolDetailsModal = ({ tool, onClose }: { tool: any, onClose: () => void }) => {
    return (
        <div className="tool-details-overlay" onClick={onClose}>
            <div className="tool-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="tool-details-header">
                    <div className="tool-details-title-section">
                        <div className="tool-icon-large">
                            <span>{tool.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h2 className="tool-details-name">{tool.name}</h2>
                            <p className="tool-details-category">{tool.category}</p>
                        </div>
                    </div>
                    <button className="close-details" onClick={onClose}>×</button>
                </div>

                <div className="tool-details-content">
                    <div className="tool-details-description">
                        <h3>About</h3>
                        <p>{tool.description}</p>
                    </div>

                    <div className="tool-details-meta">
                        <div className="meta-item">
                            <span className="meta-label">Pricing:</span>
                            <span className="meta-value">{tool.pricing}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Rating:</span>
                            <div className="meta-rating">
                                <StarRating rating={Math.round(tool.averageRating || 0)} />
                                <span>{tool.averageRating ? tool.averageRating.toFixed(1) : "0.0"}</span>
                            </div>
                        </div>
                    </div>

                    <a href={tool.link} target="_blank" rel="noopener noreferrer" className="visit-tool-btn">
                        Visit Tool Website →
                    </a>

                    <div className="tool-details-reviews">
                        <h3>Reviews & Comments ({tool.reviewCount})</h3>
                        <ReviewSection toolId={tool._id} onClose={() => { }} isInModal={true} />
                    </div>
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
    const [showDetails, setShowDetails] = useState(false);

    return (
        <>
            <div className="tool-card" onClick={() => setShowDetails(true)} style={{ cursor: 'pointer' }}>
                <div className="tool-card-header">
                    <div className="tool-icon">
                        <span>{tool.name.charAt(0)}</span>
                    </div>
                    <div className="tool-info">
                        <div className="tool-title-row">
                            <h3 className="tool-name">
                                {tool.name}
                            </h3>
                            {tool.weekAdded && <span className="launch-badge">Launched this month</span>}
                        </div>
                        <p className="tool-tagline">{tool.description}</p>
                    </div>
                </div>

                <div className="tool-card-footer">
                    <div className="rating-section">
                        <StarRating rating={Math.round(tool.averageRating || 0)} />
                        <span className="rating-value">{tool.averageRating ? tool.averageRating.toFixed(1) : "0.0"}</span>
                        <span className="rating-count">({tool.reviewCount} reviews)</span>
                    </div>
                    <div className="tool-actions">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDetails(true);
                            }}
                            className="comment-btn"
                            title="View comments"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span>{tool.reviewCount}</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare(tool);
                            }}
                            className="share-btn-icon"
                            title="Share this tool"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSave(tool._id);
                            }}
                            className={`save-btn ${isSaved ? 'saved' : ''}`}
                            title={isSaved ? "Remove from saved" : "Save tool"}
                        >
                            {isSaved ? '★' : '☆'}
                        </button>
                    </div>
                </div>
            </div>

            {showDetails && <ToolDetailsModal tool={tool} onClose={() => setShowDetails(false)} />}
        </>
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
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

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
