'use client';

import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

interface FormField {
  name: string;
  label: string;
  type: 'number' | 'text';
  min?: number;
  max?: number;
  step?: number;
  icon?: string;
  hint?: string;
}

interface PredictionFormProps {
  fields: FormField[];
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export default function PredictionForm({ fields, onSubmit, loading }: PredictionFormProps) {
  const formId = useId();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const getFieldError = (field: FormField) => {
    if (!touched[field.name]) return null;
    const value = formData[field.name];
    
    if (value === '' || value === undefined) {
      return 'This field is required';
    }
    if (field.min !== undefined && value < field.min) {
      return `Minimum value is ${field.min}`;
    }
    if (field.max !== undefined && value > field.max) {
      return `Maximum value is ${field.max}`;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id={formId}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => {
          const error = getFieldError(field);
          return (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-lg bg-white/5 p-4 rounded-lg border border-white/10"
            >
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                {field.icon && <span className="text-xl">{field.icon}</span>}
                {field.label}
                {field.hint && (
                  <span className="text-xs text-white/40">({field.hint})</span>
                )}
              </label>
              <input
                type={field.type}
                min={field.min}
                max={field.max}
                step={field.step}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={`w-full bg-black/20 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? 'border-red-500' : 'border-white/10'
                }`}
                required
              />
              {error && (
                <p className="mt-1 text-xs text-red-400">{error}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium
                   hover:from-blue-600 hover:to-purple-700 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Processing...
            </>
          ) : (
            'Predict'
          )}
        </button>
      </div>
    </form>
  );
}
