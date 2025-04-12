'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaStethoscope, FaPercent, FaInfoCircle, FaHeartbeat, FaShieldAlt, FaSearch, FaDatabase } from 'react-icons/fa';
import { getRandomHeartData } from '@/utils/sampleData';

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

      const response = await fetch('http://localhost:8000/predict/heart', {
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

  return (
    <div className="min-h-screen">
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
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-white border border-white/10"
              placeholder="Enter age"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Sex</label>
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
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Chest Pain Type</label>
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
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Resting Blood Pressure (mm Hg)</label>
            <input
              type="number"
              name="trestbps"
              value={formData.trestbps}
              onChange={handleInputChange}
              className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-white border border-white/10"
              placeholder="Enter resting blood pressure"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Cholesterol (mg/dl)</label>
            <input
              type="number"
              name="chol"
              value={formData.chol}
              onChange={handleInputChange}
              className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-white border border-white/10"
              placeholder="Enter cholesterol level"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Fasting Blood Sugar 120 mg/dl</label>
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
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Resting ECG Results</label>
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
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Maximum Heart Rate</label>
            <input
              type="number"
              name="thalach"
              value={formData.thalach}
              onChange={handleInputChange}
              className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-white border border-white/10"
              placeholder="Enter maximum heart rate"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Exercise Induced Angina</label>
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
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Slope of Peak Exercise ST Segment</label>
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
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Number of Major Vessels</label>
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
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">Thalassemia</label>
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
                        className="text-red-500"
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
                      <span className="text-3xl font-bold text-red-500">{(prediction.probability * 100).toFixed(1)}%</span>
                      <span className="block text-sm text-gray-400">Probability</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 backdrop-blur-md bg-black/20 rounded-2xl border border-red-500/10">
                  <FaHeartbeat className="text-4xl mb-3 text-red-500" />
                  <h3 className="text-lg font-medium mb-2 text-gray-300">Prediction</h3>
                  <p className="text-2xl font-bold text-red-500">
                    {prediction.prediction ? 'Positive' : 'Negative'}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 backdrop-blur-md bg-black/20 rounded-2xl border border-red-500/10">
                  <FaPercent className="text-4xl mb-3 text-red-500" />
                  <h3 className="text-lg font-medium mb-2 text-gray-300">Ratio</h3>
                  <p className="text-2xl font-bold text-red-500">
                    {(prediction.probability * 100).toFixed(1)}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 backdrop-blur-md bg-black/20 rounded-2xl border border-red-500/10">
                  <FaInfoCircle className="text-4xl mb-3 text-red-500" />
                  <h3 className="text-lg font-medium mb-2 text-gray-300">Risk Level</h3>
                  <p className="text-2xl font-bold text-red-500">
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
}
