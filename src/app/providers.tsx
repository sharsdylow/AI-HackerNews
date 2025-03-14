'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Force light theme on initial load and set up theme change observer
  useEffect(() => {
    // Force initial light theme
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    
    // Add a class to indicate JS is loaded, which can be used for transitions
    // Apply this immediately to ensure consistent transitions
    document.documentElement.classList.add('js-loaded');
    
    // Use MutationObserver to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Apply hardware acceleration for smoother transitions
          document.documentElement.style.transform = 'translateZ(0)';
          document.body.style.transform = 'translateZ(0)';
          
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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
} 