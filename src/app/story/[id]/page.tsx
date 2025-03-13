'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { Story, Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function StoryDetailPage() {
  const { id } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/story/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }
        
        const data = await response.json();
        setStory(data.story);
        setComments(data.comments);
        
        // Add story to read history for recommendations
        if (data.story) {
          addToReadHistory(data.story);
        }
      } catch (err) {
        setError('Error loading story. Please try again later.');
        console.error('Error fetching story:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id]);

  // Function to add story to read history in localStorage
  const addToReadHistory = (story: Story) => {
    try {
      // Get existing history or initialize empty array
      const historyString = localStorage.getItem('readStories');
      const history = historyString ? JSON.parse(historyString) : [];
      
      // Check if story is already in history
      const storyExists = history.some((s: Story) => s.id === story.id);
      
      if (!storyExists) {
        // Add story to history and keep only the last 20 stories
        const newHistory = [story, ...history].slice(0, 20);
        localStorage.setItem('readStories', JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Error updating read history:', error);
    }
  };

  const generateSummary = async () => {
    if (!story || !story.url) return;
    
    try {
      setSummaryLoading(true);
      const response = await fetch(`/api/story/${id}?summary=true`);
      
      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }
      
      const data = await response.json();
      setStory(data.story);
    } catch (err) {
      console.error('Error generating summary:', err);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-500 mb-4">{error || 'Story not found'}</p>
          <Link 
            href="/"
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const hostname = story.url ? new URL(story.url).hostname.replace(/^www\./, '') : '';
  const timeAgo = formatDistanceToNow(new Date(story.time * 1000), { addSuffix: true });

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{story.title}</h1>
            <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
              <span className="mr-4">{story.score} points</span>
              <span className="mr-4">by {story.by}</span>
              <span>{timeAgo}</span>
            </div>
            
            {story.url && (
              <div className="mb-6">
                <a 
                  href={story.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {hostname ? `${hostname} →` : 'Visit link →'}
                </a>
              </div>
            )}
            
            {!story.summary && story.url && (
              <div className="mb-6">
                <button
                  onClick={generateSummary}
                  disabled={summaryLoading}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {summaryLoading ? 'Generating Summary...' : 'Generate AI Summary'}
                </button>
              </div>
            )}
            
            {story.summary && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-2">AI Summary</h2>
                <p className="mb-3">{story.summary}</p>
                
                {story.keywords && story.keywords.length > 0 && (
                  <div>
                    <span className="font-semibold">Keywords: </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {story.keywords.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Comments ({comments.length})
            </h2>
            
            {comments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
            ) : (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div 
                    key={comment.id} 
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span className="font-medium mr-2">{comment.by}</span>
                      <span>{formatDistanceToNow(new Date(comment.time * 1000), { addSuffix: true })}</span>
                    </div>
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: comment.text }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 