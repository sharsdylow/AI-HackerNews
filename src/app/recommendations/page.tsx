'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StoryGrid from '@/components/StoryGrid';
import { Story } from '@/types';

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
        <h1 className="text-3xl font-bold mb-6">Recommended For You</h1>
        
        <div className="max-w-5xl mx-auto">
          <StoryGrid 
            stories={recommendations}
            loading={loading}
            error={error}
            showRecommendationInfo={true}
            emptyMessage="No recommendations available at this time. Try reading more stories."
            errorAction={
              error && error.includes('read some stories') 
                ? { label: 'Browse Top Stories', href: '/' } 
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
} 