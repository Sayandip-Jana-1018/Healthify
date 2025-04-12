'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  {
    name: 'Disease Prediction',
    path: '/',
    icon: '🏥',
    image: '/images/health.gif'
  },
  {
    name: 'Diabetes Prediction',
    path: '/diabetes',
    icon: '🩺',
    image: '/images/diabetes.jpg'
  },
  {
    name: 'Heart Disease',
    path: '/heart',
    icon: '❤️',
    image: '/images/heart.jpg'
  },
  {
    name: 'Liver Disease',
    path: '/liver',
    icon: '🫁',
    image: '/images/liver.jpg'
  },
  {
    name: 'Lung Cancer',
    path: '/lung',
    icon: '🫀',
    image: '/images/h.png'
  },
  {
    name: 'Chronic Kidney',
    path: '/kidney',
    icon: '🦠',
    image: '/images/h.png'
  },
  {
    name: 'Parkinsons Disease',
    path: '/parkinsons',
    icon: '🧠',
    image: '/images/p1.jpg'
  },
  {
    name: 'Breast Cancer',
    path: '/breast',
    icon: '🎗️',
    image: '/images/breast.webp'
  }
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { themeColor } = useTheme();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="fixed top-0 left-0 pt-64 h-screen backdrop-blur-lg border-r border-white/10"
      style={{
        background: `linear-gradient(135deg, 
          ${themeColor}20 0%, 
          ${darkenColor(themeColor, 0.8)}90 100%)`
      }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 pl-8 flex items-center justify-between">
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-2xl font-bold text-white"
              >
                Models 👇
              </motion.h1>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-xl relative overflow-hidden group',
                      'hover:bg-white/10 transition-all duration-300',
                      'text-white/60 hover:text-white'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-xl z-0"
                        style={{
                          background: `linear-gradient(135deg, ${themeColor}40, ${darkenColor(themeColor, 40)}60)`
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                    <span className="relative z-10 text-xl mr-3">{item.icon}</span>
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="relative z-10 font-medium"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !isCollapsed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-2 w-2 h-2 rounded-full"
                        style={{ background: themeColor }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </motion.aside>
  );
}
