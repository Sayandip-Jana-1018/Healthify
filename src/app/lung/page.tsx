'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaStethoscope, FaHeartbeat, FaShieldAlt, FaLungs, FaDatabase } from 'react-icons/fa';
import { getRandomLungData } from '@/utils/sampleData';

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
    setFormData(getRandomLungData());
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
      const response = await fetch('http://localhost:8000/predict/lung', {
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

  return (
    <div className="min-h-screen bg-transparent">
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
}
