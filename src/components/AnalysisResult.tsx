'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaVirus, 
  FaShieldAlt, 
  FaExclamationCircle, 
  FaExclamationTriangle, 
  FaFileAlt, 
  FaImage,
  FaInfoCircle,
  FaPercentage,
  FaCheckCircle
} from 'react-icons/fa';
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
    .replace(/\~\~(.+?)\~\~/g, '$1') // Remove strikethrough (~~text~~)
    .replace(/\|/g, '')              // Remove table characters
    .replace(/\-\-\-/g, '')          // Remove horizontal rules
    .replace(/\#/g, '')              // Remove heading markers
    .replace(/\>/g, '')              // Remove blockquote markers
    .replace(/\`/g, '')              // Remove code markers
    .replace(/\n\n+/g, '\n\n')       // Reduce multiple newlines
    .replace(/\*/g, '')              // Remove asterisks
    .replace(/\+/g, '')              // Remove plus signs
    .replace(/\:/g, '')              // Remove colons
    .replace(/\•/g, '')              // Remove bullet points
    .replace(/\-/g, '')              // Remove hyphens
    .replace(/\=/g, '')              // Remove equals signs
    .replace(/\(/g, '')              // Remove opening parentheses
    .replace(/\)/g, '')              // Remove closing parentheses
    .replace(/\[/g, '')              // Remove opening brackets
    .replace(/\]/g, '')              // Remove closing brackets
    .replace(/\{/g, '')              // Remove opening braces
    .replace(/\}/g, '');             // Remove closing braces
};

// Extract prediction information from analysis text
const extractPredictionInfo = (text: string) => {
  const info: { 
    prediction?: string;
    probability?: string;
    disease?: string;
    risk?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  } = {};
  
  // Check if this is a quality report card or performance metrics
  const isReportCard = text.toLowerCase().includes('quality report card') || 
                      text.toLowerCase().includes('performance metrics') ||
                      text.toLowerCase().includes('hospital performance');
  
  if (isReportCard) {
    // For report cards, extract specific information
    info.disease = "Performance Metrics";
    
    // Try to extract specific disease focus
    if (text.toLowerCase().includes('heart attack') || 
        text.toLowerCase().includes('cardiac') || 
        text.toLowerCase().includes('heart failure') ||
        text.toLowerCase().includes('myocardial infarction')) {
      info.disease = "Cardiac Care Metrics";
    } else if (text.toLowerCase().includes('pneumonia') || 
              text.toLowerCase().includes('respiratory')) {
      info.disease = "Respiratory Care Metrics";
    } else if (text.toLowerCase().includes('stroke')) {
      info.disease = "Stroke Care Metrics";
    }
    
    // Extract percentage as confidence
    const percentageMatches = text.match(/(\d+)%/g);
    if (percentageMatches && percentageMatches.length > 0) {
      // Use the highest percentage found as the confidence
      const percentages = percentageMatches.map(p => parseInt(p.replace('%', '')));
      info.probability = Math.max(...percentages).toString();
    } else {
      info.probability = "100"; // Default for report cards
    }
    
    // Set risk level based on content
    if (text.toLowerCase().includes('postmi patients') || 
        text.toLowerCase().includes('left ventricular') || 
        text.toLowerCase().includes('heart failure risk')) {
      info.risk = "In postMI patients";
      info.riskLevel = 'high';
    } else {
      info.risk = "Performance Assessment";
      info.riskLevel = 'medium';
    }
    
    return info;
  }
  
  // Try to extract prediction (positive/negative)
  const predictionPatterns = [
    /prediction\s*(?:is|:)?\s*(positive|negative|detected|not detected)/i,
    /findings\s*(?:are|is|:)?\s*(positive|negative|detected|not detected)/i,
    /assessment\s*(?:is|:)?\s*(positive|negative|detected|not detected)/i,
    /diagnosis\s*(?:is|:)?\s*(positive|negative|detected|not detected)/i
  ];
  
  for (const pattern of predictionPatterns) {
    const match = text.match(pattern);
    if (match) {
      info.prediction = match[1];
      break;
    }
  }
  
  // Try to extract probability/confidence - more comprehensive patterns
  const probPatterns = [
    /(?:probability|chance|likelihood|confidence)\s*(?:is|:)?\s*([\d.]+)%?/i,
    /(?:probability|chance|likelihood|confidence)\s*(?:level|:)?\s*(?:is|:)?\s*([\d.]+)%?/i,
    /(?:probability|chance|likelihood|confidence)\s*(?:of|:)?\s*([\d.]+)%?/i,
    /(?:[\d.]+)%\s*(?:probability|chance|likelihood|confidence)/i,
    /confidence\s*(?:level|:)?\s*(?:is|:)?\s*([a-z]+)/i, // For text-based confidence (high, medium, low)
    /(\d+)\s*(?:percent|%)/i // For percentage without explicit confidence label
  ];
  
  for (const pattern of probPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Check if the match is in the last pattern format (e.g., "75% confidence")
      if (pattern.toString().includes('probability|chance|likelihood|confidence')) {
        const percentMatch = match[0].match(/([\d.]+)%/);
        if (percentMatch) {
          info.probability = percentMatch[1];
          break;
        }
      } else if (pattern.toString().includes('percent|%')) {
        info.probability = match[1];
        break;
      } else if (pattern.toString().includes('confidence.*([a-z]+)')) {
        // Convert text-based confidence to numeric
        const confidenceText = match[1].toLowerCase();
        if (confidenceText === 'high') info.probability = '85';
        else if (confidenceText === 'medium') info.probability = '65';
        else if (confidenceText === 'low') info.probability = '35';
        break;
      } else {
        info.probability = match[1];
        break;
      }
    }
  }
  
  // If no probability found, look for numbers followed by % anywhere in the text
  if (!info.probability) {
    const percentMatches = text.match(/(\d+)%/g);
    if (percentMatches && percentMatches.length > 0) {
      // Use the first percentage found
      info.probability = percentMatches[0].replace('%', '');
    }
  }
  
  // If still no probability, assign a default based on the content
  if (!info.probability) {
    if (text.toLowerCase().includes('suspicious') || 
        text.toLowerCase().includes('concerning') ||
        text.toLowerCase().includes('abnormal')) {
      info.probability = '70';
    } else if (text.toLowerCase().includes('requires follow-up') || 
              text.toLowerCase().includes('additional imaging')) {
      info.probability = '50';
    } else if (text.toLowerCase().includes('likely benign') || 
              text.toLowerCase().includes('probably benign')) {
      info.probability = '20';
    }
  }
  
  // Try to extract disease type
  const diseasePatterns = [
    /disease\s*(?:type|:)?\s*(?:is|:)?\s*([^.]+)/i,
    /diagnosis\s*(?:is|:)?\s*([^.]+)/i,
    /condition\s*(?:is|:)?\s*([^.]+)/i
  ];
  
  for (const pattern of diseasePatterns) {
    const match = text.match(pattern);
    if (match) {
      info.disease = match[1].trim();
      break;
    }
  }
  
  // If no specific disease found, try to extract from common conditions
  if (!info.disease) {
    const commonConditions = [
      'pneumonia', 'tuberculosis', 'covid', 'fracture', 'cancer', 'tumor', 
      'carcinoma', 'melanoma', 'herpes', 'zoster', 'shingles', 'dermatitis',
      'eczema', 'psoriasis', 'rash', 'lesion'
    ];
    
    for (const condition of commonConditions) {
      if (text.toLowerCase().includes(condition)) {
        // Get the sentence containing the condition
        const sentences = text.split(/[.!?]+/);
        for (const sentence of sentences) {
          if (sentence.toLowerCase().includes(condition)) {
            if (sentence.toLowerCase().includes('not') && 
                sentence.toLowerCase().includes(condition)) {
              continue; // Skip if it's a negative mention
            }
            info.disease = condition.charAt(0).toUpperCase() + condition.slice(1);
            break;
          }
        }
        if (info.disease) break;
      }
    }
  }
  
  // Check for specific disease mentions
  if (!info.disease) {
    if (text.toLowerCase().includes('herpes zoster') || 
        text.toLowerCase().includes('shingles')) {
      info.disease = 'Herpes Zoster (Shingles)';
    } else if (text.toLowerCase().includes('herpes simplex') || 
              text.toLowerCase().includes('hsv')) {
      info.disease = 'Herpes Simplex Virus';
    } else if (text.toLowerCase().includes('dermatitis')) {
      info.disease = 'Dermatitis';
    }
  }
  
  // If still no disease found but visual characteristics mentioned
  if (!info.disease && text.toLowerCase().includes('visual characteristics')) {
    info.disease = 'Based on visual characteristics';
  }
  
  // Try to extract risk level
  const riskPatterns = [
    /risk\s*(?:level|:)?\s*(?:is|:)?\s*([^.]+)/i,
    /severity\s*(?:is|:)?\s*([^.]+)/i,
    /assessment\s*(?:is|:)?\s*([^.]+)/i
  ];
  
  for (const pattern of riskPatterns) {
    const match = text.match(pattern);
    if (match) {
      info.risk = match[1].trim();
      
      // Determine risk level
      const riskText = match[1].toLowerCase();
      if (/low|minimal|mild/.test(riskText)) {
        info.riskLevel = 'low';
      } else if (/moderate|medium/.test(riskText)) {
        info.riskLevel = 'medium';
      } else if (/high|severe|critical/.test(riskText)) {
        info.riskLevel = 'high';
      }
      
      break;
    }
  }
  
  // If no risk found but severity mentioned
  if (!info.risk) {
    if (text.toLowerCase().includes('mild to moderate')) {
      info.risk = 'Mild to Moderate';
      info.riskLevel = 'medium';
    } else if (text.toLowerCase().includes('mild')) {
      info.risk = 'Mild';
      info.riskLevel = 'low';
    } else if (text.toLowerCase().includes('moderate')) {
      info.risk = 'Moderate';
      info.riskLevel = 'medium';
    } else if (text.toLowerCase().includes('severe')) {
      info.risk = 'Severe';
      info.riskLevel = 'high';
    }
  }
  
  return info;
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
  
  // Check if this is a quality report card
  const isReportCard = cleanedAnalysis.toLowerCase().includes('quality report card') || 
                      cleanedAnalysis.toLowerCase().includes('performance metrics') ||
                      cleanedAnalysis.toLowerCase().includes('hospital performance');
  
  // Extract metrics for diabetes reports
  const metrics = isDiabetesReport ? extractMetrics(cleanedAnalysis) : {};
  
  // Extract prediction info for image analysis
  const predictionInfo = !isDiabetesReport ? extractPredictionInfo(cleanedAnalysis) : {};
  
  // Determine if diabetes is present based on the analysis
  const diabetesPresent = hasDiabetes(cleanedAnalysis);
  
  // Determine risk level color
  const getRiskColor = (risk?: string, riskLevel?: 'low' | 'medium' | 'high') => {
    if (!risk && !riskLevel) return 'text-gray-400';
    
    if (risk?.includes('postMI')) return 'text-blue-400';
    
    if (riskLevel === 'low') return 'text-green-400';
    if (riskLevel === 'medium') return 'text-yellow-400';
    if (riskLevel === 'high') return 'text-red-400';
    
    const lowRisk = /low|minimal|mild/i.test(risk || '');
    const mediumRisk = /moderate|medium/i.test(risk || '');
    const highRisk = /high|severe|critical/i.test(risk || '');
    
    if (lowRisk) return 'text-green-400';
    if (mediumRisk) return 'text-yellow-400';
    if (highRisk) return 'text-red-400';
    
    return 'text-blue-400';
  };

  // Get a simplified disease name (1-2 words)
  const getSimplifiedDisease = () => {
    if (!predictionInfo.disease) return 'Unknown';
    
    // If already short, return as is
    if (predictionInfo.disease.split(' ').length <= 2) {
      return predictionInfo.disease;
    }
    
    // Check for common disease patterns
    if (predictionInfo.disease.toLowerCase().includes('herpes zoster') || 
        predictionInfo.disease.toLowerCase().includes('shingles')) {
      return 'Shingles';
    }
    
    if (predictionInfo.disease.toLowerCase().includes('herpes simplex')) {
      return 'Herpes';
    }
    
    if (predictionInfo.disease.toLowerCase().includes('carcinoma') || 
        predictionInfo.disease.toLowerCase().includes('cancer')) {
      return 'Cancer';
    }
    
    if (predictionInfo.disease.toLowerCase().includes('pneumonia')) {
      return 'Pneumonia';
    }
    
    if (predictionInfo.disease.toLowerCase().includes('dermatitis')) {
      return 'Dermatitis';
    }
    
    if (predictionInfo.disease.toLowerCase().includes('melanoma')) {
      return 'Melanoma';
    }
    
    if (predictionInfo.disease.toLowerCase().includes('tuberculosis') || 
        predictionInfo.disease.toLowerCase().includes('tb')) {
      return 'Tuberculosis';
    }
    
    if (predictionInfo.disease.toLowerCase().includes('fracture')) {
      return 'Fracture';
    }
    
    if (predictionInfo.disease.toLowerCase().includes('visual characteristics')) {
      return 'Findings';
    }
    
    // Default: take first two words
    const words = predictionInfo.disease.split(' ');
    return words.slice(0, 2).join(' ');
  };
  
  // Get simplified risk level
  const getSimplifiedRisk = () => {
    if (predictionInfo.riskLevel) {
      return predictionInfo.riskLevel.charAt(0).toUpperCase() + predictionInfo.riskLevel.slice(1);
    }
    
    if (predictionInfo.risk) {
      if (predictionInfo.risk.toLowerCase().includes('low') || 
          predictionInfo.risk.toLowerCase().includes('minimal') || 
          predictionInfo.risk.toLowerCase().includes('mild')) {
        return 'Low';
      }
      
      if (predictionInfo.risk.toLowerCase().includes('moderate') || 
          predictionInfo.risk.toLowerCase().includes('medium')) {
        return 'Medium';
      }
      
      if (predictionInfo.risk.toLowerCase().includes('high') || 
          predictionInfo.risk.toLowerCase().includes('severe') || 
          predictionInfo.risk.toLowerCase().includes('critical')) {
        return 'High';
      }
      
      if (predictionInfo.risk.toLowerCase().includes('postmi')) {
        return 'High';
      }
    }
    
    return 'Unknown';
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Warning for unrelated images */}
      {isUnrelated && (
        <div className="glass p-4 rounded-xl mb-4 border border-yellow-500/30 bg-yellow-500/10">
          <div className="flex gap-3">
            <Icon icon={FaExclamationTriangle} className="text-yellow-500 text-xl shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-medium mb-1">Not a Medical Image</h3>
              <p className="text-white/70 text-sm">
                The uploaded image does not appear to be a medical image. Please upload a relevant medical image for analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Analysis Summary Card */}
      {!isDiabetesReport && !isUnrelated && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Confidence */}
            <div className="glass p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon={FaShieldAlt} className="text-blue-400" />
                <h4 className="text-white/80 font-medium">Confidence</h4>
              </div>
              <p className="text-2xl font-bold text-white">
                {predictionInfo.probability ? `${predictionInfo.probability}%` : 'N/A'}
              </p>
            </div>
            
            {/* Disease Type */}
            <div className="glass p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon={FaVirus} className="text-blue-400" />
                <h4 className="text-white/80 font-medium">Disease</h4>
              </div>
              <p className="text-2xl font-bold text-white">
                {getSimplifiedDisease()}
              </p>
            </div>
            
            {/* Risk Level */}
            <div className="glass p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon={FaExclamationCircle} className="text-blue-400" />
                <h4 className="text-white/80 font-medium">Risk</h4>
              </div>
              <p className={`text-2xl font-bold ${getRiskColor(predictionInfo.risk, predictionInfo.riskLevel)}`}>
                {getSimplifiedRisk()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show extracted metrics if it's a report */}
      {isDiabetesReport && Object.keys(metrics).length > 0 && (
        <div className="glass p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-3">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">Extracted Metrics</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-xs text-white/50">{key}</span>
                <span className={`text-sm font-medium ${
                  value.includes('Normal') ? 'text-green-400' : 
                  value.includes('Abnormal') || value.includes('High') ? 'text-red-400' : 
                  'text-white'
                }`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diabetes Result */}
      {isDiabetesReport && (
        <div className={`glass p-4 rounded-xl mb-4 border ${
          diabetesPresent ? 'border-red-500/30 bg-red-500/10' : 'border-green-500/30 bg-green-500/10'
        }`}>
          <div className="flex gap-3">
            <Icon 
              icon={diabetesPresent ? FaExclamationCircle : FaCheckCircle} 
              className={`${diabetesPresent ? 'text-red-500' : 'text-green-500'} text-xl shrink-0 mt-1`} 
            />
            <div>
              <h3 className="text-white font-medium mb-1">
                {diabetesPresent ? 'Diabetes Detected' : 'No Diabetes Detected'}
              </h3>
              <p className="text-white/70 text-sm">
                {diabetesPresent 
                  ? 'The report indicates signs of diabetes. Please consult with a healthcare professional.' 
                  : 'The report does not indicate signs of diabetes.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full analysis text */}
      <div className="glass p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col flex-grow overflow-hidden">
        <h4 className="text-lg font-semibold text-white mb-3">Detailed Analysis</h4>
        <div className="overflow-y-auto custom-scrollbar pr-2 flex-grow">
          {cleanedAnalysis.split('\n').map((paragraph, index) => {
            // Skip the first paragraph if it's already shown as a warning
            if (isUnrelated && index === 0 && paragraph.toLowerCase().includes('not show')) {
              return null;
            }
            
            // Skip disclaimer sections
            if (paragraph.toLowerCase().includes('disclaimer') || 
                paragraph.toLowerCase().includes('i am an ai') ||
                paragraph.toLowerCase().includes('medical disclaimer') ||
                paragraph.toLowerCase().includes('this analysis is provided for') ||
                paragraph.toLowerCase().includes('always seek the advice')) {
              return null;
            }
            
            // Skip empty paragraphs or those with just special characters
            if (!paragraph.trim() || /^[\s\-\*\|\.]+$/.test(paragraph)) {
              return null;
            }
            
            // Skip table headers or formatting lines
            if (paragraph.includes('Feature') && paragraph.includes('Description')) {
              return null;
            }
            
            // Skip redundant section headers that are already shown in the UI
            if (/^prediction|^probability|^confidence|^disease type|^risk level/i.test(paragraph)) {
              return null;
            }
            
            // For report cards, format the percentages to stand out
            if (isReportCard && /\d+%/.test(paragraph)) {
              const parts = paragraph.split(/(\d+%)/g);
              return (
                <p key={index} className="mb-3 text-white/80">
                  {parts.map((part, i) => {
                    if (/\d+%/.test(part)) {
                      return <span key={i} className="text-blue-400 font-semibold">{part}</span>;
                    }
                    return part;
                  })}
                </p>
              );
            }
            
            // Format section headers
            if (/^\d+\.\s/.test(paragraph) || /^[A-Z][a-z]+:/.test(paragraph)) {
              return (
                <p key={index} className="text-white font-medium mt-4 mb-2">
                  {paragraph}
                </p>
              );
            }
            
            return (
              <p key={index} className="mb-3 text-white/80">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
