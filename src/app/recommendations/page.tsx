'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StoryCard from '@/components/StoryCard';
import { Story } from '@/types';
import Link from 'next/link';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // Get user history from localStorage or use an empty array
        const userHistory = JSON.parse(localStorage.getItem('readStories') || '[]');
        
        // If no history, we can't make recommendations
        if (userHistory.length === 0) {
          setError('You need to read some stories first before we can make recommendations.');
          setLoading(false);
          return;
        }
        
        // Call the recommendations API
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userHistory }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        
        const data = await response.json();
        setRecommendations(data.recommendations);
        setError(null);
      } catch (err) {
        setError('Error loading recommendations. Please try again later.');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Recommended For You</h1>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse flex flex-col w-full max-w-3xl">
              {[...Array(3)].map((_, i) => (
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
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Visit some stories to build your reading history, and we&apos;ll recommend similar content.
            </p>
            <Link 
              href="/"
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Browse Top Stories
            </Link>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-300">
              No recommendations available at this time. Try reading more stories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
            {recommendations.map(story => (
              <StoryCard 
                key={story.id} 
                story={story} 
                showRecommendationInfo={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 