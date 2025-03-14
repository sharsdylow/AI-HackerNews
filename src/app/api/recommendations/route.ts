import { NextRequest, NextResponse } from 'next/server';
import { fetchTopStories, fetchMultipleStories } from '@/services/hackerNewsService';
import { generateRecommendations } from '@/services/openaiService';
import { Story } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { userHistory } = await request.json();
    
    if (!userHistory || !Array.isArray(userHistory)) {
      return NextResponse.json(
        { error: 'User history is required and must be an array' },
        { status: 400 }
      );
    }
    
    // Validate user history items to ensure they have valid IDs
    const validUserHistory = userHistory.filter((story: Partial<Story>) => 
      story && typeof story === 'object' && story.id !== undefined && story.id !== null
    );
    
    // Fetch top stories as available stories for recommendations
    const topStoryIds = await fetchTopStories(50);
    const availableStories = await fetchMultipleStories(topStoryIds);
    
    // Filter out stories that are already in user history
    const userHistoryIds = new Set(validUserHistory.map((story: Story) => story.id));
    const filteredStories = availableStories.filter(story => !userHistoryIds.has(story.id));
    
    // Generate AI recommendations
    const recommendations = await generateRecommendations(validUserHistory, filteredStories);
    // console.log(recommendations);
    // Map recommendations to actual stories
    const recommendedStoryIds = recommendations.map(rec => rec.storyId);
    const recommendedStories = await fetchMultipleStories(recommendedStoryIds);
    // console.log(validUserHistory, recommendedStories);

    // Combine stories with recommendation data
    const enhancedRecommendations = recommendedStories.map(story => {
      const recommendation = recommendations.find(rec => rec.storyId === story.id);
      return {
        ...story,
        recommendationScore: recommendation?.score || 0,
        recommendationReason: recommendation?.reason || ''
      };
    });
    
    return NextResponse.json({
      recommendations: enhancedRecommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
} 