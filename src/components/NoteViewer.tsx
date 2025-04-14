'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaChartBar, FaChartLine, FaChartPie, FaChartArea } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// Define visualization types
interface Visualization {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'box' | 'area' | 'heatmap' | 'histogram';
  data: any; // Plotly data
  layout: any; // Plotly layout
  description: string;
}

// Define notebook cell types
interface NotebookCell {
  cell_type: 'code' | 'markdown' | 'raw';
  source: string[];
  outputs?: any[];
  execution_count?: number | null;
  metadata?: any;
}

interface NotebookData {
  cells: NotebookCell[];
  metadata: any;
  nbformat: number;
  nbformat_minor: number;
}

interface NotebookViewerProps {
  notebookPath: string;
  visualizations: Visualization[];
}

const NotebookViewer: React.FC<NotebookViewerProps> = ({ notebookPath, visualizations }) => {
  const [notebookData, setNotebookData] = useState<NotebookData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'notebook' | 'visualizations'>('notebook');

  useEffect(() => {
    const fetchNotebookContent = async () => {
      try {
        setLoading(true);
        
        // Determine if the path is an API route or a direct file path
        const isApiPath = notebookPath.startsWith('/api/');
        const fetchPath = isApiPath ? notebookPath : `/api/notebooks/${notebookPath.split('/').pop()}`;
        
        // Fetch the notebook file
        const response = await fetch(fetchPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch notebook: ${response.statusText}`);
        }
        
        const data = await response.json();
        setNotebookData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notebook content:', error);
        // Create a simple fallback notebook structure
        setNotebookData({
          cells: [
            {
              cell_type: 'markdown',
              source: ['# Notebook Content', 'This is a fallback notebook content because the actual notebook could not be loaded.']
            },
            {
              cell_type: 'code',
              source: ['import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# Sample code\nprint("Hello, world!")'],
              execution_count: 1,
              outputs: [
                {
                  output_type: 'stream',
                  name: 'stdout',
                  text: ['Hello, world!']
                }
              ]
            }
          ],
          metadata: {},
          nbformat: 4,
          nbformat_minor: 5
        });
        setLoading(false);
      }
    };

    fetchNotebookContent();
  }, [notebookPath]);

  // Get the appropriate icon based on chart type
  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar':
        return <FaChartBar className="text-blue-400" />;
      case 'line':
        return <FaChartLine className="text-green-400" />;
      case 'pie':
        return <FaChartPie className="text-purple-400" />;
      case 'area':
        return <FaChartArea className="text-yellow-400" />;
      case 'scatter':
        return <FaChartBar className="text-orange-400" />;
      case 'heatmap':
        return <FaChartArea className="text-red-400" />;
      case 'histogram':
        return <FaChartBar className="text-indigo-400" />;
      default:
        return <FaChartBar className="text-blue-400" />;
    }
  };

  // Render a markdown cell
  const renderMarkdownCell = (cell: NotebookCell, index: number) => {
    const content = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
    return (
      <div key={`md-${index}`} className="py-3 px-4 border-b border-white/10 markdown-content w-full">
        <div 
          dangerouslySetInnerHTML={{ __html: `<p>${content.replace(/\n/g, '<br/>')}</p>` }} 
          className="text-white/90 w-full max-w-full overflow-x-auto"
        />
      </div>
    );
  };

  // Render a code cell
  const renderCodeCell = (cell: NotebookCell, index: number) => {
    const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
    const lines = source.split('\n');
    
    return (
      <div key={`code-${index}`} className="border-b border-white/10 w-full">
        {/* Code input */}
        <div className="bg-[#1e1e2e] py-2 px-4 w-full">
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">[{cell.execution_count || ' '}]:</span>
            <span className="text-blue-400">In</span>
          </div>
          <pre className="text-white/90 text-sm mt-1 overflow-x-auto w-full">
            <code className="w-full">
              {lines.map((line, i) => (
                <div key={i} className="py-1 w-full">
                  {line}
                </div>
              ))}
            </code>
          </pre>
        </div>
        
        {/* Code output */}
        {cell.outputs && cell.outputs.length > 0 && (
          <div className="bg-[#282a36] py-2 px-4 w-full">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">[{cell.execution_count || ' '}]:</span>
              <span className="text-red-400">Out</span>
            </div>
            <div className="mt-1 w-full">
              {cell.outputs.map((output: any, i: number) => {
                if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
                  // Handle data output
                  if (output.data && output.data['text/html']) {
                    return (
                      <div 
                        key={`out-${i}`} 
                        dangerouslySetInnerHTML={{ 
                          __html: Array.isArray(output.data['text/html']) 
                            ? output.data['text/html'].join('') 
                            : output.data['text/html'] 
                        }}
                        className="w-full overflow-x-auto" 
                      />
                    );
                  } else if (output.data && output.data['text/plain']) {
                    const text = Array.isArray(output.data['text/plain']) 
                      ? output.data['text/plain'].join('') 
                      : output.data['text/plain'];
                    return <pre key={`out-${i}`} className="text-white/80 text-sm w-full overflow-x-auto">{text}</pre>;
                  } else if (output.data && output.data['image/png']) {
                    // Handle image output
                    return (
                      <div key={`out-${i}`} className="my-2 w-full flex justify-center">
                        <img 
                          src={`data:image/png;base64,${output.data['image/png']}`} 
                          alt="Plot output" 
                          className="max-w-full h-auto"
                        />
                      </div>
                    );
                  }
                } else if (output.output_type === 'stream') {
                  // Handle stream output (print statements)
                  const text = Array.isArray(output.text) ? output.text.join('') : output.text;
                  return <pre key={`out-${i}`} className="text-white/80 text-sm w-full overflow-x-auto">{text}</pre>;
                } else if (output.output_type === 'error') {
                  // Handle error output
                  return (
                    <div key={`out-${i}`} className="text-red-500 text-sm w-full overflow-x-auto">
                      <span className="font-bold">{output.ename}: </span>
                      <span>{output.evalue}</span>
                      {output.traceback && (
                        <pre className="mt-1 overflow-x-auto w-full">
                          {output.traceback.join('\n')}
                        </pre>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-[900px]">
      {/* Tab Navigation */}
      <div className="flex mb-4 bg-black/20 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('notebook')}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            activeTab === 'notebook' 
              ? 'bg-white/10 text-white' 
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Notebook
        </button>
        <button
          onClick={() => setActiveTab('visualizations')}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            activeTab === 'visualizations' 
              ? 'bg-white/10 text-white' 
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Interactive Visualizations
        </button>
      </div>

      {activeTab === 'visualizations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 p-4 min-h-[800px]">
          {visualizations.map((viz, index) => (
            <div key={index} className="glass p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
              <div className="flex items-center gap-2 mb-3">
                {getChartIcon(viz.type)}
                <h4 className="text-white font-medium">{viz.title}</h4>
              </div>
              <div className="h-[400px] w-full mb-3 bg-black/20 rounded-lg overflow-hidden">
                <Plot
                  data={viz.data}
                  layout={{
                    ...viz.layout,
                    paper_bgcolor: 'rgba(0,0,0,0.2)',
                    plot_bgcolor: 'rgba(0,0,0,0.1)',
                    font: { color: 'rgba(255,255,255,0.8)' },
                    margin: { l: 70, r: 50, t: 50, b: 70 },
                    autosize: true,
                  }}
                  style={{ width: '100%', height: '100%' }}
                  config={{ responsive: true }}
                />
              </div>
              <p className="text-white/70 text-sm">{viz.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notebook' && (
        <div className="flex-grow glass rounded-xl bg-[#1e1e1e] border border-white/10 flex flex-col overflow-hidden h-[calc(100vh-400px)] w-full">
          {/* Terminal Header */}
          <div className="bg-[#2d2d2d] px-4 py-2 flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-white/70 text-sm font-mono flex-grow text-center">
              {notebookPath.split('/').pop()}
            </div>
          </div>
          
          {/* Terminal Content */}
          <div className="flex-grow overflow-auto custom-scrollbar font-mono w-full">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : notebookData ? (
              <div className="jupyter-notebook w-full">
                {notebookData.cells.map((cell, index) => {
                  if (cell.cell_type === 'markdown') {
                    return renderMarkdownCell(cell, index);
                  } else if (cell.cell_type === 'code') {
                    return renderCodeCell(cell, index);
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full text-white/70">
                Failed to load notebook content
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotebookViewer;
