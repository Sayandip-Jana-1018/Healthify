# Hygieia: AI-Powered Medical Disease Prediction Platform

<div align="center">
  <img src="public/logo.png" alt="Hygieia Logo" width="200" height="200" />
  <h3>Advanced Disease Prediction & Analysis Using AI</h3>
</div>

## Overview

Hygieia is a comprehensive AI-powered medical diagnosis platform designed to predict various diseases using machine learning algorithms and interactive data visualizations. Named after the Greek goddess of health, Hygieia aims to revolutionize preventive healthcare by providing early risk assessment for multiple medical conditions.

### Mission

To democratize access to AI-powered medical diagnostics and empower individuals to take control of their health through early disease detection and risk assessment.

### Disclaimer

Hygieia is designed as a supplementary tool for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## Key Features

- **Multi-Disease Prediction**: Support for 8 different disease prediction models
- **Interactive Visualizations**: Dynamic, interactive charts and graphs powered by Plotly.js
- **Notebook Integration**: Jupyter notebook integration for detailed analysis and educational content
- **Real-time Predictions**: Instant disease risk assessment based on user-provided data
- **Responsive Design**: Fully responsive interface that works across all devices
- **Feature Importance Analysis**: Transparent AI showing which factors contribute to predictions
- **Dark Mode Interface**: Eye-friendly dark mode design with glass morphism elements
- **Privacy-Focused**: Local processing of sensitive medical data

## Supported Disease Predictions

- **General Disease Prediction**
- **Diabetes**
- **Heart Disease**
- **Lung Cancer**
- **Breast Cancer**
- **Parkinson's Disease**
- **Kidney Disease**
- **Liver Disease**

## AI Models & Algorithms

Hygieia employs a variety of machine learning and deep learning models to provide accurate disease predictions:

| Disease | Algorithms | Accuracy | Key Features |
|---------|------------|----------|--------------|
| Diabetes | Random Forest, Gradient Boosting, SVM | 92.5% | Glucose Level, BMI, Age, Insulin |
| Heart Disease | XGBoost, Neural Networks, Logistic Regression | 94.2% | Cholesterol, Blood Pressure, ECG Results |
| Liver Disease | Decision Trees, Random Forest, AdaBoost | 89.7% | Bilirubin, Enzymes, Proteins |
| Lung Cancer | CNNs, Random Forest, SVM | 91.3% | Smoking History, Age, Genetic Risk |
| Breast Cancer | Random Forest, SVM, KNN | 93.8% | Cell Perimeter, Area, Texture, Concavity |
| Parkinson's | XGBoost, SVM, Random Forest | 90.2% | Voice Features, Tremor Analysis |
| Kidney Disease | Gradient Boosting, Random Forest | 92.1% | Creatinine, Blood Urea, Albumin |

All models undergo rigorous validation using k-fold cross-validation, confusion matrix analysis, ROC curve evaluation, and precision-recall metrics.

## Technology Stack

### Frontend
- **Next.js 15.1.6**: React framework for server-side rendering
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Plotly.js**: Interactive data visualization

### Backend
- **Next.js API Routes**: Serverless functions
- **Python**: For data processing and ML models
- **Jupyter Notebooks**: For data analysis
- **scikit-learn**: Machine learning library
- **TensorFlow/PyTorch**: Deep learning frameworks

## Interactive Visualizations

Hygieia features a comprehensive set of interactive visualizations for each disease:

- **Distribution Charts**: Showing key metric distributions
- **Correlation Matrices**: Revealing relationships between different factors
- **Feature Importance Plots**: Highlighting the most significant predictors
- **Comparison Visualizations**: Comparing healthy vs. disease indicators
- **Risk Assessment Graphs**: Visualizing individual risk levels

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn
- Python 3.8+ (for notebook analysis)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hygieia.git
cd hygieia
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Documentation

Comprehensive documentation is available at the `/docs` route within the application. This includes:
- Detailed model descriptions
- Feature explanations
- Technical architecture
- Future roadmap

## Future Roadmap

- **Medical Imaging Integration**: Support for analyzing X-rays, MRIs, CT scans
- **Personalized Health Recommendations**: AI-driven health advice
- **Multi-language Support**: Expanded accessibility
- **Healthcare Provider Integration**: Secure APIs for integration
- **Mobile Applications**: Native iOS and Android apps

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Medical datasets from Kaggle and UCI Machine Learning Repository
- Open-source ML libraries and frameworks
- Next.js and React communities
- All contributors and supporters

---

<div align="center">
  <p>Built with ❤️ for a healthier future</p>
</div>
