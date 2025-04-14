'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TabViewProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

const TabView: React.FC<TabViewProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center border-b border-white/10 mb-6">
        <div className="inline-flex bg-black/30 backdrop-blur-md rounded-t-xl p-1 border border-white/10 border-b-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-8 py-3 font-medium text-sm transition-all relative rounded-lg ${
                activeTab === tab.id
                  ? 'text-white bg-blue-500/20'
                  : 'text-white/60 hover:text-white/80 hover:bg-white/5'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 mx-2"
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`h-full transition-opacity duration-300 ${
              activeTab === tab.id ? 'block' : 'hidden'
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabView;
