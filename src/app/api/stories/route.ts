import { NextRequest, NextResponse } from 'next/server';
import { fetchTopStories, fetchNewStories, fetchBestStories, fetchMultipleStories } from '@/services/hackerNewsService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'top';
  const limit = parseInt(searchParams.get('limit') || '30', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  try {
    let storyIds: number[] = [];
    
    // Fetch story IDs based on type
    switch (type) {
      case 'new':
        storyIds = await fetchNewStories(limit * page);
        break;
      case 'best':
        storyIds = await fetchBestStories(limit * page);
        break;
      case 'top':
      default:
        storyIds = await fetchTopStories(limit * page);
        break;
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const paginatedIds = storyIds.slice(startIndex, startIndex + limit);
    
    // Fetch story details
    const stories = await fetchMultipleStories(paginatedIds);
    
    return NextResponse.json({
      stories,
      total: storyIds.length,
      page,
      limit,
      hasMore: startIndex + limit < storyIds.length
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
} 