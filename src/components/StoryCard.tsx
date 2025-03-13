'use client';

import Link from 'next/link';
import { Story } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface StoryCardProps {
  story: Story;
  showRecommendationInfo?: boolean;
}

export default function StoryCard({ story, showRecommendationInfo = false }: StoryCardProps) {
  const hostname = story.url ? new URL(story.url).hostname.replace(/^www\./, '') : '';
  const timeAgo = formatDistanceToNow(new Date(story.time * 1000), { addSuffix: true });
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className="mr-4 flex flex-col items-center">
          <span className="text-orange-500 font-bold">{story.score}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">points</span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-1">
            <Link href={story.url || `/story/${story.id}`} target={story.url ? "_blank" : "_self"} className="hover:text-orange-500 transition-colors">
              {story.title}
            </Link>
          </h2>
          {hostname && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              ({hostname})
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            by {story.by} {timeAgo} | {story.descendants || 0} comments
          </div>
          
          {story.summary && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
              <h3 className="font-semibold mb-1">AI Summary:</h3>
              <p>{story.summary}</p>
              
              {story.keywords && story.keywords.length > 0 && (
                <div className="mt-2">
                  <span className="font-semibold">Keywords: </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {story.keywords.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {showRecommendationInfo && story.recommendationReason && (
            <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded text-sm">
              <h3 className="font-semibold mb-1">Why we recommend this:</h3>
              <p>{story.recommendationReason}</p>
              <div className="mt-1">
                <span className="font-semibold">Match score: </span>
                <span className="text-orange-600 dark:text-orange-400">
                  {story.recommendationScore}%
                </span>
              </div>
            </div>
          )}
          
          <div className="mt-3">
            <Link 
              href={`/story/${story.id}`}
              className="text-sm text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              View details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 