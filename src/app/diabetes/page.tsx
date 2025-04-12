'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaStethoscope, FaPercent, FaInfoCircle, FaShieldAlt, FaSearch, FaImage, FaKeyboard } from 'react-icons/fa';
import { getRandomDiabetesData } from '@/utils/sampleData';
import ImageUpload from '@/components/ImageUpload';
import AnalysisResult from '@/components/AnalysisResult';

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

interface ImageAnalysisResult {
  analysis: string;
}

export default function DiabetesPage() {
  // Pre-filled form data with realistic values
  const [formData, setFormData] = useState({
    Pregnancies: '4',
    Glucose: '130',
    BloodPressure: '78',
    SkinThickness: '25',
    Insulin: '120',
    BMI: '28.5',
    DiabetesPedigreeFunction: '0.85',
    Age: '35'
  });
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'image'>('form');
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
      const response = await fetch('http://localhost:8000/predict/diabetes', {
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
    } catch (error) {
      setError('Failed to get prediction. Please make sure the backend server is running.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleData = () => {
    setFormData(getRandomDiabetesData());
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto py-8 px-4"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Icon icon={FaStethoscope} className="text-4xl text-blue-500" />
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Diabetes Prediction
          </motion.h1>
        </div>

        <motion.p
          variants={itemVariants}
          className="text-lg text-white/80"
        >
          Enter your health metrics below for diabetes risk assessment
        </motion.p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Input Methods */}
        <div className="flex flex-col gap-6">
          {/* Tab Buttons */}
          <div className="flex justify-between gap-4 mb-2">
            <motion.button
              variants={itemVariants}
              onClick={() => setActiveTab('form')}
              className={`w-full px-4 py-2 rounded-xl font-medium text-base transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'form' ? 'text-white' : 'text-white/60 hover:text-white/80'}`}
              style={{
                background: activeTab === 'form' ? `linear-gradient(135deg, ${themeColor}, ${darkenColor(themeColor, 40)})` : 'rgba(255, 255, 255, 0.05)',
                boxShadow: activeTab === 'form' ? `0 4px 20px ${themeColor}30` : 'none'
              }}
            >
              <FaKeyboard className="text-sm" />
              Manual Entry
            </motion.button>

            <motion.button
              variants={itemVariants}
              onClick={() => setActiveTab('image')}
              className={`w-full px-4 py-2 rounded-xl font-medium text-base transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'image' ? 'text-white' : 'text-white/60 hover:text-white/80'}`}
              style={{
                background: activeTab === 'image' ? `linear-gradient(135deg, ${themeColor}, ${darkenColor(themeColor, 40)})` : 'rgba(255, 255, 255, 0.05)',
                boxShadow: activeTab === 'image' ? `0 4px 20px ${themeColor}30` : 'none'
              }}
            >
              <FaImage className="text-sm" />
              Image Analysis
            </motion.button>
          </div>

          {/* Manual Entry Form */}
          {activeTab === 'form' && (
            <motion.div
              variants={itemVariants}
              className="glass p-6 rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10"
            >
              <div className="flex items-start gap-3 mb-4">
                <Icon icon={FaSearch} className="text-2xl text-blue-500 shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">Health Metrics</h2>
                  <p className="text-white/60 text-sm">Enter your health information below</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Number of Pregnancies</label>
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
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Glucose Level (mg/dL)</label>
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
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Blood Pressure (mm Hg)</label>
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
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Skin Thickness (mm)</label>
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
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Insulin Level (mu U/ml)</label>
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
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">BMI (kg/m²)</label>
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
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Diabetes Pedigree Function</label>
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
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Age</label>
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
          )}

          {/* Image Upload Component */}
          {activeTab === 'image' && (
            <ImageUpload 
              diseaseType="diabetes" 
              onPredictionResult={(result) => {
                if ('analysis' in result) {
                  // This is an image analysis result
                  setImageAnalysis(result.analysis);
                  // Clear any previous prediction when showing image analysis
                  setPrediction(null);
                } else {
                  // This is a regular prediction result
                  setPrediction(result as PredictionResult);
                }
              }} 
              setIsLoading={setIsLoading} 
            />
          )}
        </div>

        {/* Right Column - Results */}
        <AnimatePresence>
          {activeTab === 'image' ? (
            // IMAGE ANALYSIS TAB RESULTS
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-6 rounded-2xl h-full max-h-[calc(100vh-180px)] backdrop-blur-lg bg-black/30 border border-white/10 overflow-y-auto custom-scrollbar"
            >
              {/* Show loading animation during analysis */}
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-6"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full"></div>
                    <motion.div 
                      className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
                    ></motion.div>
                  </div>
                  <div>
                    <p className="text-xl text-white/80 mb-2">Analyzing Image</p>
                    <p className="text-sm text-white/60">
                      Please wait while we process your image...
                    </p>
                  </div>
                  <motion.div 
                    className="w-48 h-1 bg-blue-500/20 rounded-full overflow-hidden"
                  >
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    ></motion.div>
                  </motion.div>
                </motion.div>
              ) : imageAnalysis ? (
                <AnalysisResult analysis={imageAnalysis} diseaseType="diabetes" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <Icon icon={FaImage} className="text-4xl text-blue-500/50" />
                  <div>
                    <p className="text-xl text-white/60 mb-2">No Image Analysis Yet</p>
                    <p className="text-sm text-white/40">
                      Upload an image and click analyze to see results
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            // MANUAL ENTRY TAB RESULTS
            prediction ? (
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
                    <p className="text-white font-semibold text-lg pl-7">
                      {(prediction?.probability * 100).toFixed(2)}%
                    </p>
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
                    Fill in the health metrics and click predict to see results
                  </p>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}