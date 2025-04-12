'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

const colors = [
  '#5B21B6', // Deep Purple
  '#7C3AED', // Vivid Purple
  '#4F46E5', // Indigo
  '#2563EB', // Royal Blue
  '#0891B2', // Cyan
  '#059669', // Emerald
  '#16A34A', // Green
  '#CA8A04', // Yellow
  '#EA580C', // Orange
  '#DC2626', // Red
  '#DB2777', // Pink
  '#9333EA', // Purple
  '#6366F1', // Light Indigo
  '#0EA5E9', // Sky Blue
  '#14B8A6', // Teal
  '#171717', // Black
];

export default function ThemeSelector() {
  const { setThemeColor, themeColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md hover:bg-black/40 transition-all duration-200 flex items-center justify-center shadow-lg border border-white/10"
        aria-label="Open theme settings"
      >
        <Cog6ToothIcon className="w-6 h-6 text-white" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-black/30 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/10 w-80">
          <h2 className="text-white mb-3 font-semibold text-sm">Theme Colors</h2>
          <p className="text-white/60 text-xs mb-4">Choose your preferred theme color</p>
          <div className="grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setThemeColor(color);
                  setIsOpen(false);
                }}
                className={`w-12 h-12 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none ${
                  themeColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50' : ''
                }`}
                style={{ 
                  background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255, 0.9)'
                }}
                aria-label={`Set theme color to ${color}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
