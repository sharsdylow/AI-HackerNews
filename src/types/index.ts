export interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  time: number;
  by: string;
  descendants?: number;
  kids?: number[];
  type: string;
  summary?: string;
  keywords?: string[];
  recommendationScore?: number;
  recommendationReason?: string;
}

export interface Comment {
  id: number;
  text: string;
  by: string;
  time: number;
  kids?: number[];
  parent: number;
}

export interface User {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

export interface AISummary {
  summary: string;
  keywords: string[];
}

export interface AIRecommendation {
  storyId: number;
  score: number;
  reason: string;
} 