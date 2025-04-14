'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaStethoscope, FaPercent, FaInfoCircle, FaHeartbeat, FaShieldAlt, FaSearch, FaDatabase, FaQuestionCircle } from 'react-icons/fa';
import { getRandomHeartData } from '@/utils/sampleData';
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

// Field descriptions for heart disease inputs
const fieldDescriptions = {
  age: "Patient's age in years",
  sex: "Gender (1 = male, 0 = female)",
  cp: "Chest pain type (0-3, where 3 is asymptomatic)",
  trestbps: "Resting blood pressure in mm Hg on admission to the hospital",
  chol: "Serum cholesterol in mg/dl",
  fbs: "Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)",
  restecg: "Resting electrocardiographic results (0-2)",
  thalach: "Maximum heart rate achieved during exercise",
  exang: "Exercise induced angina (1 = yes, 0 = no)",
  slope: "Slope of the peak exercise ST segment (0-2)",
  ca: "Number of major vessels colored by fluoroscopy (0-3)",
  thal: "Thalassemia (1 = normal, 2 = fixed defect, 3 = reversible defect)"
};

export default function HeartDiseasePage() {
  const [formData, setFormData] = useState({
    age: '',
    sex: '1',
    cp: '0',
    trestbps: '',
    chol: '',
    fbs: '0',
    restecg: '0',
    thalach: '',
    exang: '0',
    slope: '0',
    ca: '0',
    thal: '1'
  });

  const handleSampleData = () => {
    setFormData(getRandomHeartData());
  };

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { themeColor } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Convert all form values to numbers before sending
      const numericFormData = Object.entries(formData).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: parseFloat(value)
      }), {});

      const response = await fetch('http://localhost:8001/predict/heart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numericFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Define interactive visualizations with Plotly data
  const heartVisualizations = [
    {
      title: 'Age Distribution by Heart Disease',
      type: 'histogram' as const,
      data: [
        {
          x: Array.from({ length: 100 }, (_, i) => 30 + Math.random() * 50),
          type: 'histogram',
          marker: {
            color: 'rgba(100, 149, 237, 0.7)',
            line: {
              color: 'rgba(100, 149, 237, 1)',
              width: 1
            }
          },
          opacity: 0.75,
          name: 'No Heart Disease'
        },
        {
          x: Array.from({ length: 100 }, (_, i) => 40 + Math.random() * 45),
          type: 'histogram',
          marker: {
            color: 'rgba(255, 99, 132, 0.7)',
            line: {
              color: 'rgba(255, 99, 132, 1)',
              width: 1
            }
          },
          opacity: 0.75,
          name: 'Heart Disease'
        }
      ],
      layout: {
        title: 'Age Distribution by Heart Disease',
        xaxis: { title: 'Age' },
        yaxis: { title: 'Count' },
        barmode: 'overlay',
        legend: { x: 0.1, y: 1 }
      },
      description: 'Distribution of ages in patients with and without heart disease, showing higher prevalence in older age groups.'
    },
    {
      title: 'Cholesterol vs. Blood Pressure',
      type: 'scatter' as const,
      data: [
        {
          x: Array.from({ length: 50 }, (_, i) => 150 + Math.random() * 150),
          y: Array.from({ length: 50 }, (_, i) => 100 + Math.random() * 60),
          mode: 'markers',
          type: 'scatter',
          name: 'No Heart Disease',
          marker: {
            color: 'rgba(100, 149, 237, 0.7)',
            size: 10
          }
        },
        {
          x: Array.from({ length: 50 }, (_, i) => 200 + Math.random() * 150),
          y: Array.from({ length: 50 }, (_, i) => 120 + Math.random() * 60),
          mode: 'markers',
          type: 'scatter',
          name: 'Heart Disease',
          marker: {
            color: 'rgba(255, 99, 132, 0.7)',
            size: 10
          }
        }
      ],
      layout: {
        title: 'Cholesterol vs. Blood Pressure',
        xaxis: { title: 'Cholesterol (mg/dL)' },
        yaxis: { title: 'Systolic Blood Pressure (mmHg)' },
        legend: { x: 0.1, y: 1 }
      },
      description: 'Scatter plot showing the relationship between cholesterol levels and blood pressure, colored by heart disease status.'
    },
    {
      title: 'Feature Importance for Heart Disease Prediction',
      type: 'bar' as const,
      data: [
        {
          y: ['Age', 'Cholesterol', 'Blood Pressure', 'Max Heart Rate', 'ST Depression', 'Chest Pain Type', 'Exercise Angina', 'Number of Vessels'],
          x: [0.25, 0.20, 0.15, 0.12, 0.10, 0.08, 0.06, 0.04],
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
      description: 'Relative importance of different features in predicting heart disease, with age and cholesterol being the most significant predictors.'
    },
    {
      title: 'Heart Disease by Gender',
      type: 'pie' as const,
      data: [
        {
          values: [65, 35],
          labels: ['Male', 'Female'],
          type: 'pie',
          textinfo: 'label+percent',
          textposition: 'inside',
          marker: {
            colors: ['#3366CC', '#DC3912']
          }
        }
      ],
      layout: {
        title: 'Heart Disease by Gender'
      },
      description: 'Distribution of heart disease cases by gender, showing higher prevalence in males.'
    }
  ];

  // Content for the model tab
  const ModelContent = (
    <div className="min-h-screen mx-auto max-w-7xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto px-4 py-8"
      >

        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Heart Disease Prediction</h1>
          <p className="text-gray-300">Enter your health metrics below for a heart disease risk assessment.</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative w-full aspect-[21/9] mb-8 rounded-2xl overflow-hidden"
        >
          <Image
            src="/images/heart.jpg"
            alt="Heart Disease Prediction"
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

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Age</label>
            <div className="relative">
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-white border border-white/10"
                placeholder="Enter age"
              />
              <div className="absolute right-3 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.age}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Sex</label>
            <div className="relative">
              <style jsx>{`
                select {
                  -webkit-appearance: none;
                  -moz-appearance: none;
                  appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  background-size: 1em;
                }
                select::-ms-expand {
                  display: none;
                }
                select option {
                  background-color: rgba(0, 0, 0, 0.8);
                  backdrop-filter: blur(10px);
                  color: white;
                }
              `}</style>
              <select
                value={formData.sex}
                onChange={handleInputChange}
                name="sex"
                className="w-full p-3 rounded-xl bg-transparent backdrop-blur-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
              <div className="absolute right-10 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.sex}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Chest Pain Type</label>
            <div className="relative">
              <style jsx>{`
                select {
                  -webkit-appearance: none;
                  -moz-appearance: none;
                  appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  background-size: 1em;
                }
                select::-ms-expand {
                  display: none;
                }
                select option {
                  background-color: rgba(0, 0, 0, 0.8);
                  backdrop-filter: blur(10px);
                  color: white;
                }
              `}</style>
              <select
                value={formData.cp}
                onChange={handleInputChange}
                name="cp"
                className="w-full p-3 rounded-xl bg-transparent backdrop-blur-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="0">Typical Angina</option>
                <option value="1">Atypical Angina</option>
                <option value="2">Non-anginal Pain</option>
                <option value="3">Asymptomatic</option>
              </select>
              <div className="absolute right-10 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.cp}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Resting Blood Pressure (mm Hg)</label>
            <div className="relative">
              <input
                type="number"
                name="trestbps"
                value={formData.trestbps}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-white border border-white/10"
                placeholder="Enter resting blood pressure"
              />
              <div className="absolute right-3 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.trestbps}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Cholesterol (mg/dl)</label>
            <div className="relative">
              <input
                type="number"
                name="chol"
                value={formData.chol}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-white border border-white/10"
                placeholder="Enter cholesterol level"
              />
              <div className="absolute right-3 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.chol}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Fasting Blood Sugar 120 mg/dl</label>
            <div className="relative">
              <style jsx>{`
                select {
                  -webkit-appearance: none;
                  -moz-appearance: none;
                  appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  background-size: 1em;
                }
                select::-ms-expand {
                  display: none;
                }
                select option {
                  background-color: rgba(0, 0, 0, 0.8);
                  backdrop-filter: blur(10px);
                  color: white;
                }
              `}</style>
              <select
                value={formData.fbs}
                onChange={handleInputChange}
                name="fbs"
                className="w-full p-3 rounded-xl bg-transparent backdrop-blur-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              <div className="absolute right-10 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.fbs}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Resting ECG Results</label>
            <div className="relative">
              <style jsx>{`
                select {
                  -webkit-appearance: none;
                  -moz-appearance: none;
                  appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  background-size: 1em;
                }
                select::-ms-expand {
                  display: none;
                }
                select option {
                  background-color: rgba(0, 0, 0, 0.8);
                  backdrop-filter: blur(10px);
                  color: white;
                }
              `}</style>
              <select
                value={formData.restecg}
                onChange={handleInputChange}
                name="restecg"
                className="w-full p-3 rounded-xl bg-transparent backdrop-blur-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="0">Normal</option>
                <option value="1">ST-T Wave Abnormality</option>
                <option value="2">Left Ventricular Hypertrophy</option>
              </select>
              <div className="absolute right-10 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.restecg}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Maximum Heart Rate</label>
            <div className="relative">
              <input
                type="number"
                name="thalach"
                value={formData.thalach}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-white border border-white/10"
                placeholder="Enter maximum heart rate"
              />
              <div className="absolute right-3 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.thalach}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Exercise Induced Angina</label>
            <div className="relative">
              <style jsx>{`
                select {
                  -webkit-appearance: none;
                  -moz-appearance: none;
                  appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  background-size: 1em;
                }
                select::-ms-expand {
                  display: none;
                }
                select option {
                  background-color: rgba(0, 0, 0, 0.8);
                  backdrop-filter: blur(10px);
                  color: white;
                }
              `}</style>
              <select
                value={formData.exang}
                onChange={handleInputChange}
                name="exang"
                className="w-full p-3 rounded-xl bg-transparent backdrop-blur-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              <div className="absolute right-10 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.exang}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Slope of Peak Exercise ST Segment</label>
            <div className="relative">
              <style jsx>{`
                select {
                  -webkit-appearance: none;
                  -moz-appearance: none;
                  appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  background-size: 1em;
                }
                select::-ms-expand {
                  display: none;
                }
                select option {
                  background-color: rgba(0, 0, 0, 0.8);
                  backdrop-filter: blur(10px);
                  color: white;
                }
              `}</style>
              <select
                value={formData.slope}
                onChange={handleInputChange}
                name="slope"
                className="w-full p-3 rounded-xl bg-transparent backdrop-blur-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="0">Upsloping</option>
                <option value="1">Flat</option>
                <option value="2">Downsloping</option>
              </select>
              <div className="absolute right-10 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.slope}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Number of Major Vessels</label>
            <div className="relative">
              <style jsx>{`
                select {
                  -webkit-appearance: none;
                  -moz-appearance: none;
                  appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  background-size: 1em;
                }
                select::-ms-expand {
                  display: none;
                }
                select option {
                  background-color: rgba(0, 0, 0, 0.8);
                  backdrop-filter: blur(10px);
                  color: white;
                }
              `}</style>
              <select
                value={formData.ca}
                onChange={handleInputChange}
                name="ca"
                className="w-full p-3 rounded-xl bg-transparent backdrop-blur-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <div className="absolute right-10 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.ca}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Thalassemia</label>
            <div className="relative">
              <style jsx>{`
                select {
                  -webkit-appearance: none;
                  -moz-appearance: none;
                  appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  background-size: 1em;
                }
                select::-ms-expand {
                  display: none;
                }
                select option {
                  background-color: rgba(0, 0, 0, 0.8);
                  backdrop-filter: blur(10px);
                  color: white;
                }
              `}</style>
              <select
                value={formData.thal}
                onChange={handleInputChange}
                name="thal"
                className="w-full p-3 rounded-xl bg-transparent backdrop-blur-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="1">Normal</option>
                <option value="2">Fixed Defect</option>
                <option value="3">Reversible Defect</option>
              </select>
              <div className="absolute right-10 top-3 text-gray-400 cursor-pointer group">
                <FaQuestionCircle />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                  {fieldDescriptions.thal}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 flex justify-center">
          <button
            onClick={handlePredict}
            disabled={isLoading}
            className="px-12 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors backdrop-blur-sm bg-opacity-50 text-lg"
            style={{ backgroundColor: themeColor }}
          >
            {isLoading ? 'Analyzing...' : 'Predict Heart Disease Risk'}
          </button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center mx-auto max-w-2xl"
            >
              {error}
            </motion.div>
          )}

          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 p-6 backdrop-blur-lg bg-black/30 rounded-2xl border border-red-500/10 max-w-6xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-6 backdrop-blur-md bg-black/20 rounded-2xl border border-red-500/10">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        className="text-gray-800/50"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className={prediction.prediction ? "text-red-500" : "text-green-500"}
                        strokeWidth="10"
                        strokeDasharray={365}
                        strokeDashoffset={365 - (365 * prediction.probability)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="64"
                        cy="64"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <span className={`text-3xl font-bold ${prediction.prediction ? "text-red-500" : "text-green-500"}`}>{(prediction.probability * 100).toFixed(1)}%</span>
                      <span className="block text-sm text-gray-400">Probability</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 backdrop-blur-md bg-black/20 rounded-2xl border border-red-500/10">
                  <FaHeartbeat className={`text-4xl mb-3 ${prediction.prediction ? "text-red-500" : "text-green-500"}`} />
                  <h3 className="text-lg font-medium mb-2 text-gray-300">Prediction</h3>
                  <p className={`text-2xl font-bold ${prediction.prediction ? "text-red-500" : "text-green-500"}`}>
                    {prediction.prediction ? 'Positive' : 'Negative'}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 backdrop-blur-md bg-black/20 rounded-2xl border border-red-500/10">
                  <FaPercent className={`text-4xl mb-3 ${prediction.prediction ? "text-red-500" : "text-green-500"}`} />
                  <h3 className="text-lg font-medium mb-2 text-gray-300">Ratio</h3>
                  <p className={`text-2xl font-bold ${prediction.prediction ? "text-red-500" : "text-green-500"}`}>
                    {(prediction.probability * 100).toFixed(1)}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 backdrop-blur-md bg-black/20 rounded-2xl border border-red-500/10">
                  <FaInfoCircle className={`text-4xl mb-3 ${prediction.prediction ? "text-red-500" : "text-green-500"}`} />
                  <h3 className="text-lg font-medium mb-2 text-gray-300">Risk Level</h3>
                  <p className={`text-2xl font-bold ${prediction.prediction ? "text-red-500" : "text-green-500"}`}>
                    {prediction.risk_level}
                  </p>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Heart Disease Analysis</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Data visualizations and model development for heart disease prediction
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10 h-[calc(100vh-120px)] min-h-[1230px] overflow-hidden">
          <NotebookViewer 
            notebookPath="/api/notebooks/heart_disease_analysis.ipynb" 
            visualizations={heartVisualizations}
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
