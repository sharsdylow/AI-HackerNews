'use client';

import { useState, useEffect } from 'react';
import StoryCard from './StoryCard';
import { Story } from '@/types';
import Link from 'next/link';

interface StoryGridProps {
  stories: Story[];
  loading: boolean;
  error: string | null;
  showRecommendationInfo?: boolean;
  emptyMessage?: string;
  errorAction?: {
    label: string;
    href: string;
  };
}

export default function StoryGrid({ 
  stories, 
  loading, 
  error, 
  showRecommendationInfo = false,
  emptyMessage = "No stories available at this time.",
  errorAction
}: StoryGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 p-5">
            <div className="animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              </div>
              <div className="flex space-x-4 mt-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
              </div>
              <div className="mt-4 h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="mt-4 flex justify-end">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        {errorAction && (
          <Link 
            href={errorAction.href}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            {errorAction.label}
          </Link>
        )}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-300">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stories.map(story => (
        <StoryCard 
          key={story.id} 
          story={story} 
          showRecommendationInfo={showRecommendationInfo}
        />
      ))}
    </div>
  );
} 