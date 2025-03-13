'use client';

import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import StoryCard from './StoryCard';
import { Story } from '@/types';

interface StoryListProps {
  type: 'top' | 'new' | 'best';
  showRecommendationInfo?: boolean;
}

export default function StoryList({ type, showRecommendationInfo = false }: StoryListProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stories?type=${type}&page=${pageNum}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      
      const data = await response.json();
      
      if (pageNum === 1) {
        setStories(data.stories);
      } else {
        setStories(prevStories => [...prevStories, ...data.stories]);
      }
      
      setHasMore(data.hasMore);
      setError(null);
    } catch (err) {
      setError('Error loading stories. Please try again later.');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreStories = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStories(nextPage);
  };

  useEffect(() => {
    setPage(1);
    setStories([]);
    fetchStories(1);
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => fetchStories(1)}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {loading && stories.length === 0 ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse flex flex-col w-full max-w-2xl">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800">
                <div className="flex items-start">
                  <div className="mr-4 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={stories.length}
          next={loadMoreStories}
          hasMore={hasMore}
          loader={
            <div className="text-center py-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Loading more stories...</p>
            </div>
          }
          endMessage={
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">
              You&apos;ve seen all the stories!
            </p>
          }
        >
          <div className="space-y-4">
            {stories.map(story => (
              <StoryCard 
                key={story.id} 
                story={story} 
                showRecommendationInfo={showRecommendationInfo}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
} 