"use client";

import React from 'react';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelName: string;
    publishedAt: string;
}

interface VideoCardProps {
    video: Video;
    onWatch: (id: string) => void;
    formatDate: (date: string) => string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onWatch, formatDate }) => {
    return (
        <div className="video-card">
            <div
                className="video-thumbnail-container"
                onClick={() => onWatch(video.id)}
            >
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="video-thumbnail"
                />
                <div className="play-button-overlay">
                    <span className="play-icon">▶</span>
                </div>
            </div>

            <div className="video-info">
                <h3 className="video-title" dangerouslySetInnerHTML={{ __html: video.title }}></h3>

                <div className="video-meta">
                    <span className="channel-name">{video.channelName}</span>
                    <span className="publish-date">{formatDate(video.publishedAt)}</span>
                </div>

                <p className="video-description">
                    {video.description || "No description available."}
                </p>

                <div className="video-actions">
                    <button
                        className="watch-btn"
                        onClick={() => onWatch(video.id)}
                    >
                        Watch Video
                    </button>
                    <div className="secondary-actions">
                        <button className="action-btn-secondary" title="Coming soon">
                            ✨ Summary
                        </button>
                        <button className="action-btn-secondary" title="Coming soon">
                            📝 Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
