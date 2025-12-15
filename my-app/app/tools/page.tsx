"use client"
import { useState, useEffect } from "react"
import "./tool.css"

const ToolCard = ({ tool, isSaved, onToggleSave }: { tool: any, isSaved: boolean, onToggleSave: (id: string) => void }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="tool-card">
            <div className="tool-header">
                <h3 className="tool-name">{tool.name}</h3>
                <button
                    onClick={() => onToggleSave(tool._id)}
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                >
                    {isSaved ? '★' : '☆'}
                </button>
            </div>
            <span className="tool-category">{tool.category}</span>

            {expanded && <p className="tool-description">{tool.description}</p>}

            <button
                onClick={() => setExpanded(!expanded)}
                className="know-more-btn"
            >
                {expanded ? "Show Less" : "Know More"}
            </button>

            <div className="tool-footer">
                <span className="tool-pricing">{tool.pricing}</span>
                <a href={tool.link} target="_blank" className="tool-link">Visit Tool →</a>
            </div>
        </div>
    );
};

export default function Tools() {
    const [tools, setTools] = useState([]);
    const [filteredTools, setFilteredTools] = useState([]);
    const [savedTools, setSavedTools] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

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
            setSavedTools(data.savedTools || []);
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
