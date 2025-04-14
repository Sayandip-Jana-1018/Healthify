'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaStethoscope, FaPercent, FaInfoCircle, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import { getRandomDiabetesData } from '@/utils/sampleData';
import TabView from '@/components/TabView';
import NotebookViewer from '@/components/NoteViewer';

// Create a wrapper component for icons
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

// Field descriptions for diabetes inputs
const fieldDescriptions = {
  Pregnancies: "Number of times pregnant",
  Glucose: "Plasma glucose concentration after 2 hours in an oral glucose tolerance test (mg/dL)",
  BloodPressure: "Diastolic blood pressure (mm Hg)",
  SkinThickness: "Triceps skin fold thickness (mm)",
  Insulin: "2-Hour serum insulin (mu U/ml)",
  BMI: "Body mass index (weight in kg/(height in m)²)",
  DiabetesPedigreeFunction: "Diabetes pedigree function (a function which scores likelihood of diabetes based on family history)",
  Age: "Age in years"
};

export default function DiabetesPage() {
  // Pre-filled form data with realistic values
  const [formData, setFormData] = useState({
    Pregnancies: '2',
    Glucose: '110',
    BloodPressure: '72',
    SkinThickness: '20',
    Insulin: '85',
    BMI: '24.5',
    DiabetesPedigreeFunction: '0.52',
    Age: '31'
  });
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { themeColor } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8001/predict/diabetes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Pregnancies: Number(formData.Pregnancies),
          Glucose: Number(formData.Glucose),
          BloodPressure: Number(formData.BloodPressure),
          SkinThickness: Number(formData.SkinThickness),
          Insulin: Number(formData.Insulin),
          BMI: Number(formData.BMI),
          DiabetesPedigreeFunction: Number(formData.DiabetesPedigreeFunction),
          Age: Number(formData.Age)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during prediction');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleData = () => {
    const sampleData = getRandomDiabetesData();
    setFormData({
      Pregnancies: sampleData.Pregnancies.toString(),
      Glucose: sampleData.Glucose.toString(),
      BloodPressure: sampleData.BloodPressure.toString(),
      SkinThickness: sampleData.SkinThickness.toString(),
      Insulin: sampleData.Insulin.toString(),
      BMI: sampleData.BMI.toString(),
      DiabetesPedigreeFunction: sampleData.DiabetesPedigreeFunction.toString(),
      Age: sampleData.Age.toString()
    });
  };

  // Define interactive visualizations with Plotly data
  const diabetesVisualizations = [
    {
      title: 'Glucose Level Distribution',
      type: 'histogram' as const,
      data: [
        {
          x: Array.from({ length: 100 }, (_, i) => 70 + Math.random() * 180),
          type: 'histogram',
          marker: {
            color: 'rgba(100, 149, 237, 0.7)',
            line: {
              color: 'rgba(100, 149, 237, 1)',
              width: 1
            }
          },
          opacity: 0.75,
          name: 'Non-Diabetic'
        },
        {
          x: Array.from({ length: 100 }, (_, i) => 120 + Math.random() * 180),
          type: 'histogram',
          marker: {
            color: 'rgba(255, 99, 132, 0.7)',
            line: {
              color: 'rgba(255, 99, 132, 1)',
              width: 1
            }
          },
          opacity: 0.75,
          name: 'Diabetic'
        }
      ],
      layout: {
        title: 'Glucose Level Distribution',
        xaxis: { title: 'Glucose Level (mg/dL)' },
        yaxis: { title: 'Count' },
        barmode: 'overlay',
        legend: { x: 0.1, y: 1 }
      },
      description: 'Distribution of glucose levels in diabetic and non-diabetic patients, showing the higher glucose levels typically found in diabetic individuals.'
    },
    {
      title: 'Feature Correlation Heatmap',
      type: 'heatmap' as const,
      data: [
        {
          z: [
            [1.0, 0.5, 0.4, 0.3, 0.2, 0.6, 0.1, 0.4],
            [0.5, 1.0, 0.3, 0.2, 0.1, 0.4, 0.2, 0.3],
            [0.4, 0.3, 1.0, 0.6, 0.5, 0.3, 0.4, 0.2],
            [0.3, 0.2, 0.6, 1.0, 0.4, 0.2, 0.3, 0.1],
            [0.2, 0.1, 0.5, 0.4, 1.0, 0.3, 0.5, 0.4],
            [0.6, 0.4, 0.3, 0.2, 0.3, 1.0, 0.2, 0.5],
            [0.1, 0.2, 0.4, 0.3, 0.5, 0.2, 1.0, 0.3],
            [0.4, 0.3, 0.2, 0.1, 0.4, 0.5, 0.3, 1.0]
          ],
          x: ['Glucose', 'BMI', 'Age', 'Insulin', 'BP', 'Pregnancies', 'SkinThickness', 'DiabetesPedigree'],
          y: ['Glucose', 'BMI', 'Age', 'Insulin', 'BP', 'Pregnancies', 'SkinThickness', 'DiabetesPedigree'],
          type: 'heatmap',
          colorscale: 'Viridis'
        }
      ],
      layout: {
        title: 'Feature Correlation Matrix',
        annotations: []
      },
      description: 'Correlation heatmap showing relationships between different features used in diabetes prediction.'
    },
    {
      title: 'Feature Importance for Diabetes Prediction',
      type: 'bar' as const,
      data: [
        {
          y: ['Glucose', 'BMI', 'Age', 'Insulin', 'BloodPressure', 'Pregnancies', 'SkinThickness', 'DiabetesPedigree'],
          x: [0.35, 0.20, 0.15, 0.10, 0.08, 0.05, 0.04, 0.03],
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
        yaxis: { title: 'Feature' }
      },
      description: 'Relative importance of different features in predicting diabetes, with glucose level being the most significant predictor.'
    },
    {
      title: 'BMI vs Glucose with Diabetes Outcome',
      type: 'scatter' as const,
      data: [
        {
          x: Array.from({ length: 50 }, (_, i) => 18 + Math.random() * 20),
          y: Array.from({ length: 50 }, (_, i) => 70 + Math.random() * 100),
          mode: 'markers',
          type: 'scatter',
          name: 'Non-Diabetic',
          marker: {
            color: 'rgba(100, 149, 237, 0.7)',
            size: 10
          }
        },
        {
          x: Array.from({ length: 50 }, (_, i) => 25 + Math.random() * 20),
          y: Array.from({ length: 50 }, (_, i) => 120 + Math.random() * 100),
          mode: 'markers',
          type: 'scatter',
          name: 'Diabetic',
          marker: {
            color: 'rgba(255, 99, 132, 0.7)',
            size: 10
          }
        }
      ],
      layout: {
        title: 'BMI vs Glucose Level',
        xaxis: { title: 'BMI' },
        yaxis: { title: 'Glucose Level (mg/dL)' },
        legend: { x: 0.1, y: 1 }
      },
      description: 'Scatter plot showing the relationship between BMI and glucose levels, colored by diabetes outcome. Note the clustering of diabetic patients in the high BMI, high glucose region.'
    }
  ];

  // Content for the model tab
  const ModelContent = (
    <div className="min-h-screen mx-auto max-w-5xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Diabetes Prediction</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Predict your risk of diabetes using our advanced AI model
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative w-full aspect-[21/9] mb-8 rounded-2xl overflow-hidden"
        >
          <Image
            src="/images/diabetes.jpg"
            alt="Diabetes Prediction"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent, ${darkenColor(themeColor, 100)})`
            }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <motion.div variants={itemVariants} className="glass p-6 rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10">
            <div className="flex items-start gap-3 mb-6">
              <Icon icon={FaStethoscope} className="text-2xl text-blue-500 shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">Health Metrics</h2>
                <p className="text-white/60 text-sm">Enter your health information below</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Number of Pregnancies</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="Pregnancies"
                      value={formData.Pregnancies}
                      onChange={handleInputChange}
                      min="0"
                      max="20"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                      <FaQuestionCircle />
                      <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                        {fieldDescriptions.Pregnancies}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Glucose Level (mg/dL)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="Glucose"
                      value={formData.Glucose}
                      onChange={handleInputChange}
                      min="0"
                      max="200"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                      <FaQuestionCircle />
                      <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                        {fieldDescriptions.Glucose}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Blood Pressure (mm Hg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="BloodPressure"
                      value={formData.BloodPressure}
                      onChange={handleInputChange}
                      min="0"
                      max="122"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                      <FaQuestionCircle />
                      <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                        {fieldDescriptions.BloodPressure}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Skin Thickness (mm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="SkinThickness"
                      value={formData.SkinThickness}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                      <FaQuestionCircle />
                      <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                        {fieldDescriptions.SkinThickness}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Insulin Level (mu U/ml)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="Insulin"
                      value={formData.Insulin}
                      onChange={handleInputChange}
                      min="0"
                      max="846"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                      <FaQuestionCircle />
                      <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                        {fieldDescriptions.Insulin}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">BMI (kg/m²)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="BMI"
                      value={formData.BMI}
                      onChange={handleInputChange}
                      min="0"
                      max="67.1"
                      step="0.1"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                      <FaQuestionCircle />
                      <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                        {fieldDescriptions.BMI}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Diabetes Pedigree Function</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="DiabetesPedigreeFunction"
                      value={formData.DiabetesPedigreeFunction}
                      onChange={handleInputChange}
                      min="0.078"
                      max="2.42"
                      step="0.001"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                      <FaQuestionCircle />
                      <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                        {fieldDescriptions.DiabetesPedigreeFunction}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Age</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="Age"
                      value={formData.Age}
                      onChange={handleInputChange}
                      min="21"
                      max="81"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                      <FaQuestionCircle />
                      <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                        {fieldDescriptions.Age}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg bg-red-500/20 text-red-200 border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex justify-between gap-4 mt-6">
                <motion.button
                  variants={itemVariants}
                  onClick={handlePredict}
                  className="w-full px-6 py-3 rounded-xl font-medium text-lg transition-all duration-300 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor}, ${darkenColor(themeColor, 40)})`,
                    boxShadow: `0 4px 20px ${themeColor}30`
                  }}
                >
                  {isLoading ? 'Predicting...' : 'Predict'}
                </motion.button>

                <motion.button
                  variants={itemVariants}
                  onClick={handleSampleData}
                  className="w-full px-6 py-3 rounded-xl font-medium text-lg transition-all duration-300 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor}, ${darkenColor(themeColor, 40)})`,
                    boxShadow: `0 4px 20px ${themeColor}30`
                  }}
                >
                  Use Sample Data
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Results */}
          <AnimatePresence>
            {prediction ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass p-6 rounded-2xl h-full max-h-[calc(100vh-180px)] backdrop-blur-lg bg-black/30 border border-white/10 overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-start gap-3 mb-6">
                  <Icon icon={FaStethoscope} className="text-2xl text-blue-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-1">Prediction Result</h3>
                    <p className="text-white/60 text-sm">Based on your health metrics</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="glass p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon icon={FaInfoCircle} className="text-lg text-blue-500 shrink-0" />
                      <span className="text-white/60 text-sm">Diabetes Risk</span>
                    </div>
                    <p className={`text-white font-semibold text-lg pl-7 ${prediction?.prediction ? 'text-red-500' : 'text-green-500'}`}>
                      {prediction?.prediction ? 'Positive' : 'Negative'}
                    </p>
                  </div>

                  <div className="glass p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon icon={FaPercent} className="text-lg text-blue-500 shrink-0" />
                      <span className="text-white/60 text-sm">Probability</span>
                    </div>
                    <div className="pl-7">
                      <div className="relative w-full h-4 bg-gray-700/50 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            prediction?.prediction ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${prediction?.probability * 100}%` }}
                        ></div>
                      </div>
                      <p className={`text-white mt-1 ${prediction?.prediction ? 'text-red-500' : 'text-green-500'}`}>
                        {(prediction?.probability * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="glass p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon icon={FaShieldAlt} className="text-lg text-blue-500 shrink-0" />
                      <span className="text-white/60 text-sm">Risk Level</span>
                    </div>
                    <p className={`text-white font-semibold text-lg pl-7 ${
                      prediction?.risk_level === 'High' ? 'text-red-500' :
                      prediction?.risk_level === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {prediction?.risk_level}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-white/80">
                    <strong>Note:</strong> This prediction is based on the provided metrics and should be used as a screening tool only.
                    Please consult with a healthcare professional for proper diagnosis and medical advice.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-6 rounded-2xl h-full flex flex-col items-center justify-center text-center gap-4 backdrop-blur-lg bg-black/30 border border-white/10"
              >
                <Icon icon={FaStethoscope} className="text-4xl text-blue-500/50" />
                <div>
                  <p className="text-xl text-white/60 mb-2">No Prediction Yet</p>
                  <p className="text-sm text-white/40">
                    Fill in your health metrics and click Predict to see your diabetes risk assessment
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Diabetes Analysis Notebook</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Data visualizations and model development for diabetes prediction
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10 h-[calc(100vh-120px)] min-h-[1230px] overflow-hidden">
          <NotebookViewer 
            notebookPath="/api/notebooks/diabetes_analysis.ipynb" 
            visualizations={diabetesVisualizations}
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