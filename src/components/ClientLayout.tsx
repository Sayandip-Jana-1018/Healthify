'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import Sidebar from './Sidebar';
import ThemeSelector from './ThemeSelector';
import { useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main 
          className="flex-1 transition-[margin] duration-300" 
          style={{ marginLeft: isCollapsed ? '80px' : '280px' }}
        >
          <div className="container mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
        <ThemeSelector />
      </div>
    </ThemeProvider>
  );
}
