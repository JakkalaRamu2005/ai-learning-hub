import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const pageToken = searchParams.get('pageToken') || '';

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'YOUTUBE_API_KEY is not configured' },
            { status: 500 }
        );
    }

    if (!query) {
        return NextResponse.json(
            { error: 'Please enter a topic to search' },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(
                query + ' AI'
            )}&type=video&order=relevance&relevanceLanguage=en&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''
            }`
        );

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
                return NextResponse.json(
                    { error: 'YouTube API quota exceeded. Please try again tomorrow.' },
                    { status: 429 }
                );
            }
            return NextResponse.json(
                { error: errorData.error?.message || 'Failed to fetch videos from YouTube' },
                { status: response.status }
            );
        }

        const data = await response.json();

        const videos = data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high.url,
            channelName: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
        }));

        return NextResponse.json({
            videos,
            nextPageToken: data.nextPageToken || null,
            totalResults: data.pageInfo.totalResults,
        });

    } catch (error) {
        console.error('YouTube Search API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error while searching videos' },
            { status: 500 }
        );
    }
}
