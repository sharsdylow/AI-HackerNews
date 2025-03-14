'use client';

import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import StoryGrid from './StoryGrid';
import { Story } from '@/types';
import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return null;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333 .192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200">{error}</h3>
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchStories(1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Try Again
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto ">
      {loading && stories.length === 0 ? (
        <StoryGrid 
          stories={[]}
          loading={true}
          error={null}
          showRecommendationInfo={showRecommendationInfo}
        />
      ) : (
        <InfiniteScroll
          dataLength={stories.length}
          next={loadMoreStories}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-6">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Loading more stories...</p>
              </div>
            </div>
          }
          endMessage={
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 inline-block px-4 py-2 rounded-full">
                You&apos;ve seen all the stories!
              </p>
            </div>
          }
        >
          <StoryGrid 
            stories={stories}
            loading={false}
            error={null}
            showRecommendationInfo={showRecommendationInfo}
          />
        </InfiniteScroll>
      )}
    </div>
  );
} 