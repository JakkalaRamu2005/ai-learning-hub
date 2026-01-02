import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ genre: string }> }
) {
    const { genre } = await params;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'NEWS_API_KEY is not configured' },
            { status: 500 }
        );
    }

    const genreKeywords: { [key: string]: string } = {
        'machine-learning': 'Machine Learning',
        'ai-tools': 'AI Tools',
        'deep-learning': 'Deep Learning',
        'natural-language-processing': 'Natural Language Processing',
        'computer-vision': 'Computer Vision',
        'ai-news': 'Artificial Intelligence',
        'ai-for-beginners': 'AI for Beginners',
    };

    const query = genreKeywords[genre] || genre;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 12;

    try {
        // NewsAPI.ai (Event Registry) expects a POST request for best results
        // Documentation suggests getArticles endpoint
        const response = await fetch('https://newsapi.ai/api/v1/article/getArticles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'getArticles',
                keyword: query,
                articlesPage: page,
                articlesCount: pageSize,
                articlesSortBy: 'date',
                articlesArticleBodyLen: 150,
                resultType: 'articles',
                lang: 'eng',
                apiKey: apiKey,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || 'Failed to fetch from NewsAPI.ai' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // NewsAPI.ai returns results in data.articles.results
        if (data.articles) {
            return NextResponse.json({
                articles: data.articles.results || [],
                totalResults: data.articles.totalResults || 0,
                page: page,
                totalPages: Math.ceil((data.articles.totalResults || 0) / pageSize)
            });
        }

        return NextResponse.json({
            articles: [],
            totalResults: 0,
            page: page,
            totalPages: 0
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json(
            { error: 'Internal server error while fetching from NewsAPI.ai' },
            { status: 500 }
        );
    }
}
