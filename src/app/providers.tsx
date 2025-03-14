'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Set up theme and handle transitions
  useEffect(() => {
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
    
    // Add a class to indicate JS is loaded, which can be used for transitions
    document.documentElement.classList.add('js-loaded');
    
    // Use MutationObserver to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Detect current theme
          const isDark = document.documentElement.classList.contains('dark');
          
          // Save theme preference to localStorage
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
          
          // Apply hardware acceleration for smoother transitions
          document.documentElement.style.transform = 'translateZ(0)';
          document.body.style.transform = 'translateZ(0)';
          
          // Force all text elements to update their colors
          const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button');
          textElements.forEach(el => {
            // This forces a style recalculation
            (el as HTMLElement).style.color = '';
            void (el as HTMLElement).offsetHeight;
          });
          
          // Force a repaint to ensure all elements transition together
          document.body.style.display = 'none';
          // This will force a repaint
          void document.body.offsetHeight;
          document.body.style.display = '';
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