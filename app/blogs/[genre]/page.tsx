'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import ArticleCard from '../ArticleCard';
import "../blogs.css"

const GENRES = [
    { id: 'machine-learning', label: 'Machine Learning' },
    { id: 'ai-tools', label: 'AI Tools' },
    { id: 'deep-learning', label: 'Deep Learning' },
    { id: 'natural-language-processing', label: 'NLP' },
    { id: 'computer-vision', label: 'Computer Vision' },
    { id: 'ai-news', label: 'AI News' },
    { id: 'ai-for-beginners', label: 'AI For Beginners' },
];

interface Article {
    uri: string;
    title: string;
    body: string;
    image: string;
    source: { title: string };
    date: string;
}

export default function GenrePage({ params }: { params: Promise<{ genre: string }> }) {
    const { genre: currentGenre } = use(params);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/articles/${currentGenre}?page=${page}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch articles. Please try again later.');
                }
                const data = await response.json();
                setArticles(data.articles);
                setTotalPages(data.totalPages);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching news.');
            } finally {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        fetchArticles();
    }, [currentGenre, page]);

    // Reset page when genre changes
    useEffect(() => {
        setPage(1);
    }, [currentGenre]);

    return (
        <div className="blogsContainer">
            <header className="blogsHeader">
                <h1 className="blogsTitle">AI Learning Blogs</h1>
                <p className="blogsSubtitle">Stay updated with the latest in Artificial Intelligence</p>
            </header>

            <nav className="genreNav">
                {GENRES.map((genre) => (
                    <Link
                        key={genre.id}
                        href={`/blogs/${genre.id}`}
                        className={`genreLink ${currentGenre === genre.id ? 'activeGenre' : ''}`}
                    >
                        {genre.label}
                    </Link>
                ))}
            </nav>

            {loading ? (
                <div className="loadingWrapper">
                    <div className="loader"></div>
                    <p>Fetching the latest AI insights...</p>
                </div>
            ) : error ? (
                <div className="errorWrapper">
                    <p className="errorText">{error}</p>
                    <button onClick={() => window.location.reload()} className="retryButton">
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    <div className="articlesGrid">
                        {articles.length > 0 ? (
                            articles.map((article, index) => (
                                <ArticleCard
                                    key={`${article.uri}-${index}`}
                                    article={article}
                                    genreId={currentGenre}
                                />
                            ))
                        ) : (
                            <p className="noArticles">No articles found for this topic.</p>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pageButton"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                ← Previous
                            </button>
                            <span className="pageInfo">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="pageButton"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
