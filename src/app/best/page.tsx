'use client';

import Header from '@/components/Header';
import StoryList from '@/components/StoryList';

export default function BestStoriesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Best Stories</h1>
        <StoryList type="best" />
      </div>
    </main>
  );
} 