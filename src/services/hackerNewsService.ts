import axios from 'axios';
import { Story, Comment, User } from '@/types';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export const fetchTopStories = async (limit: number = 30): Promise<number[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/topstories.json`);
    return response.data.slice(0, limit);
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return [];
  }
};

export const fetchNewStories = async (limit: number = 30): Promise<number[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/newstories.json`);
    return response.data.slice(0, limit);
  } catch (error) {
    console.error('Error fetching new stories:', error);
    return [];
  }
};

export const fetchBestStories = async (limit: number = 30): Promise<number[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/beststories.json`);
    return response.data.slice(0, limit);
  } catch (error) {
    console.error('Error fetching best stories:', error);
    return [];
  }
};

export const fetchStory = async (id: number): Promise<Story | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/item/${id}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    return null;
  }
};

export const fetchComment = async (id: number): Promise<Comment | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/item/${id}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comment ${id}:`, error);
    return null;
  }
};

export const fetchUser = async (id: string): Promise<User | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${id}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
};

export const fetchMultipleStories = async (ids: number[]): Promise<Story[]> => {
  try {
    const storyPromises = ids.map(id => fetchStory(id));
    const stories = await Promise.all(storyPromises);
    return stories.filter(story => story !== null) as Story[];
  } catch (error) {
    console.error('Error fetching multiple stories:', error);
    return [];
  }
};

export const fetchMultipleComments = async (ids: number[]): Promise<Comment[]> => {
  try {
    const commentPromises = ids.map(id => fetchComment(id));
    const comments = await Promise.all(commentPromises);
    return comments.filter(comment => comment !== null) as Comment[];
  } catch (error) {
    console.error('Error fetching multiple comments:', error);
    return [];
  }
}; 