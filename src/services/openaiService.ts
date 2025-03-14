import OpenAI from 'openai';
import { AISummary, AIRecommendation, Story } from '@/types';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateSummary = async (title: string, url: string): Promise<AISummary | null> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes tech news articles and extracts keywords."
        },
        {
          role: "user",
          content: `Summarize this tech news article in 2-3 sentences and extract 3-5 keywords. Title: "${title}", URL: ${url}`
        }
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return null;
    }

    // Parse the response to extract summary and keywords
    const summaryMatch = content.match(/(.+?)(?=Keywords:|$)/);
    const keywordsMatch = content.match(/Keywords:(.+)/);

    const summary = summaryMatch ? summaryMatch[0].trim() : content;
    const keywordsText = keywordsMatch ? keywordsMatch[1].trim() : '';
    const keywords = keywordsText
      .split(/,|\n/)
      .map(k => k.trim())
      .filter(k => k.length > 0);

    return {
      summary,
      keywords
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    return null;
  }
};

export const generateRecommendations = async (
  userHistory: Story[],
  availableStories: Story[]
): Promise<AIRecommendation[]> => {
  try {
    // Prepare user history data
    const historyData = userHistory.map(story => ({
      id: story.id,
      title: story.title,
      score: story.score,
    }));

    // Prepare available stories data
    const storiesData = availableStories.map(story => ({
      id: story.id,
      title: story.title,
      score: story.score,
    }));
    
    // console.log(historyData, storiesData);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a recommendation system for tech news articles. Based on a user's reading history, recommend the most relevant new articles."
        },
        {
          role: "user",
          content: `Based on the user's reading history, recommend 5 articles from the available stories. Format your response as a JSON array with objects containing storyId (number), score (number between 0-100), and reason (string).
          
          User History: ${JSON.stringify(historyData)}
          
          Available Stories: ${JSON.stringify(storiesData)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return [];
    }

    try {
      const parsedContent = JSON.parse(content);
      return parsedContent.recommendations || [];
    } catch (e) {
      console.error('Error parsing recommendations JSON:', e);
      return [];
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}; 