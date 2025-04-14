'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { IconType } from 'react-icons';
import { FaDatabase, FaHeartbeat, FaStethoscope, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import { getRandomKidneyData } from '@/utils/sampleData';
import TabView from '@/components/TabView';
import NotebookViewer from '@/components/NoteViewer';

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

interface KidneyFormData {
  age: string;
  bp: string;
  sg: string;
  al: string;
  su: string;
  rbc: "normal" | "abnormal";
  pc: "normal" | "abnormal";
  pcc: "present" | "notpresent";
  ba: "present" | "notpresent";
  bgr: string;
  bu: string;
  sc: string;
  sod: string;
  pot: string;
  hemo: string;
  pcv: string;
  wc: string;
  rc: string;
  htn: "yes" | "no";
  dm: "yes" | "no";
  cad: "yes" | "no";
  appet: "good" | "poor";
  pe: "yes" | "no";
  ane: "yes" | "no";
}

interface KidneyPredictionData {
  age: number;
  bp: number;
  sg: number;
  al: number;
  su: number;
  rbc: "normal" | "abnormal";
  pc: "normal" | "abnormal";
  pcc: "present" | "notpresent";
  ba: "present" | "notpresent";
  bgr: number;
  bu: number;
  sc: number;
  sod: number;
  pot: number;
  hemo: number;
  pcv: number;
  wc: number;
  rc: number;
  htn: "yes" | "no";
  dm: "yes" | "no";
  cad: "yes" | "no";
  appet: "good" | "poor";
  pe: "yes" | "no";
  ane: "yes" | "no";
}

interface PredictionResult {
  prediction: boolean;
  risk_level: string;
  probability: number;
}

// Field descriptions for kidney disease inputs
const fieldDescriptions = {
  age: "Patient's age in years",
  bp: "Blood Pressure in mm/Hg (normal range: 90-120/60-80)",
  sg: "Specific Gravity - density of urine relative to water (normal range: 1.005-1.030)",
  al: "Albumin level in urine (0-5 scale, 0 being normal)",
  su: "Sugar level in urine (0-5 scale, 0 being normal)",
  rbc: "Red Blood Cells in urine (normal or abnormal)",
  pc: "Pus Cell presence in urine (normal or abnormal)",
  pcc: "Pus Cell clumps in urine (present or not present)",
  ba: "Bacteria presence in urine (present or not present)",
  bgr: "Blood Glucose Random in mgs/dl (normal range: 80-140 mg/dL)",
  bu: "Blood Urea in mgs/dl (normal range: 7-20 mg/dL)",
  sc: "Serum Creatinine in mgs/dl (normal range: 0.7-1.3 mg/dL)",
  sod: "Sodium level in mEq/L (normal range: 135-145 mEq/L)",
  pot: "Potassium level in mEq/L (normal range: 3.5-5.0 mEq/L)",
  hemo: "Hemoglobin level in gms (normal range: 12-17 g/dL for men, 11.5-15.5 g/dL for women)",
  pcv: "Packed Cell Volume percentage (normal range: 40-50% for men, 36-44% for women)",
  wc: "White Blood Cell count in cells/cumm (normal range: 4,500-11,000 cells/cumm)",
  rc: "Red Blood Cell count in millions/cmm (normal range: 4.5-5.9 for men, 4.1-5.1 for women)",
  htn: "Hypertension history (yes or no)",
  dm: "Diabetes Mellitus history (yes or no)",
  cad: "Coronary Artery Disease history (yes or no)",
  appet: "Appetite (good or poor)",
  pe: "Pedal Edema - swelling in the feet (yes or no)",
  ane: "Anemia (yes or no)"
};

export default function KidneyPage() {
  const [formData, setFormData] = useState<KidneyFormData>({
    age: '',
    bp: '',
    sg: '',
    al: '',
    su: '',
    rbc: 'normal',
    pc: 'normal',
    pcc: 'notpresent',
    ba: 'notpresent',
    bgr: '',
    bu: '',
    sc: '',
    sod: '',
    pot: '',
    hemo: '',
    pcv: '',
    wc: '',
    rc: '',
    htn: 'no',
    dm: 'no',
    cad: 'no',
    appet: 'good',
    pe: 'no',
    ane: 'no'
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { theme } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert numeric fields to numbers and keep categorical fields as strings
      const numericFields = [
        'age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 
        'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc'
      ];

      // Create a new object with transformed values
      const transformedData = Object.entries(formData).reduce((acc, [key, value]) => {
        const transformedValue = numericFields.includes(key) 
          ? (value === '' ? 0 : Number(value))
          : value;
        return { ...acc, [key]: transformedValue };
      }, {} as KidneyPredictionData);

      console.log('Form data:', formData);
      console.log('Transformed data:', transformedData);
      console.log('Sending data to API:', JSON.stringify(transformedData, null, 2));

      const response = await fetch('http://localhost:8001/predict/kidney', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error('API error:', errorData);
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
    const data = getRandomKidneyData();
    const typedData: KidneyFormData = {
      ...data,
      rbc: data.rbc as "normal" | "abnormal",
      pc: data.pc as "normal" | "abnormal",
      pcc: data.pcc as "present" | "notpresent",
      ba: data.ba as "present" | "notpresent",
      htn: data.htn as "yes" | "no",
      dm: data.dm as "yes" | "no",
      cad: data.cad as "yes" | "no",
      appet: data.appet as "good" | "poor",
      pe: data.pe as "yes" | "no",
      ane: data.ane as "yes" | "no"
    };
    setFormData(typedData);
  };

  const inputGroups = [
    {
      title: 'Basic Information',
      fields: [
        { name: 'age', label: 'Age', type: 'number' },
        { name: 'bp', label: 'Blood Pressure', type: 'number' },
        { name: 'sg', label: 'Specific Gravity', type: 'number', step: '0.001' },
        { name: 'al', label: 'Albumin', type: 'number' },
        { name: 'su', label: 'Sugar', type: 'number' }
      ]
    },
    {
      title: 'Blood Tests',
      fields: [
        { name: 'bgr', label: 'Blood Glucose Random', type: 'number' },
        { name: 'bu', label: 'Blood Urea', type: 'number' },
        { name: 'sc', label: 'Serum Creatinine', type: 'number', step: '0.1' },
        { name: 'sod', label: 'Sodium', type: 'number' },
        { name: 'pot', label: 'Potassium', type: 'number', step: '0.1' },
        { name: 'hemo', label: 'Hemoglobin', type: 'number', step: '0.1' },
        { name: 'pcv', label: 'Packed Cell Volume', type: 'number' },
        { name: 'wc', label: 'White Blood Cell Count', type: 'number' },
        { name: 'rc', label: 'Red Blood Cell Count', type: 'number', step: '0.1' }
      ]
    }
  ];

  const selectGroups = [
    {
      title: 'Cell Analysis',
      fields: [
        { name: 'rbc', label: 'Red Blood Cells', options: ['normal', 'abnormal'] },
        { name: 'pc', label: 'Pus Cell', options: ['normal', 'abnormal'] },
        { name: 'pcc', label: 'Pus Cell Clumps', options: ['present', 'notpresent'] },
        { name: 'ba', label: 'Bacteria', options: ['present', 'notpresent'] }
      ]
    },
    {
      title: 'Medical Conditions',
      fields: [
        { name: 'htn', label: 'Hypertension', options: ['yes', 'no'] },
        { name: 'dm', label: 'Diabetes Mellitus', options: ['yes', 'no'] },
        { name: 'cad', label: 'Coronary Artery Disease', options: ['yes', 'no'] },
        { name: 'appet', label: 'Appetite', options: ['good', 'poor'] },
        { name: 'pe', label: 'Pedal Edema', options: ['yes', 'no'] },
        { name: 'ane', label: 'Anemia', options: ['yes', 'no'] }
      ]
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-red-500';
    if (probability >= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Define interactive visualizations with Plotly data
  const kidneyVisualizations = [
    {
      title: 'Blood Urea Nitrogen (BUN) Levels by CKD Status',
      type: 'box' as const,
      data: [
        {
          y: Array.from({ length: 100 }, (_, i) => 10 + Math.random() * 8),
          type: 'box',
          name: 'Healthy',
          marker: { color: 'rgba(100, 149, 237, 0.7)' }
        },
        {
          y: Array.from({ length: 100 }, (_, i) => 20 + Math.random() * 30),
          type: 'box',
          name: 'CKD',
          marker: { color: 'rgba(255, 99, 132, 0.7)' }
        }
      ],
      layout: {
        title: 'Blood Urea Nitrogen (BUN) Levels',
        yaxis: { title: 'BUN (mg/dL)' }
      },
      description: 'Box plots comparing Blood Urea Nitrogen (BUN) levels between healthy individuals and those with chronic kidney disease. Elevated BUN is a key indicator of kidney dysfunction.'
    },
    {
      title: 'Creatinine vs. Albumin Levels',
      type: 'scatter' as const,
      data: [
        {
          x: Array.from({ length: 50 }, (_, i) => 0.5 + Math.random() * 0.5),
          y: Array.from({ length: 50 }, (_, i) => 3.5 + Math.random() * 1),
          mode: 'markers',
          type: 'scatter',
          name: 'Healthy',
          marker: {
            color: 'rgba(100, 149, 237, 0.7)',
            size: 10
          }
        },
        {
          x: Array.from({ length: 50 }, (_, i) => 1.2 + Math.random() * 5),
          y: Array.from({ length: 50 }, (_, i) => 2 + Math.random() * 2),
          mode: 'markers',
          type: 'scatter',
          name: 'CKD',
          marker: {
            color: 'rgba(255, 99, 132, 0.7)',
            size: 10
          }
        }
      ],
      layout: {
        title: 'Creatinine vs. Albumin',
        xaxis: { title: 'Creatinine (mg/dL)' },
        yaxis: { title: 'Albumin (g/dL)' },
        legend: { x: 0.1, y: 1 }
      },
      description: 'Scatter plot showing the relationship between serum creatinine and albumin levels. CKD patients typically have higher creatinine and lower albumin levels.'
    },
    {
      title: 'Feature Importance for CKD Prediction',
      type: 'bar' as const,
      data: [
        {
          y: ['Serum Creatinine', 'Blood Urea', 'Hemoglobin', 'Albumin', 'Specific Gravity', 'White Blood Cells', 'Red Blood Cells', 'Hypertension'],
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
        yaxis: { title: 'Feature' },
        margin: { l: 150, r: 40, t: 50, b: 50 }
      },
      description: 'Relative importance of different clinical features in predicting chronic kidney disease, with serum creatinine and blood urea being the most significant predictors.'
    },
    {
      title: 'Hemoglobin Distribution by CKD Status',
      type: 'histogram' as const,
      data: [
        {
          x: Array.from({ length: 100 }, (_, i) => 12 + Math.random() * 3),
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
          x: Array.from({ length: 100 }, (_, i) => 8 + Math.random() * 4),
          type: 'histogram',
          marker: {
            color: 'rgba(255, 99, 132, 0.7)',
            line: {
              color: 'rgba(255, 99, 132, 1)',
              width: 1
            }
          },
          opacity: 0.75,
          name: 'CKD'
        }
      ],
      layout: {
        title: 'Hemoglobin Distribution',
        xaxis: { title: 'Hemoglobin (g/dL)' },
        yaxis: { title: 'Count' },
        barmode: 'overlay',
        legend: { x: 0.1, y: 1 }
      },
      description: 'Distribution of hemoglobin levels in healthy individuals versus those with chronic kidney disease. Lower hemoglobin levels (anemia) are commonly associated with CKD.'
    }
  ];

  // Content for the model tab
  const ModelContent = (
    <div className="min-h-screen">
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Kidney Disease Risk Assessment
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Enter your health information below to assess your risk of kidney disease.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative w-full aspect-[21/9] mb-8 rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/h.png"
              alt="Kidney Disease Assessment"
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
            {/* Numeric Input Groups */}
            {inputGroups.map((group, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-lg font-semibold text-white text-center">{group.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.fields.map((field) => (
                    <div key={field.name} className="relative">
                      <label className="block text-sm font-medium mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        step={field.step}
                        name={field.name}
                        value={formData[field.name as keyof KidneyFormData]}
                        onChange={handleInputChange}
                        placeholder={field.label}
                        className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-gray-400 text-center"
                        required
                      />
                      <div className="absolute right-3 top-2 text-gray-400 cursor-pointer group">
                        <FaQuestionCircle />
                        <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                          {fieldDescriptions[field.name as keyof typeof fieldDescriptions]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Select Input Groups */}
            {selectGroups.map((group, idx) => (
              <div key={idx} className="space-y-4 relative">
                <h3 className="text-lg font-semibold text-white text-center">{group.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.fields.map((field) => (
                    <div key={field.name} className="relative">
                      <label className="block text-sm font-medium mb-2">{field.label}</label>
                      <select
                        name={field.name}
                        value={formData[field.name as keyof KidneyFormData]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded bg-white/5 backdrop-blur-md border border-white/10 text-white text-center
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                        hover:bg-white/10 transition-all duration-200
                        appearance-none cursor-pointer
                        bg-gradient-to-b from-white/10 to-transparent"
                      >
                        {field.options?.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-gray-900 text-white"
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-8 top-2 text-gray-400 cursor-pointer group">
                        <FaQuestionCircle />
                        <div className="hidden group-hover:block absolute right-0 top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                          {fieldDescriptions[field.name as keyof typeof fieldDescriptions]}
                        </div>
                      </div>
                    </div>
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
                className="mt-8 p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Probability Circle */}
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
                          strokeWidth="10"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={prediction.probability >= 70 ? '#EF4444' : prediction.probability >= 30 ? '#F59E0B' : '#10B981'}
                          strokeWidth="10"
                          strokeDasharray={`${prediction.probability * 2.83} ${283 - prediction.probability * 2.83}`}
                          strokeDashoffset="70"
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${getProbabilityColor(prediction.probability)}`}>
                          {prediction.probability}%
                        </span>
                        <span className="text-gray-400 mt-1">Probability</span>
                      </div>
                    </div>
                  </div>

                  {/* Prediction Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-gray-400 text-sm mb-2">Prediction</h3>
                      <div className={`text-2xl font-semibold p-3 rounded-lg ${prediction.prediction ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {prediction.prediction ? 'Positive' : 'Negative'}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-gray-400 text-sm mb-2">Risk Level</h3>
                      <div className={`text-2xl font-semibold p-3 rounded-lg ${getRiskColor(prediction.risk_level)}/20 text-${prediction.risk_level.toLowerCase() === 'high' ? 'red' : prediction.risk_level.toLowerCase() === 'medium' ? 'yellow' : 'green'}-400`}>
                        {prediction.risk_level}
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-gray-400">
                        {prediction.prediction 
                          ? "Based on the provided parameters, there might be a risk of kidney disease. Please consult with a healthcare professional for proper medical advice."
                          : "The parameters suggest lower risk, but always consult healthcare professionals for proper medical advice."}
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Kidney Disease Analysis</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Data visualizations and model development for kidney disease prediction
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10 h-[calc(100vh-120px)] min-h-[1230px] overflow-hidden">
          <NotebookViewer 
            notebookPath="/api/notebooks/kidney_disease_analysis.ipynb" 
            visualizations={kidneyVisualizations}
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
