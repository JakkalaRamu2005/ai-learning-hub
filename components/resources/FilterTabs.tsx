"use client";

import { useEffect, useRef } from "react";

interface FilterTabsProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
    counts: Record<string, number>;
}

export default function FilterTabs({ categories, activeCategory, onSelect, counts }: FilterTabsProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Scroll active tab into view on mount or change
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeTab = scrollContainerRef.current.querySelector('[data-active="true"]');
            if (activeTab) {
                activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [activeCategory]);

    return (
        <div className="tabs-container group">
            <div
                ref={scrollContainerRef}
                className="tabs-scroll-area"
                role="tablist"
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        role="tab"
                        aria-selected={activeCategory === category}
                        data-active={activeCategory === category}
                        onClick={() => onSelect(category)}
                        className={`filter-tab ${activeCategory === category ? 'active' : ''}`}
                    >
                        <span>{category}</span>
                        <span className="tab-count">
                            {counts[category] || 0}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
