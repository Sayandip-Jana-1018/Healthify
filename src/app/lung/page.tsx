'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaStethoscope, FaHeartbeat, FaShieldAlt, FaLungs, FaDatabase } from 'react-icons/fa';
import { getRandomLungData } from '@/utils/sampleData';
import TabView from '@/components/TabView';
import NotebookViewer from '@/components/NoteViewer';

const Icon = ({ icon: IconComponent, className }: { icon: IconType; className?: string }) => {
  return <IconComponent className={className} />;
};

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

interface PredictionResult {
  prediction: boolean;
  probability: number;
  risk_level: string;
}

export default function LungCancerPage() {
  const [formData, setFormData] = useState({
    gender: 'M',
    age: '',
    smoking: '0',
    yellow_fingers: '0',
    anxiety: '0',
    peer_pressure: '0',
    chronic_disease: '0',
    fatigue: '0',
    allergy: '0',
    wheezing: '0',
    alcohol_consuming: '0',
    coughing: '0',
    shortness_of_breath: '0',
    swallowing_difficulty: '0',
    chest_pain: '0'
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleUseSampleData = () => {
    const sampleData = getRandomLungData();
    const stringifiedData = Object.fromEntries(
      Object.entries(sampleData).map(([key, value]) => [key, String(value)])
    );
    setFormData(stringifiedData as typeof formData);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8001/predict/lung', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      gender: 'M',
      age: '',
      smoking: '0',
      yellow_fingers: '0',
      anxiety: '0',
      peer_pressure: '0',
      chronic_disease: '0',
      fatigue: '0',
      allergy: '0',
      wheezing: '0',
      alcohol_consuming: '0',
      coughing: '0',
      shortness_of_breath: '0',
      swallowing_difficulty: '0',
      chest_pain: '0'
    });
    setPrediction(null);
    setError(null);
  };

  // Define interactive visualizations with Plotly data
  const lungVisualizations = [
    {
      title: 'Age Distribution by Lung Cancer Status',
      type: 'histogram' as const,
      data: [
        {
          x: Array.from({ length: 100 }, (_, i) => 40 + Math.random() * 30),
          type: 'histogram',
          marker: {
            color: 'rgba(100, 149, 237, 0.7)',
            line: {
              color: 'rgba(100, 149, 237, 1)',
              width: 1
            }
          },
          opacity: 0.75,
          name: 'No Lung Cancer'
        },
        {
          x: Array.from({ length: 100 }, (_, i) => 50 + Math.random() * 30),
          type: 'histogram',
          marker: {
            color: 'rgba(255, 99, 132, 0.7)',
            line: {
              color: 'rgba(255, 99, 132, 1)',
              width: 1
            }
          },
          opacity: 0.75,
          name: 'Lung Cancer'
        }
      ],
      layout: {
        title: 'Age Distribution by Lung Cancer Status',
        xaxis: { title: 'Age' },
        yaxis: { title: 'Count' },
        barmode: 'overlay',
        legend: { x: 0.1, y: 1 }
      },
      description: 'Distribution of ages in patients with and without lung cancer, showing higher prevalence in older age groups.'
    },
    {
      title: 'Smoking vs. Lung Cancer Risk',
      type: 'bar' as const,
      data: [
        {
          x: ['Non-smoker', 'Light Smoker', 'Moderate Smoker', 'Heavy Smoker'],
          y: [5, 15, 35, 65],
          type: 'bar',
          marker: {
            color: ['rgba(100, 149, 237, 0.7)', 'rgba(150, 180, 200, 0.7)', 
                   'rgba(255, 180, 100, 0.7)', 'rgba(255, 99, 132, 0.7)']
          }
        }
      ],
      layout: {
        title: 'Lung Cancer Risk by Smoking Status',
        xaxis: { title: 'Smoking Status' },
        yaxis: { title: 'Lung Cancer Risk (%)' }
      },
      description: 'Bar chart showing the relationship between smoking status and lung cancer risk, with heavy smokers having the highest risk.'
    },
    {
      title: 'Feature Importance for Lung Cancer Prediction',
      type: 'bar' as const,
      data: [
        {
          y: ['Smoking', 'Age', 'Chronic Disease', 'Genetic Risk', 'Passive Smoker', 'Chest Pain', 'Coughing Blood', 'Fatigue'],
          x: [0.28, 0.20, 0.15, 0.12, 0.10, 0.08, 0.05, 0.02],
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
      description: 'Relative importance of different features in predicting lung cancer, with smoking and age being the most significant predictors.'
    },
    {
      title: 'Symptom Correlation Matrix',
      type: 'heatmap' as const,
      data: [
        {
          z: [
            [1.0, 0.7, 0.6, 0.5, 0.4, 0.3],
            [0.7, 1.0, 0.5, 0.4, 0.3, 0.2],
            [0.6, 0.5, 1.0, 0.6, 0.5, 0.4],
            [0.5, 0.4, 0.6, 1.0, 0.6, 0.5],
            [0.4, 0.3, 0.5, 0.6, 1.0, 0.7],
            [0.3, 0.2, 0.4, 0.5, 0.7, 1.0]
          ],
          x: ['Cough', 'Shortness of Breath', 'Chest Pain', 'Fatigue', 'Weight Loss', 'Coughing Blood'],
          y: ['Cough', 'Shortness of Breath', 'Chest Pain', 'Fatigue', 'Weight Loss', 'Coughing Blood'],
          type: 'heatmap',
          colorscale: 'Viridis'
        }
      ],
      layout: {
        title: 'Symptom Correlation Matrix',
        annotations: []
      },
      description: 'Correlation matrix showing relationships between different lung cancer symptoms, helping identify symptom clusters.'
    }
  ];

  // Content for the model tab
  const ModelContent = (
    <div className="min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Lung Cancer Risk Assessment
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Enter your health information below to assess your risk of lung cancer.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative w-full aspect-[21/9] mb-8 rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src="/images/lung.jpg"
            alt="Lung Cancer Assessment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        </motion.div>

        <div className="flex mb-6 justify-center">
          <button
            onClick={handleUseSampleData}
            style={{
              background: `linear-gradient(135deg, ${theme}40, ${theme}20)`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            className="px-6 py-3 rounded-xl text-white/90 hover:text-white border border-white/10 transition-all duration-200 flex items-center gap-2 hover:scale-105"
          >
            <FaDatabase className="text-lg" />
            Use Sample Data
          </button>
        </div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <style jsx global>{`
            select, input {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              transition: all 0.3s ease;
            }
            select:hover, input:hover {
              background: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.2);
            }
            select:focus, input:focus {
              outline: none;
              ring: 2px solid rgba(255, 255, 255, 0.2);
              background: rgba(255, 255, 255, 0.15);
            }
            select option {
              background-color: rgba(17, 24, 39, 0.95);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
            }
          `}</style>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2 text-center text-gray-300">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl text-white text-center appearance-none"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2 text-center text-gray-300">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl text-white text-center"
              placeholder="Enter age"
              required
            />
          </div>

          {[
            { name: 'smoking', label: 'Smoking' },
            { name: 'yellow_fingers', label: 'Yellow Fingers' },
            { name: 'anxiety', label: 'Anxiety' },
            { name: 'peer_pressure', label: 'Peer Pressure' },
            { name: 'chronic_disease', label: 'Chronic Disease' },
            { name: 'fatigue', label: 'Fatigue' },
            { name: 'allergy', label: 'Allergy' },
            { name: 'wheezing', label: 'Wheezing' },
            { name: 'alcohol_consuming', label: 'Alcohol Consuming' },
            { name: 'coughing', label: 'Coughing' },
            { name: 'shortness_of_breath', label: 'Shortness of Breath' },
            { name: 'swallowing_difficulty', label: 'Swallowing Difficulty' },
            { name: 'chest_pain', label: 'Chest Pain' },
          ].map((field) => (
            <div key={field.name} className="form-group">
              <label className="block text-sm font-medium mb-2 text-center text-gray-300">{field.label}</label>
              <select
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl text-white text-center appearance-none"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
                <option value="2">Severe</option>
              </select>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 flex gap-4 justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 backdrop-blur-sm hover:scale-105"
          >
            {loading ? (
              <>Analyzing...</>
            ) : (
              <>
                <FaStethoscope className="text-lg" />
                Analyze Risk
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm border border-white/10 hover:scale-105"
          >
            Reset
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center backdrop-blur-sm"
            >
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {prediction && (
            <motion.div
              variants={itemVariants}
              className="mt-6 p-6 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${theme}20, ${theme}20)`,
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
                    stroke={prediction.probability < 0.5 ? "#ef4444" : "#22c55e"}
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
                      prediction.probability < 0.5 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {prediction.risk_level}
                  </span>
                </p>
                <p className="text-lg mb-4">
                  {prediction.probability < 0.5
                    ? "High risk of lung cancer detected. Please consult a healthcare provider immediately."
                    : "Low risk of lung cancer detected. Continue monitoring your health."}
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Lung Cancer Analysis</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Data visualizations and model development for lung cancer prediction
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10 h-[calc(100vh-120px)] min-h-[1230px] overflow-hidden">
          <NotebookViewer 
            notebookPath="/api/notebooks/lung_cancer_analysis.ipynb" 
            visualizations={lungVisualizations}
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
