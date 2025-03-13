import { NextRequest, NextResponse } from 'next/server';
import { fetchStory, fetchMultipleComments } from '@/services/hackerNewsService';
import { generateSummary } from '@/services/openaiService';
import { Comment } from '@/types';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const id = parseInt(params.id, 10);
  const includeSummary = request.nextUrl.searchParams.get('summary') === 'true';
  
  try {
    const story = await fetchStory(id);
    
    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }
    
    // Generate AI summary if requested
    let summary = null;
    if (includeSummary && story.url) {
      summary = await generateSummary(story.title, story.url);
    }
    
    // Fetch top-level comments if available
    let comments: Comment[] = [];
    if (story.kids && story.kids.length > 0) {
      const topCommentIds = story.kids.slice(0, 10); // Limit to top 10 comments
      comments = await fetchMultipleComments(topCommentIds);
    }
    
    return NextResponse.json({
      story: {
        ...story,
        summary: summary?.summary || null,
        keywords: summary?.keywords || null
      },
      comments
    });
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
} 