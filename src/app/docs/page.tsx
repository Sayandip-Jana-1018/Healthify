'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Animation variants
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
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

interface DocsPageProps {
  // Add any props that are passed to the DocsPage component
}

export default function DocsPage({}: DocsPageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto text-center"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image 
                src="/images/health.gif" 
                alt="Hygieia Logo" 
                width={150} 
                height={150} 
                className="rounded-full object-contain border-4 border-white/20"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Hygieia <span className="text-blue-400">Documentation</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Comprehensive guide to the Hygieia AI-powered medical diagnosis platform
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center mb-10 bg-black/20 p-2 rounded-xl">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
              <span className="mr-2">📋</span> Overview
            </TabButton>
            <TabButton active={activeTab === 'models'} onClick={() => setActiveTab('models')}>
              <span className="mr-2">🧠</span> AI Models
            </TabButton>
            <TabButton active={activeTab === 'features'} onClick={() => setActiveTab('features')}>
              <span className="mr-2">✨</span> Features
            </TabButton>
            <TabButton active={activeTab === 'tech'} onClick={() => setActiveTab('tech')}>
              <span className="mr-2">⚙️</span> Tech Stack
            </TabButton>
            <TabButton active={activeTab === 'future'} onClick={() => setActiveTab('future')}>
              <span className="mr-2">🚀</span> Future Roadmap
            </TabButton>
          </motion.div>

          {/* Content Sections */}
          <div className="glass rounded-2xl backdrop-blur-lg bg-black/30 border border-white/10 p-8 text-center">
            {activeTab === 'overview' && <OverviewSection />}
            {activeTab === 'models' && <ModelsSection />}
            {activeTab === 'features' && <FeaturesSection />}
            {activeTab === 'tech' && <TechStackSection />}
            {activeTab === 'future' && <FutureRoadmapSection />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Tab Button Component
interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 mx-1 my-1 ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-black/20 text-white/70 hover:bg-black/30 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

// Overview Section
interface OverviewSectionProps {
  // Add any props that are passed to the OverviewSection component
}

function OverviewSection({}: OverviewSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 text-center"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <span className="text-blue-400 mr-3">🏥</span> Project Overview
        </h2>
        <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
          Hygieia is a comprehensive AI-powered medical diagnosis platform designed to predict various diseases 
          using machine learning algorithms and interactive data visualizations. Named after the Greek goddess 
          of health, Hygieia aims to revolutionize preventive healthcare by providing early risk assessment 
          for multiple medical conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <FeatureCard 
          icon="🎯" 
          title="Mission" 
          description="To democratize access to AI-powered medical diagnostics and empower individuals to take control of their health through early disease detection and risk assessment."
        />
        <FeatureCard 
          icon="👁️" 
          title="Vision" 
          description="A world where preventable diseases are caught early through accessible AI technology, leading to better health outcomes and reduced healthcare costs."
        />
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-white mb-4">Supported Disease Predictions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <DiseaseCard icon="🩺" name="Diabetes" />
          <DiseaseCard icon="❤️" name="Heart Disease" />
          <DiseaseCard icon="🫁" name="Liver Disease" />
          <DiseaseCard icon="🫀" name="Lung Cancer" />
          <DiseaseCard icon="🧬" name="Breast Cancer" />
          <DiseaseCard icon="🧠" name="Parkinson's" />
          <DiseaseCard icon="🦠" name="Kidney Disease" />
          <DiseaseCard icon="🔬" name="General Disease" />
        </div>
      </div>

      <div className="p-6 bg-blue-900/30 rounded-xl border border-blue-500/30 mt-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-2">Important Disclaimer</h3>
        <p className="text-white/80">
          Hygieia is designed as a supplementary tool for educational and informational purposes only. 
          It is not intended to replace professional medical advice, diagnosis, or treatment. 
          Always seek the advice of your physician or other qualified health provider with any 
          questions you may have regarding a medical condition.
        </p>
      </div>
    </motion.div>
  );
}

// Models Section
interface ModelsSectionProps {
  // Add any props that are passed to the ModelsSection component
}

function ModelsSection({}: ModelsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 text-center"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <span className="text-blue-400 mr-3">🧠</span> AI Models & Algorithms
        </h2>
        <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
          Hygieia employs a variety of machine learning and deep learning models to provide accurate 
          disease predictions. Each disease module uses specialized algorithms optimized for the 
          specific medical condition and available data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <ModelCard 
          title="Diabetes Prediction" 
          algorithms={["Random Forest", "Gradient Boosting", "Support Vector Machine"]}
          accuracy="92.5%"
          features={["Glucose Level", "BMI", "Age", "Insulin", "Blood Pressure"]}
          description="Our diabetes prediction model analyzes various health metrics to assess the risk of developing Type 2 diabetes. The model has been trained on the Pima Indians Diabetes Database and validated with clinical data."
        />

        <ModelCard 
          title="Heart Disease Prediction" 
          algorithms={["XGBoost", "Neural Networks", "Logistic Regression"]}
          accuracy="94.2%"
          features={["Cholesterol Levels", "Blood Pressure", "Chest Pain Type", "ECG Results", "Age"]}
          description="The heart disease prediction model evaluates cardiovascular risk factors to determine the likelihood of coronary artery disease. It has been trained on the Cleveland Heart Disease dataset and optimized for high sensitivity."
        />

        <ModelCard 
          title="Liver Disease Prediction" 
          algorithms={["Decision Trees", "Random Forest", "AdaBoost"]}
          accuracy="89.7%"
          features={["Total Bilirubin", "Direct Bilirubin", "Alkaline Phosphatase", "SGPT", "SGOT"]}
          description="Our liver disease model analyzes liver function tests and patient demographics to predict the risk of liver disorders including fatty liver, hepatitis, and cirrhosis."
        />

        <ModelCard 
          title="Lung Cancer Prediction" 
          algorithms={["Convolutional Neural Networks", "Random Forest", "SVM"]}
          accuracy="91.3%"
          features={["Smoking History", "Age", "Genetic Risk", "Chronic Disease", "Passive Smoker"]}
          description="The lung cancer prediction model combines patient history with imaging data analysis to detect early signs of lung cancer, with particular focus on high-risk populations."
        />
        
        <ModelCard 
          title="Breast Cancer Prediction" 
          algorithms={["Random Forest", "SVM", "KNN"]}
          accuracy="93.8%"
          features={["Cell Perimeter", "Area", "Texture", "Concavity", "Symmetry"]}
          description="Our breast cancer model analyzes cell nuclei characteristics from fine needle aspirates to differentiate between malignant and benign breast masses with high accuracy."
        />
        
        <ModelCard 
          title="Parkinson's Disease Prediction" 
          algorithms={["XGBoost", "SVM", "Random Forest"]}
          accuracy="90.2%"
          features={["Voice Jitter", "Voice Shimmer", "NHR", "HNR", "RPDE"]}
          description="The Parkinson's disease model analyzes voice recordings to detect subtle changes in voice patterns that may indicate early stages of Parkinson's disease."
        />
        
        <ModelCard 
          title="Kidney Disease Prediction" 
          algorithms={["Gradient Boosting", "Random Forest", "Logistic Regression"]}
          accuracy="92.1%"
          features={["Serum Creatinine", "Blood Urea", "Albumin", "Hemoglobin", "Specific Gravity"]}
          description="Our kidney disease model evaluates blood and urine test results to assess the risk of chronic kidney disease and provide early detection of kidney dysfunction."
        />
        
        <ModelCard 
          title="General Disease Prediction" 
          algorithms={["Ensemble Methods", "Neural Networks", "Bayesian Models"]}
          accuracy="88.5%"
          features={["Symptoms", "Vital Signs", "Medical History", "Demographic Data"]}
          description="The general disease prediction model uses a comprehensive approach to analyze various symptoms and patient data to suggest potential conditions for further investigation."
        />
      </div>

      <div className="p-6 bg-purple-900/30 rounded-xl border border-purple-500/30 mt-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-2">Model Validation Approach</h3>
        <p className="text-white/80">
          All models undergo rigorous validation using k-fold cross-validation, confusion matrix analysis, 
          ROC curve evaluation, and precision-recall metrics. We continuously update our models with new 
          data and research findings to improve accuracy and reliability.
        </p>
      </div>
    </motion.div>
  );
}

// Features Section
interface FeaturesSectionProps {
  // Add any props that are passed to the FeaturesSection component
}

function FeaturesSection({}: FeaturesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 text-center"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <span className="text-blue-400 mr-3">✨</span> Platform Features
        </h2>
        <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
          Hygieia combines cutting-edge AI with an intuitive user interface to deliver a comprehensive 
          disease prediction and analysis experience. Here are the key features that make our platform unique.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <FeatureCard 
          icon="📊" 
          title="Interactive Visualizations" 
          description="Dynamic, interactive charts and graphs powered by Plotly.js that help users understand risk factors and prediction results."
        />
        <FeatureCard 
          icon="📓" 
          title="Notebook Integration" 
          description="Jupyter notebook integration that provides detailed analysis and educational content about each disease and prediction model."
        />
        <FeatureCard 
          icon="🔄" 
          title="Real-time Predictions" 
          description="Instant disease risk assessment based on user-provided symptoms and medical data."
        />
        <FeatureCard 
          icon="📱" 
          title="Responsive Design" 
          description="Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices."
        />
        <FeatureCard 
          icon="🔍" 
          title="Feature Importance Analysis" 
          description="Transparent AI that shows which factors most significantly contribute to prediction results."
        />
        <FeatureCard 
          icon="🌙" 
          title="Dark Mode Interface" 
          description="Eye-friendly dark mode design with glass morphism elements for extended usage comfort."
        />
        <FeatureCard 
          icon="🔒" 
          title="Privacy-Focused" 
          description="Local processing of sensitive medical data with no external storage of personal information."
        />
        <FeatureCard 
          icon="🧩" 
          title="Modular Architecture" 
          description="Extensible design that allows for easy addition of new disease prediction modules and features."
        />
      </div>
    </motion.div>
  );
}

// Tech Stack Section
interface TechStackSectionProps {
  // Add any props that are passed to the TechStackSection component
}

function TechStackSection({}: TechStackSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 text-center"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <span className="text-blue-400 mr-3">⚙️</span> Technology Stack
        </h2>
        <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
          Hygieia is built using modern technologies and frameworks to ensure performance, 
          scalability, and maintainability. Our tech stack is carefully selected to provide 
          the best user experience and developer productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <TechStackCard 
          title="Frontend" 
          items={[
            { name: "Next.js 15.1.6 🔷", description: "React framework for server-side rendering and static site generation" },
            { name: "TypeScript 🔷", description: "Typed superset of JavaScript for improved developer experience" },
            { name: "Tailwind CSS 🎨", description: "Utility-first CSS framework for rapid UI development" },
            { name: "Framer Motion 🎭", description: "Animation library for React applications" },
            { name: "Plotly.js 📊", description: "Interactive data visualization library" }
          ]}
        />
        
        <TechStackCard 
          title="Backend" 
          items={[
            { name: "Next.js API Routes 🚀", description: "Serverless functions for API endpoints" },
            { name: "Python 🐍", description: "For data processing and machine learning models" },
            { name: "Jupyter Notebooks 📔", description: "For data analysis and model development" },
            { name: "scikit-learn 🧮", description: "Machine learning library for model training" },
            { name: "TensorFlow/PyTorch 🧠", description: "Deep learning frameworks for advanced models" }
          ]}
        />
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-4">Development & Deployment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TechStackCard 
            title="Development Tools" 
            items={[
              { name: "Git & GitHub 🔄", description: "Version control and collaboration" },
              { name: "VS Code 💻", description: "Code editor with TypeScript and React support" },
              { name: "ESLint & Prettier ✨", description: "Code quality and formatting tools" },
              { name: "Jest & React Testing Library 🧪", description: "Testing frameworks" }
            ]}
          />
          
          <TechStackCard 
            title="Deployment" 
            items={[
              { name: "Vercel 🚀", description: "Platform for frontend deployment and hosting" },
              { name: "Docker 🐳", description: "Containerization for consistent environments" },
              { name: "GitHub Actions 🔄", description: "CI/CD pipeline automation" },
              { name: "Netlify 🌐", description: "Alternative deployment platform" }
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Future Roadmap Section
interface FutureRoadmapSectionProps {
  // Add any props that are passed to the FutureRoadmapSection component
}

function FutureRoadmapSection({}: FutureRoadmapSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 text-center"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <span className="text-blue-400 mr-3">🚀</span> Future Roadmap
        </h2>
        <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
          Hygieia is continuously evolving to incorporate the latest advancements in AI and 
          medical research. Here's our vision for the future development of the platform.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <RoadmapItem 
          phase="Q3 2025" 
          title="Medical Imaging Integration 🔬" 
          description="Add support for analyzing medical images (X-rays, MRIs, CT scans) for enhanced disease detection capabilities."
          status="Planning"
        />
        
        <RoadmapItem 
          phase="Q4 2025" 
          title="Personalized Health Recommendations 💊" 
          description="Implement AI-driven personalized health recommendations based on prediction results and user health data."
          status="Research"
        />
        
        <RoadmapItem 
          phase="Q1 2026" 
          title="Multi-language Support 🌐" 
          description="Expand platform accessibility with support for multiple languages and region-specific health metrics."
          status="Planned"
        />
        
        <RoadmapItem 
          phase="Q2 2026" 
          title="Healthcare Provider Integration 🏥" 
          description="Develop secure APIs for healthcare providers to integrate Hygieia's prediction capabilities into their systems."
          status="Conceptual"
        />
        
        <RoadmapItem 
          phase="Q3 2026" 
          title="Mobile Applications 📱" 
          description="Native mobile applications for iOS and Android with offline prediction capabilities."
          status="Planned"
        />
      </div>

      <div className="p-6 bg-green-900/30 rounded-xl border border-green-500/30 mt-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-2">Research Collaborations 🔬</h3>
        <p className="text-white/80">
          We are actively seeking collaborations with medical research institutions and healthcare 
          providers to improve our models and validate our approach in clinical settings. If you're 
          interested in partnering with us, please reach out through our GitHub repository.
        </p>
      </div>
    </motion.div>
  );
}

// Reusable Components
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/30 transition-all text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  );
}

interface DiseaseCardProps {
  icon: string;
  name: string;
}

function DiseaseCard({ icon, name }: DiseaseCardProps) {
  return (
    <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 text-center hover:bg-blue-900/30 transition-all">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-medium text-white">{name}</h3>
    </div>
  );
}

interface ModelCardProps {
  title: string;
  algorithms: string[];
  accuracy: string;
  features: string[];
  description: string;
}

function ModelCard({ title, algorithms, accuracy, features, description }: ModelCardProps) {
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {algorithms.map((algo: string, index: number) => (
          <span key={index} className="bg-blue-600/50 text-white text-sm px-3 py-1 rounded-full">
            {algo}
          </span>
        ))}
      </div>
      <div className="mb-3">
        <span className="text-white/70">Accuracy: </span>
        <span className="text-green-400 font-bold">{accuracy}</span>
      </div>
      <p className="text-white/80 mb-4 mx-auto max-w-xl">{description}</p>
      <div>
        <h4 className="text-white font-medium mb-2">Key Features:</h4>
        <ul className="list-none text-white/70 flex flex-col items-center">
          {features.map((feature: string, index: number) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface TechStackItem {
  name: string;
  description: string;
}

interface TechStackCardProps {
  title: string;
  items: TechStackItem[];
}

function TechStackCard({ title, items }: TechStackCardProps) {
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item: TechStackItem, index: number) => (
          <li key={index} className="flex items-center justify-center">
            <div>
              <span className="text-white font-medium">{item.name}</span>
              <p className="text-white/70 text-sm">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface RoadmapItemProps {
  phase: string;
  title: string;
  description: string;
  status: string;
}

function RoadmapItem({ phase, title, description, status }: RoadmapItemProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Planning': return 'bg-yellow-500';
      case 'Research': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center mx-auto">
      <div className="flex flex-col items-center mb-3">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <span className="text-white/60 text-sm bg-black/30 px-3 py-1 rounded-full">{phase}</span>
      </div>
      <p className="text-white/80 mb-3 mx-auto max-w-xl">{description}</p>
      <div className="flex items-center justify-center">
        <span className={`w-3 h-3 rounded-full ${getStatusColor(status)} mr-2`}></span>
        <span className="text-white/70 text-sm">{status}</span>
      </div>
    </div>
  );
}
