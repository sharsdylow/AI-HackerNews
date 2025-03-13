# HackerNews AI

A technology news web application featuring AI-powered personalized news feeds and content summarization.

## Features

- **News Aggregation**: Fetches the latest technology news from Hacker News API
- **AI-Powered Summaries**: Uses OpenAI to generate concise summaries of news articles
- **Personalized Recommendations**: Provides AI-generated recommendations based on reading history
- **Dark Mode**: Supports both light and dark themes
- **Infinite Scrolling**: Loads more content as you scroll for a seamless experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling
- **OpenAI API**: For AI-powered features
- **Hacker News API**: For news data

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hackernews-ai.git
   cd hackernews-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- Browse top, new, or best stories from the navigation menu
- Click on a story to view details and comments
- Generate AI summaries for articles
- Visit the "For You" page to see personalized recommendations based on your reading history

## License

This project is licensed under the MIT License - see the LICENSE file for details.
