'use client';

import Link from 'next/link';
import { Story } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, ClockIcon, ArrowTopRightOnSquareIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';

interface StoryCardProps {
  story: Story;
  showRecommendationInfo?: boolean;
}

export default function StoryCard({ story, showRecommendationInfo = false }: StoryCardProps) {
  const [mounted, setMounted] = useState(false);
  const hostname = story.url ? new URL(story.url).hostname.replace(/^www\./, '') : '';
  const timeAgo = formatDistanceToNow(new Date(story.time * 1000), { addSuffix: true });
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group">
              <Link 
                href={story.url || `/story/${story.id}`} 
                target={story.url ? "_blank" : "_self"} 
                className="hover:text-orange-500 transition-colors flex items-start"
              >
                {story.title}
                {story.url && (
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1 mt-1 text-gray-400 group-hover:text-orange-500" />
                )}
              </Link>
            </h2>
            
            {hostname && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">
                  {hostname}
                </span>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <div className="flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 min-w-[60px]">
              <span className="text-orange-500 font-bold text-lg">{story.score}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{story.score === 1 ? 'point' : 'points'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 dark:text-gray-200">by {story.by}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span className="text-gray-700 dark:text-gray-400">{timeAgo}</span>
          </div>
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
            <span className="text-gray-700 dark:text-gray-400">{story.descendants || 0} comments</span>
          </div>
        </div>
        
        {story.summary && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              AI Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{story.summary}</p>
            
            {story.keywords && story.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {story.keywords.map((keyword, index) => (
                  <span key={index} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-600 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        
        {showRecommendationInfo && story.recommendationReason && (
          <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-sm">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center">
              <FireIcon className="h-4 w-4 mr-1 text-orange-500" />
              Why we recommend this
            </h3>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{story.recommendationReason}</p>
            {/* <div className="mt-2 flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-orange-500 h-2.5 rounded-full" 
                  style={{ width: `${story.recommendationScore}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                {story.recommendationScore}%
              </span>
            </div> */}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Link 
            href={`/story/${story.id}`}
            className="inline-flex items-center text-sm font-medium text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
          >
            View details
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 