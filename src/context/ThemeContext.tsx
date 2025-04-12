'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function darkenColor(color: string, amount: number): string {
  if (color.startsWith('#')) {
    const r = Math.max(0, parseInt(color.slice(1, 3), 16) - amount);
    const g = Math.max(0, parseInt(color.slice(3, 5), 16) - amount);
    const b = Math.max(0, parseInt(color.slice(5, 7), 16) - amount);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return color;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [themeColor, setThemeColor] = useState('#4F46E5'); // Default indigo color

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
    themeColor,
    setThemeColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div 
        className="fixed inset-0 w-full min-h-screen"
        style={{
          background: `
            linear-gradient(135deg,
              ${darkenColor(themeColor, 60)} 0%,
              ${darkenColor(themeColor, 80)} 10%,
              ${darkenColor(themeColor, 100)} 20%,
              rgba(0, 0, 0, 1) 40%,
              rgba(0, 0, 0, 1) 60%,
              ${darkenColor(themeColor, 100)} 80%,
              ${darkenColor(themeColor, 80)} 90%,
              ${darkenColor(themeColor, 60)} 100%
            )
          `,
          zIndex: -1,
        }}
      />
      <div className="relative min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
