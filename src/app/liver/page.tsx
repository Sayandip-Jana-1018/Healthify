'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaStethoscope, FaPercent, FaInfoCircle, FaHeartbeat, FaShieldAlt, FaSearch, FaDatabase, FaQuestionCircle } from 'react-icons/fa';
import { getRandomLiverData } from '@/utils/sampleData';
import TabView from '@/components/TabView';
import NotebookViewer from '@/components/NoteViewer';

// Create a wrapper component for icons
const Icon = ({ icon: IconComponent, className }: { icon: IconType; className?: string }) => {
  return <IconComponent className={className} />;
};

// Global styles component
const GlobalStyles = () => (
  <style jsx global>{`
    .form-group input, .form-group select {
      background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      transition: all 0.3s ease;
    }
    
    .form-group input:focus, .form-group select:focus {
      border-color: rgba(255,255,255,0.2);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.47);
      transform: translateY(-2px);
    }
    
    .form-group label {
      color: rgba(255,255,255,0.9);
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    
    .form-group input::placeholder {
      color: rgba(255,255,255,0.5);
    }
  `}</style>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

interface FormData {
  age: string;
  gender: string;
  total_bilirubin: string;
  direct_bilirubin: string;
  alkaline_phosphotase: string;
  alamine_aminotransferase: string;
  aspartate_aminotransferase: string;
  total_proteins: string;
  albumin: string;
  albumin_globulin_ratio: string;
}

interface PredictionResult {
  prediction: number;
  probability: number;
  risk_level: string;
}

// Field descriptions for liver disease inputs
const fieldDescriptions = {
  age: "Patient's age in years",
  gender: "Gender (1 = male, 0 = female)",
  total_bilirubin: "Total bilirubin in mg/dL (normal range: 0.1-1.2 mg/dL)",
  direct_bilirubin: "Direct bilirubin in mg/dL (normal range: 0-0.3 mg/dL)",
  alkaline_phosphotase: "Alkaline phosphatase enzyme level in IU/L (normal range: 44-147 IU/L)",
  alamine_aminotransferase: "Alanine aminotransferase (ALT) enzyme level in IU/L (normal range: 7-55 IU/L)",
  aspartate_aminotransferase: "Aspartate aminotransferase (AST) enzyme level in IU/L (normal range: 8-48 IU/L)",
  total_proteins: "Total proteins in g/dL (normal range: 6.0-8.3 g/dL)",
  albumin: "Albumin level in g/dL (normal range: 3.5-5.0 g/dL)",
  albumin_globulin_ratio: "Ratio of albumin to globulin (normal range: 1.0-2.5)"
};

export default function LiverDiseasePage() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: '1',
    total_bilirubin: '',
    direct_bilirubin: '',
    alkaline_phosphotase: '',
    alamine_aminotransferase: '',
    aspartate_aminotransferase: '',
    total_proteins: '',
    albumin: '',
    albumin_globulin_ratio: ''
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { themeColor } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSampleData = () => {
    setFormData(getRandomLiverData());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Submitting form data:', formData);
      const numericFormData = {
        age: parseInt(formData.age),
        gender: formData.gender === '1' ? 1 : 0,
        total_bilirubin: parseFloat(formData.total_bilirubin),
        direct_bilirubin: parseFloat(formData.direct_bilirubin),
        alkaline_phosphotase: parseFloat(formData.alkaline_phosphotase),
        alamine_aminotransferase: parseFloat(formData.alamine_aminotransferase),
        aspartate_aminotransferase: parseFloat(formData.aspartate_aminotransferase),
        total_proteins: parseFloat(formData.total_proteins),
        albumin: parseFloat(formData.albumin),
        albumin_globulin_ratio: parseFloat(formData.albumin_globulin_ratio)
      };

      const response = await fetch('http://localhost:8001/predict/liver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numericFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result = await response.json();
      console.log('Prediction result:', result);
      setPrediction(result);
    } catch (err) {
      console.error('Error during prediction:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Define interactive visualizations with Plotly data
  const liverVisualizations = [
    {
      title: 'Total Bilirubin Distribution by Liver Disease',
      type: 'histogram' as const,
      data: [
        {
          x: Array.from({ length: 100 }, (_, i) => 0.4 + Math.random() * 1.2),
          type: 'histogram',
          marker: {
            color: 'rgba(100, 149, 237, 0.7)',
            line: {
              color: 'rgba(100, 149, 237, 1)',
              width: 1
            }
          },
          opacity: 0.75,
          name: 'No Liver Disease'
        },
        {
          x: Array.from({ length: 100 }, (_, i) => 0.8 + Math.random() * 2.5),
          type: 'histogram',
          marker: {
            color: 'rgba(255, 99, 132, 0.7)',
            line: {
              color: 'rgba(255, 99, 132, 1)',
              width: 1
            }
          },
          opacity: 0.75,
          name: 'Liver Disease'
        }
      ],
      layout: {
        title: 'Total Bilirubin Distribution',
        xaxis: { title: 'Total Bilirubin (mg/dL)' },
        yaxis: { title: 'Count' },
        barmode: 'overlay',
        legend: { x: 0.1, y: 1 }
      },
      description: 'Distribution of total bilirubin levels in patients with and without liver disease, showing elevated levels in patients with liver disease.'
    },
    {
      title: 'Albumin vs. Total Proteins',
      type: 'scatter' as const,
      data: [
        {
          x: Array.from({ length: 50 }, (_, i) => 2.5 + Math.random() * 1.5),
          y: Array.from({ length: 50 }, (_, i) => 5.5 + Math.random() * 2),
          mode: 'markers',
          type: 'scatter',
          name: 'No Liver Disease',
          marker: {
            color: 'rgba(100, 149, 237, 0.7)',
            size: 10
          }
        },
        {
          x: Array.from({ length: 50 }, (_, i) => 1.5 + Math.random() * 2),
          y: Array.from({ length: 50 }, (_, i) => 4 + Math.random() * 2.5),
          mode: 'markers',
          type: 'scatter',
          name: 'Liver Disease',
          marker: {
            color: 'rgba(255, 99, 132, 0.7)',
            size: 10
          }
        }
      ],
      layout: {
        title: 'Albumin vs. Total Proteins',
        xaxis: { title: 'Albumin (g/dL)' },
        yaxis: { title: 'Total Proteins (g/dL)' },
        legend: { x: 0.1, y: 1 }
      },
      description: 'Scatter plot showing the relationship between albumin and total protein levels, colored by liver disease status. Patients with liver disease often show lower albumin levels.'
    },
    {
      title: 'Feature Importance for Liver Disease Prediction',
      type: 'bar' as const,
      data: [
        {
          y: ['Total Bilirubin', 'Direct Bilirubin', 'Alkaline Phosphatase', 'SGPT', 'SGOT', 'Total Proteins', 'Albumin', 'A/G Ratio'],
          x: [0.22, 0.18, 0.16, 0.14, 0.12, 0.08, 0.06, 0.04],
          type: 'bar',
          orientation: 'h',
          marker: {
            color: 'rgba(55, 128, 191, 0.7)',
            line: {
              color: 'rgba(55, 128, 191, 1.0)',
              width: 1
            }
          }
        }
      ],
      layout: {
        title: 'Feature Importance',
        xaxis: { title: 'Importance Score' },
        yaxis: { title: 'Feature' },
        margin: { l: 150, r: 40, t: 50, b: 50 }
      },
      description: 'Relative importance of different features in predicting liver disease, with bilirubin levels and enzyme tests being the most significant predictors.'
    },
    {
      title: 'Liver Enzyme Levels Comparison',
      type: 'box' as const,
      data: [
        {
          y: Array.from({ length: 100 }, (_, i) => 20 + Math.random() * 40),
          type: 'box',
          name: 'SGOT (No Disease)',
          marker: { color: 'rgba(100, 149, 237, 0.7)' }
        },
        {
          y: Array.from({ length: 100 }, (_, i) => 40 + Math.random() * 80),
          type: 'box',
          name: 'SGOT (Disease)',
          marker: { color: 'rgba(255, 99, 132, 0.7)' }
        },
        {
          y: Array.from({ length: 100 }, (_, i) => 15 + Math.random() * 35),
          type: 'box',
          name: 'SGPT (No Disease)',
          marker: { color: 'rgba(100, 200, 150, 0.7)' }
        },
        {
          y: Array.from({ length: 100 }, (_, i) => 35 + Math.random() * 90),
          type: 'box',
          name: 'SGPT (Disease)',
          marker: { color: 'rgba(255, 150, 100, 0.7)' }
        }
      ],
      layout: {
        title: 'Liver Enzyme Levels',
        yaxis: { title: 'Enzyme Level (IU/L)' },
        boxmode: 'group'
      },
      description: 'Box plots comparing liver enzyme levels (SGOT and SGPT) between patients with and without liver disease, showing elevated levels in disease cases.'
    }
  ];

  // Content for the model tab
  const ModelContent = (
    <div className="min-h-screen">
      <GlobalStyles />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Liver Disease Prediction</h1>
          <p className="text-gray-300">Enter your health metrics below for a liver disease risk assessment.</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative w-full aspect-[21/9] mb-8 rounded-2xl overflow-hidden"
        >
          <Image
            src="/images/liver.jpg"
            alt="Liver Disease Prediction"
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="flex mb-6 justify-center">
          <button
            onClick={handleSampleData}
            style={{
              background: `linear-gradient(135deg, ${themeColor}80, ${darkenColor(themeColor, 40)}80)`,
              boxShadow: `0 4px 20px ${themeColor}30`
            }}
            className="px-6 py-3 rounded-xl text-white/90 hover:text-white transition-all duration-200 flex items-center gap-2"
          >
            <FaDatabase className="text-lg" />
            Use Sample Data
          </button>
        </div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="form-group mb-4">
            <label className="block text-sm font-medium mb-2">Age</label>
            <div className="relative">
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-white"
                placeholder="Enter age"
              />
              <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.age}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group mb-4">
            <label className="block text-sm font-medium mb-2">Gender</label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-white appearance-none"
              >
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
              <div className="absolute right-8 top-2 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.gender}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group mb-4">
            <label className="block text-sm font-medium mb-2">Total Bilirubin</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                name="total_bilirubin"
                value={formData.total_bilirubin}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-white"
                placeholder="Enter total bilirubin"
              />
              <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.total_bilirubin}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group mb-4">
            <label className="block text-sm font-medium mb-2">Direct Bilirubin</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                name="direct_bilirubin"
                value={formData.direct_bilirubin}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-white"
                placeholder="Enter direct bilirubin"
              />
              <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.direct_bilirubin}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group mb-4">
            <label className="block text-sm font-medium mb-2">Alkaline Phosphotase</label>
            <div className="relative">
              <input
                type="number"
                name="alkaline_phosphotase"
                value={formData.alkaline_phosphotase}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-white"
                placeholder="Enter alkaline phosphotase"
              />
              <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.alkaline_phosphotase}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group mb-4">
            <label className="block text-sm font-medium mb-2">Alamine Aminotransferase</label>
            <div className="relative">
              <input
                type="number"
                name="alamine_aminotransferase"
                value={formData.alamine_aminotransferase}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-white"
                placeholder="Enter alamine aminotransferase"
              />
              <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.alamine_aminotransferase}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group mb-4">
            <label className="block text-sm font-medium mb-2">Aspartate Aminotransferase</label>
            <div className="relative">
              <input
                type="number"
                name="aspartate_aminotransferase"
                value={formData.aspartate_aminotransferase}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-white"
                placeholder="Enter aspartate aminotransferase"
              />
              <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.aspartate_aminotransferase}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group mb-4">
            <label className="block text-sm font-medium mb-2">Total Proteins</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                name="total_proteins"
                value={formData.total_proteins}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-white"
                placeholder="Enter total proteins"
              />
              <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.total_proteins}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group mb-4">
            <label className="block text-sm font-medium mb-2">Albumin</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                name="albumin"
                value={formData.albumin}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-white"
                placeholder="Enter albumin"
              />
              <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.albumin}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group mb-4">
            <label className="block text-sm font-medium mb-2">Albumin Globulin Ratio</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                name="albumin_globulin_ratio"
                value={formData.albumin_globulin_ratio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-white"
                placeholder="Enter albumin globulin ratio"
              />
              <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.albumin_globulin_ratio}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: `linear-gradient(135deg, ${themeColor}, ${darkenColor(themeColor, 40)})`,
              boxShadow: `0 4px 20px ${themeColor}30`
            }}
            className="px-8 py-4 rounded-xl text-white font-medium hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaStethoscope className="text-lg" />
                Predict
              </>
            )}
          </button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center"
            >
              {error}
            </motion.div>
          )}

          {prediction && (
            <motion.div
              variants={itemVariants}
              className="mt-6 p-6 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${themeColor}20, ${darkenColor(themeColor, 40)}20)`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-center">Prediction Result</h3>
              
              {/* Circular Progress Indicator */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  {/* Progress circle */}
                  <circle
                    className="text-primary transition-all duration-1000"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke={prediction.probability >= 0.5 ? "#ef4444" : "#22c55e"}
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 * (1 - prediction.probability)}`,
                      transform: "rotate(-90deg)",
                      transformOrigin: "50% 50%",
                    }}
                  />
                  {/* Percentage text */}
                  <text
                    x="50"
                    y="50"
                    className="text-2xl font-bold"
                    textAnchor="middle"
                    dy=".3em"
                    fill="currentColor"
                  >
                    {Math.round(prediction.probability * 100)}%
                  </text>
                </svg>
              </div>

              <div className="text-center">
                <p className="text-xl mb-2">
                  Risk Level:{" "}
                  <span
                    className={`font-bold ${
                      prediction.probability >= 0.5 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {prediction.risk_level}
                  </span>
                </p>
                <p className="text-lg mb-4">
                  {prediction.probability >= 0.5
                    ? "High risk of liver disease detected. Please consult a healthcare provider."
                    : "Low risk of liver disease detected. Maintain a healthy lifestyle."}
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>⚕️ This is not a medical diagnosis</p>
                  <p>🏥 Consult healthcare professionals for proper evaluation</p>
                  <p>📊 Results are based on provided data only</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  // Content for the notebook tab
  const NotebookContent = (
    <div className="min-h-screen mx-auto max-w-7xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Liver Disease Analysis</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Data visualizations and model development for liver disease prediction
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10 h-[calc(100vh-120px)] min-h-[1230px] overflow-hidden">
          <NotebookViewer 
            notebookPath="/api/notebooks/liver_disease_analysis.ipynb" 
            visualizations={liverVisualizations}
          />
        </motion.div>
      </motion.div>
    </div>
  );

  // Define tabs for the TabView component
  const tabs = [
    {
      id: 'model',
      label: 'Prediction Model',
      content: ModelContent
    },
    {
      id: 'notebook',
      label: 'Analysis Notebook',
      content: NotebookContent
    }
  ];

  return (
    <div className="min-h-screen">
      <TabView tabs={tabs} />
    </div>
  );
}
