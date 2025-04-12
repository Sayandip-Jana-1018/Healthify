'use client';

import { motion } from 'framer-motion';
import { FaInfoCircle, FaShieldAlt, FaChartPie, FaLightbulb, FaPercentage, FaExclamationTriangle, FaFileAlt, FaImage } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface AnalysisResultProps {
  analysis: string;
  diseaseType?: string;
}

// Create a wrapper component for icons
const Icon = ({ icon: IconComponent, className }: { icon: IconType; className?: string }) => {
  return <IconComponent className={className} />;
};

// Helper function to clean up text
const cleanText = (text: string): string => {
  // Remove markdown formatting characters like **, *, etc.
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold (**text**)
    .replace(/\*(.+?)\*/g, '$1')     // Remove italic (*text*)
    .replace(/\_\_(.+?)\_\_/g, '$1') // Remove underline (__text__)
    .replace(/\_(.+?)\_/g, '$1')     // Remove emphasis (_text_)
    .replace(/\+\+(.+?)\+\+/g, '$1') // Remove other formatting (++text++)
    .replace(/\~\~(.+?)\~\~/g, '$1'); // Remove strikethrough (~~text~~)
};

// Helper function to determine if diabetes is present based on analysis text
const hasDiabetes = (text: string): boolean => {
  // Check for positive indicators
  const positiveIndicators = [
    /diabetes\s+(?:is|:)?\s*positive/i,
    /diabetes\s+(?:is|:)?\s*present/i,
    /diabetic\s+condition\s+(?:is|:)?\s*confirmed/i,
    /likely\s+to\s+have\s+diabetes/i,
    /high\s+(?:risk|probability|likelihood)\s+of\s+diabetes/i,
    /diabetes\s+detected/i,
    /75%\s+likelihood\s+of\s+diabetes/i,
    /indicators\s+of\s+diabetes/i
  ];
  
  // Check for negative indicators
  const negativeIndicators = [
    /diabetes\s+(?:is|:)?\s*negative/i,
    /diabetes\s+(?:is|:)?\s*absent/i,
    /no\s+(?:signs|indicators)\s+of\s+diabetes/i,
    /diabetes\s+not\s+detected/i,
    /low\s+(?:risk|probability|likelihood)\s+of\s+diabetes/i
  ];
  
  // Check if any positive indicators are found
  for (const pattern of positiveIndicators) {
    if (pattern.test(text)) {
      return true;
    }
  }
  
  // Check if any negative indicators are found
  for (const pattern of negativeIndicators) {
    if (pattern.test(text)) {
      return false;
    }
  }
  
  // Default to checking for probability values
  const probMatch = text.match(/(?:probability|chance|likelihood|risk)\s*(?:of|:)?\s*([\d.]+)%?/i);
  if (probMatch) {
    const probability = parseFloat(probMatch[1]);
    return probability > 50; // If probability > 50%, consider it positive
  }
  
  // If no clear indicators, default to false
  return false;
};

// Extract metrics from analysis text
const extractMetrics = (text: string) => {
  const metrics: { [key: string]: string } = {};
  
  // Try to extract glucose level
  const glucoseMatch = text.match(/glucose\s*(?:level)?\s*(?:of|:)?\s*([\d.]+)/i);
  if (glucoseMatch) metrics.glucose = glucoseMatch[1];
  
  // Try to extract HbA1c
  const hba1cMatch = text.match(/(?:hba1c|a1c)\s*(?:of|:)?\s*([\d.]+)%?/i);
  if (hba1cMatch) metrics.hba1c = hba1cMatch[1];
  
  // Try to extract BMI
  const bmiMatch = text.match(/bmi\s*(?:of|:)?\s*([\d.]+)/i);
  if (bmiMatch) metrics.bmi = bmiMatch[1];
  
  // Try to extract blood pressure
  const bpMatch = text.match(/(?:blood pressure|bp)\s*(?:of|:)?\s*([\d/]+)/i);
  if (bpMatch) metrics.bloodPressure = bpMatch[1];
  
  // Try to extract diabetes status
  const diabetesMatch = text.match(/(?:diabetes|diabetic)\s*(?:status|condition)?\s*(?:is|:)?\s*(positive|negative|present|absent|detected|not detected)/i);
  if (diabetesMatch) metrics.diabetesStatus = diabetesMatch[1];
  
  // Try to extract probability
  const probMatch = text.match(/(?:probability|chance|likelihood|risk)\s*(?:of|:)?\s*([\d.]+)%?/i);
  if (probMatch) metrics.probability = probMatch[1];
  
  return metrics;
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, diseaseType }) => {
  // Clean up the analysis text
  const cleanedAnalysis = cleanText(analysis);
  
  // Check if the analysis is for a diabetes report
  const isDiabetesReport = diseaseType === 'diabetes' && 
    (cleanedAnalysis.toLowerCase().includes('report') || 
     cleanedAnalysis.toLowerCase().includes('medical document'));
  
  // Check if the analysis is for an unrelated image
  const isUnrelated = cleanedAnalysis.toLowerCase().includes('not related') || 
                      cleanedAnalysis.toLowerCase().includes('not a medical') ||
                      cleanedAnalysis.toLowerCase().includes('not show');
  
  // Extract metrics for diabetes reports
  const metrics = isDiabetesReport ? extractMetrics(cleanedAnalysis) : {};
  
  // Determine if diabetes is present based on the analysis
  const diabetesPresent = hasDiabetes(cleanedAnalysis);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-4 rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10 mt-3"
    >
      <div className="flex items-start gap-3 mb-3">
        <Icon 
          icon={isDiabetesReport ? FaFileAlt : FaImage} 
          className={`text-xl ${isUnrelated ? 'text-yellow-500' : 'text-blue-500'} shrink-0 mt-1`} 
        />
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {isDiabetesReport ? 'Report Analysis' : 'Image Analysis'}
          </h3>
          <p className="text-white/60 text-xs">
            {isDiabetesReport ? 'Analysis of medical document' : 'Detailed assessment based on image'}
          </p>
        </div>
      </div>

      {/* Prominent Diabetes Status Display */}
      {isDiabetesReport && (
        <div className={`glass p-4 rounded-xl mb-4 border ${hasDiabetes(cleanedAnalysis) ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasDiabetes(cleanedAnalysis) ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
              <Icon 
                icon={hasDiabetes(cleanedAnalysis) ? FaExclamationTriangle : FaShieldAlt} 
                className={`text-2xl ${hasDiabetes(cleanedAnalysis) ? 'text-red-400' : 'text-green-400'}`} 
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Diabetes Status: <span className={hasDiabetes(cleanedAnalysis) ? 'text-red-400' : 'text-green-400'}>
                  {hasDiabetes(cleanedAnalysis) ? 'Positive' : 'Negative'}
                </span>
              </h3>
              <p className="text-white/60 text-sm">
                {hasDiabetes(cleanedAnalysis) 
                  ? 'Indicators of diabetes detected in this report' 
                  : 'No clear indicators of diabetes in this report'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Show extracted metrics if it's a report */}
      {isDiabetesReport && Object.keys(metrics).length > 0 && (
        <div className="glass p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-3">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-2">
            {metrics.diabetesStatus && (
              <div className="glass p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-1 mb-1">
                  <Icon icon={FaExclamationTriangle} className="text-xs text-blue-500" />
                  <span className="text-white/60 text-xs">Diabetes Status</span>
                </div>
                <p className={`text-sm font-medium ${metrics.diabetesStatus.toLowerCase().includes('positive') || 
                                                    metrics.diabetesStatus.toLowerCase().includes('present') || 
                                                    metrics.diabetesStatus.toLowerCase().includes('detected') ? 
                                                    'text-red-400' : 'text-green-400'}`}>
                  {metrics.diabetesStatus}
                </p>
              </div>
            )}
            
            {metrics.probability && (
              <div className="glass p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-1 mb-1">
                  <Icon icon={FaPercentage} className="text-xs text-blue-500" />
                  <span className="text-white/60 text-xs">Probability</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {metrics.probability.includes('%') ? metrics.probability : `${metrics.probability}%`}
                </p>
              </div>
            )}
            
            {metrics.glucose && (
              <div className="glass p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-1 mb-1">
                  <Icon icon={FaInfoCircle} className="text-xs text-blue-500" />
                  <span className="text-white/60 text-xs">Glucose</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {metrics.glucose} mg/dL
                </p>
              </div>
            )}
            
            {metrics.hba1c && (
              <div className="glass p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-1 mb-1">
                  <Icon icon={FaInfoCircle} className="text-xs text-blue-500" />
                  <span className="text-white/60 text-xs">HbA1c</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {metrics.hba1c}%
                </p>
              </div>
            )}
            
            {metrics.bmi && (
              <div className="glass p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-1 mb-1">
                  <Icon icon={FaInfoCircle} className="text-xs text-blue-500" />
                  <span className="text-white/60 text-xs">BMI</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {metrics.bmi} kg/m²
                </p>
              </div>
            )}
            
            {metrics.bloodPressure && (
              <div className="glass p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-1 mb-1">
                  <Icon icon={FaInfoCircle} className="text-xs text-blue-500" />
                  <span className="text-white/60 text-xs">Blood Pressure</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {metrics.bloodPressure} mmHg
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show warning for unrelated images */}
      {isUnrelated && (
        <div className="glass p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-3">
          <div className="flex items-start gap-2">
            <Icon icon={FaExclamationTriangle} className="text-yellow-500 shrink-0 mt-1" />
            <p className="text-yellow-400 text-sm">
              This image does not show {diseaseType}-related conditions. Please upload an image showing relevant symptoms or a medical report for proper analysis.
            </p>
          </div>
        </div>
      )}

      {/* Full analysis text */}
      <div className="glass p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="prose prose-invert max-w-none max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {cleanedAnalysis.split('\n').map((paragraph, index) => {
            // Skip the first paragraph if it's already shown as a warning
            if (isUnrelated && index === 0 && paragraph.toLowerCase().includes('not show')) {
              return null;
            }
            
            // Check if this is a heading
            if (paragraph.startsWith('1.') || 
                paragraph.toLowerCase().includes('classification') || 
                paragraph.toLowerCase().includes('initial assessment')) {
              return (
                <h3 key={index} className="text-sm font-semibold text-blue-400 mt-3 mb-1">
                  {paragraph}
                </h3>
              );
            } else if (paragraph.startsWith('2.') || 
                       paragraph.toLowerCase().includes('key findings') || 
                       paragraph.toLowerCase().includes('observations')) {
              return (
                <h4 key={index} className="text-sm font-semibold text-blue-300 mt-2 mb-1">
                  {paragraph}
                </h4>
              );
            } else if (paragraph.startsWith('3.') || 
                       paragraph.toLowerCase().includes('recommendations')) {
              return (
                <h4 key={index} className="text-sm font-semibold text-blue-300 mt-2 mb-1">
                  {paragraph}
                </h4>
              );
            } else if (paragraph.startsWith('- ') || paragraph.startsWith('*')) {
              // This is a list item
              return (
                <div key={index} className="flex items-start gap-2 my-1">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <p className="text-white/80 m-0 text-sm">{paragraph.replace(/^[-*]\s/, '')}</p>
                </div>
              );
            } else if (paragraph.trim() === '') {
              // Empty line
              return <div key={index} className="h-1"></div>;
            } else {
              // Regular paragraph
              return (
                <p key={index} className="text-white/80 my-1 text-sm">
                  {paragraph}
                </p>
              );
            }
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResult;
