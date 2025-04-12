'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ChronicKidneyPage() {
  const [formData, setFormData] = useState({
    age: '',
    blood_pressure: '',
    specific_gravity: '',
    albumin: '',
    sugar: '',
    red_blood_cells: 'normal',
    pus_cell: 'normal',
    pus_cell_clumps: 'notpresent',
    bacteria: 'notpresent',
    blood_glucose_random: '',
    blood_urea: '',
    serum_creatinine: '',
    sodium: '',
    potassium: '',
    hemoglobin: '',
    packed_cell_volume: '',
    white_blood_cell_count: '',
    red_blood_cell_count: '',
    hypertension: 'no',
    diabetes_mellitus: 'no',
    coronary_artery_disease: 'no',
    appetite: 'good',
    pedal_edema: 'no',
    anemia: 'no'
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const response = await fetch('http://localhost:8000/predict/kidney', {
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

  const handleSampleData = () => {
    setFormData({
      age: '48',
      blood_pressure: '80',
      specific_gravity: '1.020',
      albumin: '1',
      sugar: '0',
      red_blood_cells: 'normal',
      pus_cell: 'normal',
      pus_cell_clumps: 'notpresent',
      bacteria: 'notpresent',
      blood_glucose_random: '121',
      blood_urea: '36',
      serum_creatinine: '1.2',
      sodium: '135',
      potassium: '4.2',
      hemoglobin: '15.4',
      packed_cell_volume: '44',
      white_blood_cell_count: '7800',
      red_blood_cell_count: '5.2',
      hypertension: 'yes',
      diabetes_mellitus: 'no',
      coronary_artery_disease: 'no',
      appetite: 'good',
      pedal_edema: 'no',
      anemia: 'no'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-8">Chronic Kidney Disease Prediction</h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 backdrop-blur-md bg-white/10 rounded-xl shadow-xl"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Numeric Inputs */}
                  <div className="space-y-4">
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Age"
                      className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-gray-400"
                      required
                    />
                    <input
                      type="number"
                      name="blood_pressure"
                      value={formData.blood_pressure}
                      onChange={handleInputChange}
                      placeholder="Blood Pressure"
                      className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-gray-400"
                      required
                    />
                    {/* Add other numeric inputs */}
                  </div>
                  
                  {/* Categorical Inputs */}
                  <div className="space-y-4">
                    <select
                      name="red_blood_cells"
                      value={formData.red_blood_cells}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 text-white"
                    >
                      <option value="normal">Normal RBC</option>
                      <option value="abnormal">Abnormal RBC</option>
                    </select>
                    {/* Add other categorical inputs */}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
                  >
                    {loading ? 'Predicting...' : 'Predict'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSampleData}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold transition-colors"
                  >
                    Sample Data
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Column - Results and Image */}
          <div className="space-y-6">
            <div className="relative h-64 w-full">
              <Image
                src="/images/h.png"
                alt="Kidney"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>

            {prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 backdrop-blur-md bg-white/10 rounded-xl shadow-xl"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#1a365d"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="10"
                          strokeDasharray={`${typeof prediction.probability === 'number' && !isNaN(prediction.probability) 
                            ? Math.round(prediction.probability * 100 * 2.83)
                            : 0} 283`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {typeof prediction.probability === 'number' && !isNaN(prediction.probability) 
                            ? `${Math.round(prediction.probability * 100)}%`
                            : '0%'}
                        </span>
                      </div>
                      <p className="text-center text-gray-300 mt-2">Risk Score</p>
                    </div>
                    <p className="text-center text-gray-300 mt-2">Probability</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5">
                      <p className="text-gray-400">Prediction</p>
                      <p className="text-xl font-semibold text-white">
                        {prediction.prediction ? 'Positive' : 'Negative'}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                      <p className="text-gray-400">Risk Level</p>
                      <p className="text-xl font-semibold text-white">
                        {prediction.risk_level}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
