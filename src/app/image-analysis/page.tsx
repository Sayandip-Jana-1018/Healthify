'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaStethoscope, FaPercent, FaInfoCircle, FaShieldAlt, FaSearch, FaImage, FaUpload, FaFilePdf, FaFileImage, FaFileMedical, FaQuestionCircle, FaExclamationTriangle, FaCheckCircle, FaXRay, FaBrain, FaLungs, FaWaveSquare, FaAllergies, FaFemale } from 'react-icons/fa';
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

interface ImageAnalysisResult {
  analysis: string;
  prediction?: string;
  probability?: number;
  disease_type?: string;
  recommendations?: string[];
  precautions?: string[];
}

export default function ImageAnalysisPage() {
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { themeColor } = useTheme();

  // Universal prompt for any medical image
  const universalPrompt = `Analyze this medical image and provide a comprehensive assessment. 
  
  First, identify what type of medical image this is (X-ray, MRI, CT scan, ultrasound, dermatological image, etc.) and what body part or condition it shows.
  
  Then, provide a detailed analysis with the following sections:
  
  1) Prediction: State whether the image shows positive or negative findings for any disease or abnormality.
  
  2) Confidence: Provide a percentage indicating your confidence level in the assessment.
  
  3) Disease Type: Specify the exact condition or disease identified, if any.
  
  4) Risk Level: Indicate the severity or risk level (Low, Moderate, High) based on the findings.
  
  5) Detailed Analysis: Provide a thorough description of all visible features, abnormalities, and diagnostic insights.
  
  6) Recommendations: Suggest appropriate next steps, further tests, or treatments.
  
  7) Precautions: List any precautions or lifestyle modifications that might be beneficial.
  
  8) Therapeutic Options: Briefly mention potential treatment approaches if applicable.
  
  Format your response clearly with these labeled sections. If you cannot determine something with confidence, state this clearly rather than making assumptions.`;

  // Handle the prediction result
  const handlePredictionResult = (result: any) => {
    if ('analysis' in result) {
      setImageAnalysis(result as ImageAnalysisResult);
    }
  };

  return (
    <div className="min-h-screen mx-auto max-w-9xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-6 flex flex-col h-screen"
      >
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">Medical Image Analysis</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Upload any medical image for AI-powered analysis and disease detection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow h-[calc(100vh-200px)]">
          {/* Left Column - Upload Section */}
          <motion.div variants={itemVariants} className="flex flex-col h-full">
            <div className="glass p-6 rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10 h-full flex flex-col">
              <div className="flex items-start gap-3 mb-6">
                <Icon icon={FaImage} className="text-2xl text-blue-500 shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">Image Analysis</h2>
                  <p className="text-white/60 text-sm">Upload any medical image for AI analysis</p>
                </div>
              </div>

              <div className="flex-grow overflow-auto custom-scrollbar pr-2 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                  <div className="flex gap-2 mb-2">
                    <FaInfoCircle className="text-blue-400 mt-1 shrink-0" />
                    <div>
                      <h3 className="text-white font-medium">Automatic Analysis</h3>
                      <p className="text-white/60 text-sm">
                        Our AI will automatically detect the type of medical image and provide a 
                        comprehensive analysis including disease identification, confidence level, risk 
                        assessment, detailed findings, recommendations, and therapeutic options.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <ImageUpload 
                    onPredictionResult={handlePredictionResult}
                    setIsLoading={setIsLoading}
                    customPrompt={universalPrompt}
                    diseaseType="general"
                  />
                </div>

                {/* Supported Medical Images - Always visible */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-white font-medium flex items-center gap-2 mb-3">
                    <FaCheckCircle className="text-blue-400" />
                    Supported Medical Images
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-white/70">
                      <FaXRay className="text-blue-400" />
                      X-Rays
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <FaBrain className="text-blue-400" />
                      MRI Scans
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <FaLungs className="text-blue-400" />
                      CT Scans
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <FaWaveSquare className="text-blue-400" />
                      Ultrasounds
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <FaAllergies className="text-blue-400" />
                      Skin Conditions
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <FaFemale className="text-blue-400" />
                      Mammograms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Results Section */}
          <motion.div variants={itemVariants} className="flex flex-col h-full overflow-y-auto">
            <div className="glass p-6 rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10 h-full flex flex-col">
              <div className="flex items-start gap-3 mb-6">
                <Icon icon={FaStethoscope} className="text-2xl text-blue-500 shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">Analysis Results</h2>
                  <p className="text-white/60 text-sm">AI-powered medical image interpretation</p>
                </div>
              </div>

              <div className="flex-grow overflow-auto custom-scrollbar pr-2">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-white/70 text-center">Analyzing your medical image...</p>
                    <p className="text-white/50 text-sm text-center mt-2">This may take a few moments</p>
                  </div>
                ) : imageAnalysis ? (
                  <AnalysisResult 
                    analysis={imageAnalysis.analysis} 
                    diseaseType="general"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                      <FaUpload className="text-blue-500/70 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Image Analyzed Yet</h3>
                    <p className="text-white/60 max-w-md">
                      Upload any medical image for AI-powered analysis and disease detection
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
