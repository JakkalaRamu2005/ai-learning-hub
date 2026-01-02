import React from 'react';
import Link from 'next/link';
import './ArticleCard.css';

interface Article {
    uri: string;
    title: string;
    body: string;
    image: string;
    source: { title: string };
    date: string;
}

const ArticleCard: React.FC<{ article: Article; genreId: string }> = ({ article, genreId }) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Recent';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="articleCard">
            <div className="imageWrapper">
                {article.image ? (
                    <img
                        src={article.image}
                        alt={article.title}
                        className="articleImage"
                        loading="lazy"
                    />
                ) : (
                    <div className="placeholderImage">AI Hub</div>
                )}
            </div>
            <div className="contentWrapper">
                <div className="sourceAndDate">
                    <span className="sourceTag">{article.source.title}</span>
                    <span className="dateText">{formatDate(article.date)}</span>
                </div>
                <h3 className="articleTitle" title={article.title}>
                    {article.title}
                </h3>
                <p className="articleDescription">
                    {article.body
                        ? article.body.length > 150
                            ? `${article.body.substring(0, 150)}...`
                            : article.body
                        : 'No description available for this article.'}
                </p>
                <Link
                    href={`/blogs/${genreId}/${article.uri}`}
                    className="readMoreBtn"
                >
                    Read Article
                </Link>
            </div>
        </div>
    );
};

export default ArticleCard;
