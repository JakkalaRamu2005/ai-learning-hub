"use client";

import { useState } from "react";
import { Resource } from "../../types/resource";


interface ResourceCardProps {
    resource: Resource;
    index: number;
    isBookmarked: boolean;
    onToggleBookmark: (resourceName: string) => void;
}

const TYPE_CLASSES: Record<string, string> = {
    "AI Tool": "type-ai-tool",
    "Free Course": "type-course",
    "Practice Platform": "type-platform",
    "GitHub Repository": "type-github",
    "AI Newsletter": "type-newsletter",
    "eBook": "type-ebook",
    "Community": "type-community",
    "Certification": "type-cert",
    "default": "type-github"
};

const DIFFICULTY_CLASSES = {
    "Beginner": "diff-beginner",
    "Intermediate": "diff-intermediate",
    "Advanced": "diff-advanced"
};

export default function ResourceCard({ resource, index, isBookmarked, onToggleBookmark }: ResourceCardProps) {
    const [showDetails, setShowDetails] = useState(false);

    const typeClass = TYPE_CLASSES[resource.Type] || TYPE_CLASSES["default"];
    const difficultyClass = DIFFICULTY_CLASSES[resource.Difficulty] || DIFFICULTY_CLASSES["Beginner"];
    const whatYouLearnItems = resource.WhatYouLearn.split(" • ");

    return (
        <div
            className="resource-card"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Top Badge Section */}
            <div className="card-header">
                <span className={`type-badge ${typeClass}`}>
                    {resource.Type}
                </span>
            </div>

            {/* Main Content */}
            <div className="mb-4">
                <h3 className="card-title">
                    {resource.ResourceName}
                </h3>
                <p className="card-platform">
                    by {resource.Platform}
                </p>

                {showDetails ? (
                    <>
                        <p className="card-desc">
                            {resource.Description}
                        </p>

                        {/* What You'll Learn */}
                        <div className="card-learn-preview">
                            <h4 className="preview-label">
                                What you&apos;ll learn
                            </h4>
                            <ul className="learn-list">
                                {whatYouLearnItems.map((item, idx) => (
                                    <li key={idx} className="learn-item">
                                        <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="line-clamp-1">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : null}

                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="know-more-btn"
                >
                    {showDetails ? "Show Less" : "Know More"}
                </button>
            </div>


            {/* Footer Actions */}
            <div className="card-footer">
                <div className={`diff-badge ${difficultyClass}`}>
                    {resource.Difficulty}
                </div>

                <div className="card-actions">
                    <button
                        onClick={() => onToggleBookmark(resource.ResourceName)}
                        className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark resource"}
                    >
                        <svg className={`w-5 h-5 ${isBookmarked ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    <a
                        href={resource.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="access-btn"
                    >
                        Access Free
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
