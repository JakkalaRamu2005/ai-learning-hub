"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ShareModal from "@/components/ShareModal"
import "../tools/tool.css"

const ToolCard = ({ tool, onToggleSave, onShare }: {
    tool: any,
    onToggleSave: (id: string) => void,
    onShare: (tool: any) => void
}) => {
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
                        className="save-btn saved"
                        title="Remove from saved"
                    >
                        ★
                    </button>
                </div>
            </div>

            <div className="tool-meta">
                <span className="tool-category">{tool.category}</span>
                {tool.weekAdded && <span className="tool-week-badge">{tool.weekAdded}</span>}
            </div>

            <p className="tool-description">{tool.description}</p>

            <div className="tool-footer">
                <span className="tool-pricing">{tool.pricing}</span>
                <a href={tool.link} target="_blank" className="tool-link" rel="noopener noreferrer">Visit Tool →</a>
            </div>
        </div>
    );
};

export default function SavedTools() {
    const router = useRouter();
    const [savedToolsData, setSavedToolsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Share Modal State
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareData, setShareData] = useState<{ url: string; title: string }>({ url: "", title: "" });

    const fetchSavedTools = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/saved-tools");

            if (!res.ok) {
                if (res.status === 401) {
                    router.push("/login?callback=/saved-tools");
                }
                setLoading(false);
                return;
            }
            const data = await res.json();
            setSavedToolsData(data.savedTools || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching saved tools:", error);
            setLoading(false);
        }
    }

    const handleToggleSave = async (toolId: string) => {
        try {
            const res = await fetch("/api/save-tool", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toolId })
            });

            const data = await res.json();

            if (!data.saved) {
                setSavedToolsData(prev => prev.filter(t => t._id !== toolId));
            }
        } catch (error) {
            console.error("Error toggling save:", error);
        }
    };

    const handleShareTool = (tool: any) => {
        const baseUrl = window.location.origin + "/tools";
        const shareUrl = `${baseUrl}?search=${encodeURIComponent(tool.name)}`;

        setShareData({
            url: shareUrl,
            title: `Check out ${tool.name} - ${tool.category} AI Tool`
        });
        setShareModalOpen(true);
    };

    useEffect(() => {
        fetchSavedTools();
    }, []);

    if (loading) {
        return <div className="loading"><div className="spinner"></div><p>Loading your saved tools...</p></div>;
    }

    return (
        <div className="tools-container">
            <ShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                shareUrl={shareData.url}
                title={shareData.title}
            />

            <h1 className="tools-title">My Saved Tools</h1>
            <p className="tools-subtitle">The AI tools you've bookmarked for later</p>

            {savedToolsData.length === 0 ? (
                <div className="no-results" style={{ marginTop: '2rem' }}>
                    <p>You haven't saved any tools yet.</p>
                    <Link href="/tools" className="share-view-btn" style={{ marginTop: '1.5rem', display: 'inline-flex', textDecoration: 'none' }}>
                        Browse AI Tools
                    </Link>
                </div>
            ) : (
                <div className="tools-grid">
                    {savedToolsData.map((tool) => (
                        <ToolCard
                            key={tool._id}
                            tool={tool}
                            onToggleSave={handleToggleSave}
                            onShare={handleShareTool}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}