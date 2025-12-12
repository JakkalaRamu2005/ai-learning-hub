"use client"
import { useState, useEffect } from "react"
import "./tool.css"

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

    const categories = ["All", "AI Writing", "AI Image", "AI Video", "AI Voice", "AI Code", "AI Chat"];

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

            <p className="results-count">{filteredTools.length} tools found</p>

            {filteredTools.length === 0 ? (
                <div className="no-results">
                    <p>No tools found. Try a different search or category.</p>
                </div>
            ) : (
                <div className="tools-grid">
                    {filteredTools.map((tool: any, index: number) => (
                        <div key={index} className="tool-card">
                            <div className="tool-header">
                                <h3 className="tool-name">{tool.name}</h3>
                                <button
                                    onClick={() => handleSaveTool(tool._id)}
                                    className={`save-btn ${isSaved(tool._id) ? 'saved' : ''}`}
                                >
                                    {isSaved(tool._id) ? '★' : '☆'}
                                </button>
                            </div>
                            <span className="tool-category">{tool.category}</span>
                            <p className="tool-description">{tool.description}</p>
                            <div className="tool-footer">
                                <span className="tool-pricing">{tool.pricing}</span>
                                <a href={tool.link} target="_blank" className="tool-link">Visit Tool →</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
