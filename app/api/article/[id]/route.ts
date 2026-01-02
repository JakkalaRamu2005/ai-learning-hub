import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'NEWS_API_KEY is not configured' },
            { status: 500 }
        );
    }

    try {
        const response = await fetch('https://newsapi.ai/api/v1/article/getArticle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'getArticle',
                articleUri: id,
                infoArticleBodyLen: -1, // Fetch full article body
                resultType: 'info',
                apiKey: apiKey,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || 'Failed to fetch article details' },
                { status: response.status }
            );
        }

        const data = await response.json() as any;

        // NewsAPI.ai (Event Registry) returns article details nested under the URI and an 'info' key
        // Structure: { "URI": { "info": { ...article details... } } }

        let articleData = null;

        // 1. Try direct URI access
        if (data[id]) {
            articleData = data[id].info || data[id];
        }
        // 2. Fallback to first value if ID mismatch occurs (sometimes URI is truncated/modified)
        else {
            const values = Object.values(data) as any[];
            if (values.length > 0) {
                articleData = values[0].info || values[0];
            }
        }

        if (!articleData || typeof articleData !== 'object') {
            return NextResponse.json(
                { error: 'Article content not found in API response' },
                { status: 404 }
            );
        }

        // Ensure source exists to avoid frontend crash
        if (!articleData.source) {
            articleData.source = { title: 'Unknown Source' };
        }

        return NextResponse.json(articleData);
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json(
            { error: 'Internal server error while fetching article details' },
            { status: 500 }
        );
    }
}
