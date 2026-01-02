'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import '../../ArticleDetail.css';

interface ArticleDetail {
    uri: string;
    title: string;
    body: string;
    image: string;
    source: { title: string };
    date: string;
}

export default function ArticlePage({ params }: { params: Promise<{ genre: string; articleId: string }> }) {
    const { genre, articleId } = use(params);
    const [article, setArticle] = useState<ArticleDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticleDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/article/${articleId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch article details. It might be unavailable.');
                }
                const data = await response.json();
                setArticle(data);
            } catch (err: any) {
                setError(err.message || 'Error loading article content.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticleDetail();
    }, [articleId]);

    if (loading) {
        return (
            <div className="loadingFull">
                <div className="loader"></div>
                <p>Loading full article content...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="errorFull">
                <p className="errorText">{error || 'Article not found'}</p>
                <Link href={`/blogs/${genre}`} className="retryButton">
                    Back to {genre.replace('-', ' ')}
                </Link>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Recent';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="articleDetailContainer">
            <Link href={`/blogs/${genre}`} className="backButton">
                ← Back to {genre.replace('-', ' ')}
            </Link>

            <article>
                <header>
                    <div className="articleMeta">
                        <span className="detailSource">{article.source?.title || 'News Hub'}</span>
                        <span className="detailDate">{formatDate(article.date)}</span>
                    </div>
                    <h1 className="articleFullTitle">{article.title}</h1>

                    {article.image ? (
                        <img src={article.image} alt={article.title} className="articleHeroImage" />
                    ) : (
                        <div className="placeholderHero">AI Hub Article</div>
                    )}
                </header>

                <div className="articleBodyContent">
                    {/* We split by newlines to create paragraphs for better readability */}
                    {article.body.split('\n').map((para, index) => (
                        para.trim() && <p key={index}>{para}</p>
                    ))}
                </div>
            </article>
        </div>
    );
}
