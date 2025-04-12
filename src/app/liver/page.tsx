'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaStethoscope, FaPercent, FaInfoCircle, FaHeartbeat, FaShieldAlt, FaSearch, FaDatabase } from 'react-icons/fa';
import { getRandomLiverData } from '@/utils/sampleData';

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

export default function LiverPage() {
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

      const response = await fetch('http://localhost:8000/predict/liver', {
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

  return (
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
          <motion.div variants={itemVariants} className="form-group text-center">
            <label className="block mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 ring-blue-500/50 text-center"
              placeholder="Enter age"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group text-center">
            <label className="block mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 ring-blue-500/50 text-center"
            >
              <option value="">Select gender</option>
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group text-center">
            <label className="block mb-2">Total Bilirubin</label>
            <input
              type="number"
              name="total_bilirubin"
              value={formData.total_bilirubin}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 ring-blue-500/50 text-center"
              placeholder="Enter value"
              step="0.01"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group text-center">
            <label className="block mb-2">Direct Bilirubin</label>
            <input
              type="number"
              name="direct_bilirubin"
              value={formData.direct_bilirubin}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 ring-blue-500/50 text-center"
              placeholder="Enter value"
              step="0.01"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group text-center">
            <label className="block mb-2">Alkaline Phosphotase</label>
            <input
              type="number"
              name="alkaline_phosphotase"
              value={formData.alkaline_phosphotase}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 ring-blue-500/50 text-center"
              placeholder="Enter value"
              step="0.01"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group text-center">
            <label className="block mb-2">Alamine Aminotransferase</label>
            <input
              type="number"
              name="alamine_aminotransferase"
              value={formData.alamine_aminotransferase}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 ring-blue-500/50 text-center"
              placeholder="Enter value"
              step="0.01"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group text-center">
            <label className="block mb-2">Aspartate Aminotransferase</label>
            <input
              type="number"
              name="aspartate_aminotransferase"
              value={formData.aspartate_aminotransferase}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 ring-blue-500/50 text-center"
              placeholder="Enter value"
              step="0.01"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group text-center">
            <label className="block mb-2">Total Proteins</label>
            <input
              type="number"
              name="total_proteins"
              value={formData.total_proteins}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 ring-blue-500/50 text-center"
              placeholder="Enter value"
              step="0.01"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group text-center">
            <label className="block mb-2">Albumin</label>
            <input
              type="number"
              name="albumin"
              value={formData.albumin}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 ring-blue-500/50 text-center"
              placeholder="Enter value"
              step="0.01"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group text-center">
            <label className="block mb-2">Albumin/Globulin Ratio</label>
            <input
              type="number"
              name="albumin_globulin_ratio"
              value={formData.albumin_globulin_ratio}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 ring-blue-500/50 text-center"
              placeholder="Enter value"
              step="0.01"
            />
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
}
