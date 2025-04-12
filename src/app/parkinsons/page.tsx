'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import { FaStethoscope, FaPercent, FaInfoCircle, FaShieldAlt, FaDatabase } from 'react-icons/fa';
import { AnimatedContainer, AnimatedHeading, AnimatedParagraph } from '@/components/AnimatedContainer';
import { getRandomParkinsonsData } from '@/utils/sampleData';

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
}

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

      const response = await fetch('http://localhost:8000/predict/parkinsons', {
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

  return (
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
        {inputFields.map(({ key, label }) => (
          <div key={key} className="form-group bg-black/20 p-4 rounded-xl backdrop-blur-md">
            <label className="block text-sm font-medium mb-3 text-center text-white/90">
              {label}
            </label>
            <input
              type="number"
              step="any"
              value={formData[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-center placeholder-white/30"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
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
                <p className="text-2xl font-bold text-blue-500 mt-4">
                  <span className="text-3xl font-bold text-red-500">{(prediction.probability * 100).toFixed(1)}%</span>
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      )}
    </AnimatedContainer>
  );
}
