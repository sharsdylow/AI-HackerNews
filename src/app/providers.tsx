'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Set up theme and handle transitions
  useEffect(() => {
    // Add a class to indicate JS is loaded, which enables transitions
    document.documentElement.classList.add('js-loaded');
    
    try {
      // Check localStorage first for saved theme preference
      const savedTheme = localStorage.getItem('theme');
      
      // If no saved theme, set dark as default
      if (!savedTheme) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      } else {
        // Apply saved theme
        document.documentElement.classList.add(savedTheme);
        document.documentElement.classList.remove(savedTheme === 'dark' ? 'light' : 'dark');
      }
    // eslint-disable-next-line no-empty
    } catch {
      // If localStorage is not available (e.g., in an iframe or incognito mode)
      // Default to dark theme
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    
    // Use MutationObserver to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          try {
            // Detect current theme
            const isDark = document.documentElement.classList.contains('dark');
            
            // Save theme preference to localStorage
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
          // eslint-disable-next-line no-empty
          } catch {
            // Ignore localStorage errors
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
} 