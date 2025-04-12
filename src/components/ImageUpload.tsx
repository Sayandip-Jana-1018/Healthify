'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaImage, FaTrash } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';
import { darkenColor } from '@/context/ThemeContext';
import Image from 'next/image';

interface ImageUploadProps {
  diseaseType: string;
  onPredictionResult: (result: any) => void;
  setIsLoading: (loading: boolean) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  diseaseType, 
  onPredictionResult,
  setIsLoading: setParentLoading
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { themeColor } = useTheme();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please upload an image file (jpg, png, etc.)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setError(null);
    setImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setParentLoading(true);
    setError(null);

    try {
      // Add a slight delay for better UX with loading animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const formData = new FormData();
      formData.append('file', image);

      const response = await fetch(`http://localhost:8000/image/${diseaseType}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Image processing failed');
      }

      const result = await response.json();
      onPredictionResult(result);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      // Add a slight delay before removing loading state for smoother transition
      setTimeout(() => {
        setIsLoading(false);
        setParentLoading(false);
      }, 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="glass p-6 rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FaImage className="text-blue-500" />
          Image Analysis
        </h3>
        
        <div 
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
            dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-white/40'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative">
              <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-4">
                <Image 
                  src={preview} 
                  alt="Preview" 
                  fill
                  className="object-contain"
                />
              </div>
              <button 
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition-all"
              >
                <FaTrash size={14} />
              </button>
              <p className="text-white/60 text-sm mb-4 truncate">
                {image?.name} ({image ? Math.round(image.size / 1024) : 0} KB)              </p>
            </div>
          ) : (
            <>
              <FaCloudUploadAlt className="mx-auto text-4xl text-blue-500 mb-2" />
              <p className="text-white mb-2">Drag & drop an image or click to browse</p>
              <p className="text-white/60 text-sm">
                Supported formats: JPG, PNG, JPEG (Max: 5MB)
              </p>
            </>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            accept="image/*"
          />
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          disabled={!image || isLoading}
          className={`w-full mt-4 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 relative overflow-hidden ${
            !image || isLoading ? 'opacity-80 cursor-not-allowed' : ''
          }`}
          style={{
            background: `linear-gradient(135deg, ${themeColor}, ${darkenColor(themeColor, 40)})`,
            boxShadow: `0 4px 20px ${themeColor}30`
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </div>
          ) : (
            <span>Analyze Image</span>
          )}
          {isLoading && (
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-white/30"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ImageUpload;
