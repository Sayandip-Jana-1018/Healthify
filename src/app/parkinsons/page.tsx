'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import { FaStethoscope, FaPercent, FaInfoCircle, FaShieldAlt, FaDatabase, FaQuestionCircle } from 'react-icons/fa';
import { AnimatedContainer, AnimatedHeading, AnimatedParagraph } from '@/components/AnimatedContainer';
import { getRandomParkinsonsData } from '@/utils/sampleData';
import TabView from '@/components/TabView';
import NotebookViewer from '@/components/NoteViewer';

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

interface FormData {
  fo: string;
  fhi: string;
  flo: string;
  jitter_percent: string;
  jitter_abs: string;
  rap: string;
  ppq: string;
  ddp: string;
  shimmer: string;
  shimmer_db: string;
  apq3: string;
  apq5: string;
  apq: string;
  dda: string;
  nhr: string;
  hnr: string;
  rpde: string;
  dfa: string;
  spread1: string;
  spread2: string;
  d2: string;
  ppe: string;
}

interface PredictionResult {
  prediction: boolean;
  probability: number;
  risk_level?: string;
}

// Field descriptions for Parkinson's disease inputs
const fieldDescriptions = {
  fo: "Average vocal fundamental frequency (Hz)",
  fhi: "Maximum vocal fundamental frequency (Hz)",
  flo: "Minimum vocal fundamental frequency (Hz)",
  jitter_percent: "Frequency perturbation (%)",
  jitter_abs: "Absolute jitter in microseconds",
  rap: "Relative amplitude perturbation",
  ppq: "Five-point period perturbation quotient",
  ddp: "Average absolute difference of differences between jitter cycles",
  shimmer: "Amplitude perturbation (%)",
  shimmer_db: "Shimmer in decibels (dB)",
  apq3: "Three-point amplitude perturbation quotient",
  apq5: "Five-point amplitude perturbation quotient",
  apq: "Eleven-point amplitude perturbation quotient",
  dda: "Average absolute differences between consecutive differences",
  nhr: "Noise to harmonics ratio",
  hnr: "Harmonics to noise ratio",
  rpde: "Recurrence period density entropy measure",
  dfa: "Signal fractal scaling exponent",
  spread1: "Nonlinear measure of fundamental frequency variation",
  spread2: "Nonlinear measure of fundamental frequency variation",
  d2: "Correlation dimension",
  ppe: "Pitch period entropy"
};

// Parkinson's disease visualizations for the notebook tab
const parkinsonsVisualizations = [
  {
    title: 'Voice Frequency Variation in Parkinson\'s Disease',
    type: 'box' as const,
    data: [
      {
        y: Array.from({ length: 100 }, (_, i) => 100 + Math.random() * 50),
        type: 'box',
        name: 'Healthy',
        marker: { color: 'rgba(100, 149, 237, 0.7)' }
      },
      {
        y: Array.from({ length: 100 }, (_, i) => 80 + Math.random() * 40),
        type: 'box',
        name: 'Parkinson\'s',
        marker: { color: 'rgba(255, 99, 132, 0.7)' }
      }
    ],
    layout: {
      title: 'Voice Frequency Variation',
      yaxis: { title: 'Frequency (Hz)' }
    },
    description: 'Box plots showing the difference in voice frequency variation between healthy individuals and those with Parkinson\'s disease. Reduced variation is a key indicator of Parkinson\'s.'
  },
  {
    title: 'Shimmer and Jitter in Voice Analysis',
    type: 'scatter' as const,
    data: [
      {
        x: Array.from({ length: 50 }, (_, i) => 0.01 + Math.random() * 0.02),
        y: Array.from({ length: 50 }, (_, i) => 0.02 + Math.random() * 0.03),
        mode: 'markers',
        type: 'scatter',
        name: 'Healthy',
        marker: {
          color: 'rgba(100, 149, 237, 0.7)',
          size: 10
        }
      },
      {
        x: Array.from({ length: 50 }, (_, i) => 0.03 + Math.random() * 0.04),
        y: Array.from({ length: 50 }, (_, i) => 0.05 + Math.random() * 0.05),
        mode: 'markers',
        type: 'scatter',
        name: 'Parkinson\'s',
        marker: {
          color: 'rgba(255, 99, 132, 0.7)',
          size: 10
        }
      }
    ],
    layout: {
      title: 'Shimmer vs. Jitter',
      xaxis: { title: 'Jitter (%)' },
      yaxis: { title: 'Shimmer (%)' },
      legend: { x: 0.1, y: 1 }
    },
    description: 'Scatter plot showing the relationship between shimmer and jitter in voice recordings. Parkinson\'s patients typically show higher values for both measures, indicating voice instability.'
  },
  {
    title: 'Feature Importance for Parkinson\'s Disease Prediction',
    type: 'bar' as const,
    data: [
      {
        y: ['MDVP:Shimmer', 'MDVP:Jitter(%)', 'NHR', 'HNR', 'RPDE', 'DFA', 'PPE', 'Spread1'],
        x: [0.23, 0.19, 0.15, 0.12, 0.10, 0.09, 0.07, 0.05],
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
    description: 'Relative importance of different voice features in predicting Parkinson\'s disease, with shimmer and jitter being the most significant predictors.'
  },
  {
    title: 'Voice Measurements Distribution',
    type: 'histogram' as const,
    data: [
      {
        x: Array.from({ length: 100 }, (_, i) => 19 + Math.random() * 4),
        type: 'histogram',
        marker: {
          color: 'rgba(100, 149, 237, 0.7)',
          line: {
            color: 'rgba(100, 149, 237, 1)',
            width: 1
          }
        },
        opacity: 0.75,
        name: 'Healthy'
      },
      {
        x: Array.from({ length: 100 }, (_, i) => 16 + Math.random() * 5),
        type: 'histogram',
        marker: {
          color: 'rgba(255, 99, 132, 0.7)',
          line: {
            color: 'rgba(255, 99, 132, 1)',
            width: 1
          }
        },
        opacity: 0.75,
        name: 'Parkinson\'s'
      }
    ],
    layout: {
      title: 'Harmonics-to-Noise Ratio (HNR)',
      xaxis: { title: 'HNR Value (dB)' },
      yaxis: { title: 'Count' },
      barmode: 'overlay',
      legend: { x: 0.1, y: 1 }
    },
    description: 'Distribution of Harmonics-to-Noise Ratio (HNR) values in healthy individuals versus those with Parkinson\'s disease. Lower HNR values are associated with Parkinson\'s.'
  }
];

export default function ParkinsonsPage() {
  const { themeColor } = useTheme();
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data with empty strings
  const [formData, setFormData] = useState<FormData>({
    fo: '',
    fhi: '',
    flo: '',
    jitter_percent: '',
    jitter_abs: '',
    rap: '',
    ppq: '',
    ddp: '',
    shimmer: '',
    shimmer_db: '',
    apq3: '',
    apq5: '',
    apq: '',
    dda: '',
    nhr: '',
    hnr: '',
    rpde: '',
    dfa: '',
    spread1: '',
    spread2: '',
    d2: '',
    ppe: ''
  });

  const handleSampleData = () => {
    const data = getRandomParkinsonsData();
    setFormData({
      fo: data.Fo,
      fhi: data.Fhi,
      flo: data.Flo,
      jitter_percent: data.jitterPercent,
      jitter_abs: data.jitterAbs,
      rap: data.RAP,
      ppq: data.PPQ,
      ddp: data.DDP,
      shimmer: data.Shimmer,
      shimmer_db: data.shimmerDb,
      apq3: data.APQ3,
      apq5: data.APQ5,
      apq: data.APQ,
      dda: data.DDA,
      nhr: data.NHR,
      hnr: data.HNR,
      rpde: data.RPDE,
      dfa: data.DFA,
      spread1: data.spread1,
      spread2: data.spread2,
      d2: data.D2,
      ppe: data.PPE
    });
  };

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert all form values to numbers
      const numericFormData = Object.entries(formData).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: parseFloat(value)
      }), {});

      const response = await fetch('http://localhost:8001/predict/parkinsons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numericFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      setError('Failed to get prediction. Please make sure all fields are filled correctly.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Input field definitions with proper typing
  const inputFields: Array<{ key: keyof FormData; label: string }> = [
    { key: 'fo', label: 'Average Vocal Fundamental Frequency' },
    { key: 'fhi', label: 'Maximum Vocal Fundamental Frequency' },
    { key: 'flo', label: 'Minimum Vocal Fundamental Frequency' },
    { key: 'jitter_percent', label: 'Frequency Perturbation (%)' },
    { key: 'jitter_abs', label: 'Absolute Jitter' },
    { key: 'rap', label: 'Relative Average Perturbation' },
    { key: 'ppq', label: 'Period Perturbation Quotient' },
    { key: 'ddp', label: 'Detrended Fluctuation Analysis' },
    { key: 'shimmer', label: 'Amplitude Perturbation' },
    { key: 'shimmer_db', label: 'Shimmer in Decibels' },
    { key: 'apq3', label: 'Shimmer in Apq3' },
    { key: 'apq5', label: 'Shimmer in Apq5' },
    { key: 'apq', label: 'Amplitude Perturbation Quotient' },
    { key: 'dda', label: 'Detrended Fluctuation Analysis' },
    { key: 'nhr', label: 'Noise-to-Harmonics Ratio' },
    { key: 'hnr', label: 'Harmonics-to-Noise Ratio' },
    { key: 'rpde', label: 'Recurrence Period Density Entropy' },
    { key: 'dfa', label: 'Detrended Fluctuation Analysis' },
    { key: 'spread1', label: 'Frequency Variation' },
    { key: 'spread2', label: 'Frequency Spread' },
    { key: 'd2', label: 'Correlation Dimension' },
    { key: 'ppe', label: 'Pitch Period Entropy' },
  ];

  // Content for the model tab
  const ModelContent = (
    <div className="min-h-screen">
      <AnimatedContainer
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto py-8 px-4"
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaStethoscope className="text-4xl text-blue-500" />
            <AnimatedHeading
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-white text-center"
            >
              Parkinsons Disease Prediction
            </AnimatedHeading>
          </div>

          <AnimatedParagraph
            variants={itemVariants}
            className="text-lg text-white/80 text-center"
          >
            Enter voice measurements below for Parkinsons disease risk assessment
          </AnimatedParagraph>
        </div>

        <AnimatedContainer
          variants={itemVariants}
          className="relative w-full aspect-[16/9] mb-8 rounded-2xl overflow-hidden max-w-4xl mx-auto"
        >
          <Image
            src="/images/parkinson.jpg"
            alt="Parkinsons Disease"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom, transparent, ${darkenColor(themeColor, 100)})`
            }}
          >

          </div>
        </AnimatedContainer>

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

        <AnimatedContainer variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {inputFields.map(({ key, label }, index) => (
            <div key={index} className="form-group">
              <label className="block text-sm font-medium mb-2 text-center">
                {label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={formData[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-center placeholder-white/30"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                <div className="absolute right-3 top-3 text-gray-400 cursor-pointer group">
                  <FaQuestionCircle />
                  <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                    {fieldDescriptions[key]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </AnimatedContainer>

        <AnimatedContainer variants={itemVariants} className="mt-8 flex justify-center">
          <button
            onClick={handlePredict}
            disabled={isLoading}
            style={{
              background: `linear-gradient(135deg, ${themeColor}, ${darkenColor(themeColor, 40)})`,
              boxShadow: `0 4px 20px ${themeColor}30`
            }}
            className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                Predicting...
              </>
            ) : (
              <>
                <FaStethoscope className="text-lg" />
                Predict
              </>
            )}
          </button>
        </AnimatedContainer>

        {error && (
          <AnimatedContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-center max-w-4xl mx-auto"
          >
            {error}
          </AnimatedContainer>
        )}

        {prediction && (
          <AnimatedContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-4 mb-6 text-center">
                <FaInfoCircle className="text-3xl text-blue-500" />
                <div>
                  <h2 className="text-2xl font-semibold text-white">Prediction Result</h2>
                  <p className="text-white/60">Based on voice measurements</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl bg-white/5 flex flex-col items-center text-center">
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <FaShieldAlt className="text-3xl text-blue-500" />
                    <div>
                      <h3 className="text-lg font-medium text-white">Diagnosis</h3>
                      <p className="text-white/60 text-sm">AI-powered assessment</p>
                    </div>
                  </div>
                  <p className={`text-2xl font-bold mt-4 ${
                    prediction.probability >= 0.5 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {prediction.probability >= 0.5 ? 'High risk of Parkinsons disease detected' : 'Low risk of Parkinsons disease detected'}
                  </p>
                  <p className="text-lg mb-4">
                    {prediction.probability >= 0.5
                      ? "High risk of Parkinson's disease detected. Please consult a healthcare provider."
                      : "Low risk of Parkinson's disease detected. Continue monitoring your health."}
                  </p>
                </div>

                <div className="glass p-6 rounded-2xl bg-white/5 flex flex-col items-center text-center">
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <FaPercent className="text-3xl text-blue-500" />
                    <div>
                      <h3 className="text-lg font-medium text-white">Probability</h3>
                      <p className="text-white/60 text-sm">Confidence level</p>
                    </div>
                  </div>
                  <div className="relative w-32 h-32 mt-4">
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
                        className={prediction.probability >= 0.5 ? "text-red-500" : "text-green-500"}
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
                      <span className={`text-3xl font-bold ${prediction.probability >= 0.5 ? "text-red-500" : "text-green-500"}`}>
                        {(prediction.probability * 100).toFixed(1)}%
                      </span>
                      <span className="block text-sm text-gray-400">Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContainer>
        )}
      </AnimatedContainer>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Parkinson's Disease Analysis</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Data visualizations and model development for Parkinson's disease prediction
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10 h-[calc(100vh-120px)] min-h-[1230px] overflow-hidden">
          <NotebookViewer 
            notebookPath="/api/notebooks/parkinsons_analysis.ipynb" 
            visualizations={parkinsonsVisualizations}
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
