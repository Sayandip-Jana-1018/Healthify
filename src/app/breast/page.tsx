'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaDatabase, FaHeartbeat, FaStethoscope, FaShieldAlt } from 'react-icons/fa';
import { getRandomBreastData } from '@/utils/sampleData';

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

export default function BreastCancerPage() {
  const [formData, setFormData] = useState({
    radius_mean: '',
    texture_mean: '',
    perimeter_mean: '',
    area_mean: '',
    smoothness_mean: '',
    compactness_mean: '',
    concavity_mean: '',
    concave_points_mean: '',
    symmetry_mean: '',
    fractal_dimension_mean: '',
    radius_se: '',
    texture_se: '',
    perimeter_se: '',
    area_se: '',
    smoothness_se: '',
    compactness_se: '',
    concavity_se: '',
    concave_points_se: '',
    symmetry_se: '',
    fractal_dimension_se: '',
    radius_worst: '',
    texture_worst: '',
    perimeter_worst: '',
    area_worst: '',
    smoothness_worst: '',
    compactness_worst: '',
    concavity_worst: '',
    concave_points_worst: '',
    symmetry_worst: '',
    fractal_dimension_worst: ''
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert all string values to numbers before sending
      const transformedData = Object.entries(formData).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value === '' ? 0 : parseFloat(value)
      }), {});

      const response = await fetch('http://localhost:8000/predict/breast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleData = () => {
    setFormData(getRandomBreastData());
  };

  const inputGroups = [
    {
      title: 'Mean Values',
      fields: [
        { name: 'radius_mean', label: 'Radius' },
        { name: 'texture_mean', label: 'Texture' },
        { name: 'perimeter_mean', label: 'Perimeter' },
        { name: 'area_mean', label: 'Area' },
        { name: 'smoothness_mean', label: 'Smoothness' },
        { name: 'compactness_mean', label: 'Compactness' },
        { name: 'concavity_mean', label: 'Concavity' },
        { name: 'concave_points_mean', label: 'Concave Points' },
        { name: 'symmetry_mean', label: 'Symmetry' },
        { name: 'fractal_dimension_mean', label: 'Fractal Dimension' }
      ]
    },
    {
      title: 'Standard Error',
      fields: [
        { name: 'radius_se', label: 'Radius SE' },
        { name: 'texture_se', label: 'Texture SE' },
        { name: 'perimeter_se', label: 'Perimeter SE' },
        { name: 'area_se', label: 'Area SE' },
        { name: 'smoothness_se', label: 'Smoothness SE' },
        { name: 'compactness_se', label: 'Compactness SE' },
        { name: 'concavity_se', label: 'Concavity SE' },
        { name: 'concave_points_se', label: 'Concave Points SE' },
        { name: 'symmetry_se', label: 'Symmetry SE' },
        { name: 'fractal_dimension_se', label: 'Fractal Dimension SE' }
      ]
    },
    {
      title: 'Worst Values',
      fields: [
        { name: 'radius_worst', label: 'Radius Worst' },
        { name: 'texture_worst', label: 'Texture Worst' },
        { name: 'perimeter_worst', label: 'Perimeter Worst' },
        { name: 'area_worst', label: 'Area Worst' },
        { name: 'smoothness_worst', label: 'Smoothness Worst' },
        { name: 'compactness_worst', label: 'Compactness Worst' },
        { name: 'concavity_worst', label: 'Concavity Worst' },
        { name: 'concave_points_worst', label: 'Concave Points Worst' },
        { name: 'symmetry_worst', label: 'Symmetry Worst' },
        { name: 'fractal_dimension_worst', label: 'Fractal Dimension Worst' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl mx-auto px-4 py-8"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Breast Cancer Risk Assessment
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Enter your health information below to assess your risk of breast cancer.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative w-full aspect-[21/9] mb-8 rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src="/images/breast.webp"
            alt="Breast Cancer Assessment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        </motion.div>

        <div className="flex mb-6 justify-center">
          <button
            onClick={handleSampleData}
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

        <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-6">
          {inputGroups.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-lg font-semibold text-white text-center">{group.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.fields.map((field) => (
                  <input
                    key={field.name}
                    type="number"
                    step="any"
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={field.label}
                    className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-gray-400 text-center"
                    required
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors min-w-[200px]"
            >
              {loading ? 'Predicting...' : 'Predict'}
            </button>
          </div>
        </motion.form>

        <AnimatePresence>
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-lg border border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Probability Circle */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={prediction.risk_level === "High" ? "#ef4444" : prediction.risk_level === "Medium" ? "#f59e0b" : "#22c55e"}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${prediction.probability * 2.83}, 283`}
                        transform="rotate(-90 50 50)"
                        style={{ transition: "stroke-dasharray 0.5s ease-in-out" }}
                      />
                      {/* Percentage text */}
                      <text
                        x="50"
                        y="45"
                        textAnchor="middle"
                        fill="white"
                        fontSize="18"
                        fontWeight="bold"
                      >
                        {prediction.probability}%
                      </text>
                      <text
                        x="50"
                        y="65"
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.7)"
                        fontSize="12"
                      >
                        Probability
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Right Column - Prediction Details */}
                <div className="flex flex-col justify-center gap-6">
                  {/* Prediction Result */}
                  <div className="space-y-2">
                    <h3 className="text-white/60 text-sm uppercase tracking-wider">Prediction</h3>
                    <div className={`text-2xl font-bold ${prediction.prediction ? 'text-red-500' : 'text-green-500'}`}>
                      {prediction.prediction ? 'Malignant' : 'Benign'}
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="space-y-2">
                    <h3 className="text-white/60 text-sm uppercase tracking-wider">Risk Level</h3>
                    <div className="flex items-center gap-2">
                      <div className={`px-4 py-2 rounded-lg font-semibold ${
                        prediction.risk_level === "High" 
                          ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                          : prediction.risk_level === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                      }`}>
                        {prediction.risk_level}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white/80 text-sm">
                      {prediction.risk_level === "High" 
                        ? "Immediate medical consultation recommended. Please consult with a healthcare professional as soon as possible."
                        : prediction.risk_level === "Medium"
                        ? "Regular monitoring advised. Schedule a check-up with your healthcare provider."
                        : "Low risk detected. Continue with regular health check-ups as recommended."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
