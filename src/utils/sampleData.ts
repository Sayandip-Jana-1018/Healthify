// Utility function to get random number between min and max (inclusive)
const getRandomNumber = (min: number, max: number, decimals: number = 0): number => {
  const randomNum = Math.random() * (max - min) + min;
  return Number(randomNum.toFixed(decimals));
};

// Convert number to string with proper formatting
const formatNumber = (num: number): string => num.toString();

// Utility function to get a truly random boolean with varying probability
const getRandomBoolean = (trueProb: number = 0.5): boolean => {
  return Math.random() < trueProb;
};

// Random sample data for Diabetes - Updated for more variation
export const getRandomDiabetesData = () => {
  // Determine if we want to generate a likely diabetic or non-diabetic profile
  const isDiabeticProfile = getRandomBoolean(0.4); // 40% chance of diabetic profile
  
  return {
    Pregnancies: formatNumber(getRandomNumber(0, isDiabeticProfile ? 17 : 8)),
    Glucose: formatNumber(getRandomNumber(isDiabeticProfile ? 120 : 70, isDiabeticProfile ? 200 : 120)),
    BloodPressure: formatNumber(getRandomNumber(isDiabeticProfile ? 80 : 50, isDiabeticProfile ? 130 : 90)),
    SkinThickness: formatNumber(getRandomNumber(isDiabeticProfile ? 25 : 0, isDiabeticProfile ? 60 : 30)),
    Insulin: formatNumber(getRandomNumber(isDiabeticProfile ? 150 : 0, isDiabeticProfile ? 850 : 150)),
    BMI: formatNumber(getRandomNumber(isDiabeticProfile ? 27 : 15, isDiabeticProfile ? 60 : 27, 1)),
    DiabetesPedigreeFunction: formatNumber(getRandomNumber(isDiabeticProfile ? 0.8 : 0.1, isDiabeticProfile ? 2.5 : 0.8, 3)),
    Age: formatNumber(getRandomNumber(isDiabeticProfile ? 40 : 21, isDiabeticProfile ? 85 : 40))
  };
};

// Random sample data for Heart Disease - Updated for more variation based on Kaggle dataset
export const getRandomHeartData = () => {
  // Create a function to generate positive and negative heart disease profiles with equal probability
  const generateHeartProfile = () => {
    // 50% chance of generating a positive heart disease profile
    const isPositiveProfile = Math.random() < 0.5;
    
    // Values based on the Kaggle Heart_Disease_Prediction.csv dataset
    if (isPositiveProfile) {
      // Positive heart disease profile (values that tend to indicate heart disease)
      return {
        age: formatNumber(getRandomNumber(55, 75)),
        sex: formatNumber(getRandomNumber(0, 1)), // More males have heart disease, but keep it random
        cp: formatNumber(getRandomNumber(2, 4)), // Higher chest pain types (2-4) more indicative of heart disease
        trestbps: formatNumber(getRandomNumber(130, 200)), // Higher blood pressure
        chol: formatNumber(getRandomNumber(240, 400)), // Higher cholesterol
        fbs: formatNumber(getRandomNumber(0, 1, 0)), // Random fasting blood sugar
        restecg: formatNumber(getRandomNumber(0, 2, 0)), // Random resting ECG
        thalach: formatNumber(getRandomNumber(100, 150)), // Lower max heart rate (unhealthy)
        exang: formatNumber(1), // Exercise-induced angina (1 = yes)
        oldpeak: formatNumber(getRandomNumber(1.5, 4.0, 1)), // Higher ST depression
        slope: formatNumber(getRandomNumber(0, 2, 0)), // Random slope
        ca: formatNumber(getRandomNumber(1, 3, 0)), // More vessels colored by fluoroscopy
        thal: formatNumber(getRandomNumber(6, 7, 0)) // Thalassemia (6-7 more indicative of disease)
      };
    } else {
      // Negative heart disease profile (healthy values)
      return {
        age: formatNumber(getRandomNumber(30, 55)),
        sex: formatNumber(getRandomNumber(0, 1)), // Random gender
        cp: formatNumber(getRandomNumber(1, 2)), // Lower chest pain types (1-2)
        trestbps: formatNumber(getRandomNumber(100, 130)), // Normal blood pressure
        chol: formatNumber(getRandomNumber(150, 240)), // Normal cholesterol
        fbs: formatNumber(0), // Normal fasting blood sugar
        restecg: formatNumber(getRandomNumber(0, 1, 0)), // Normal resting ECG
        thalach: formatNumber(getRandomNumber(150, 190)), // Higher max heart rate (healthy)
        exang: formatNumber(0), // No exercise-induced angina
        oldpeak: formatNumber(getRandomNumber(0, 1.0, 1)), // Lower ST depression
        slope: formatNumber(getRandomNumber(1, 2, 0)), // Upsloping or flat
        ca: formatNumber(0), // No vessels colored
        thal: formatNumber(getRandomNumber(3, 3, 0)) // Normal thalassemia
      };
    }
  };
  
  return generateHeartProfile();
};

// Random sample data for Liver Disease - Updated for more variation based on Kaggle dataset
export const getRandomLiverData = () => {
  // Create a function to generate positive and negative liver disease profiles with equal probability
  const generateLiverProfile = () => {
    // 50% chance of generating a positive liver disease profile
    const isPositiveProfile = Math.random() < 0.5;
    
    // Values based on the Kaggle indian_liver_patient.csv dataset
    if (isPositiveProfile) {
      // Positive liver disease profile (values that tend to indicate liver disease)
      return {
        age: formatNumber(getRandomNumber(40, 65)),
        gender: formatNumber(getRandomNumber(0, 1)), // Random gender
        total_bilirubin: formatNumber(getRandomNumber(1.5, 20.0, 1)), // Higher bilirubin
        direct_bilirubin: formatNumber(getRandomNumber(0.5, 10.0, 1)), // Higher direct bilirubin
        alkaline_phosphotase: formatNumber(getRandomNumber(290, 700)), // Higher alkaline phosphatase
        alamine_aminotransferase: formatNumber(getRandomNumber(60, 1350)), // Higher ALT
        aspartate_aminotransferase: formatNumber(getRandomNumber(60, 1600)), // Higher AST
        total_proteins: formatNumber(getRandomNumber(5.0, 7.0, 1)), // Lower protein range
        albumin: formatNumber(getRandomNumber(2.5, 3.5, 1)), // Lower albumin
        albumin_globulin_ratio: formatNumber(getRandomNumber(0.4, 0.9, 2)) // Lower A/G ratio
      };
    } else {
      // Negative liver disease profile (healthy values)
      return {
        age: formatNumber(getRandomNumber(20, 45)),
        gender: formatNumber(getRandomNumber(0, 1)), // Random gender
        total_bilirubin: formatNumber(getRandomNumber(0.4, 1.0, 1)), // Normal bilirubin
        direct_bilirubin: formatNumber(getRandomNumber(0.1, 0.3, 1)), // Normal direct bilirubin
        alkaline_phosphotase: formatNumber(getRandomNumber(150, 250)), // Normal alkaline phosphatase
        alamine_aminotransferase: formatNumber(getRandomNumber(10, 40)), // Normal ALT
        aspartate_aminotransferase: formatNumber(getRandomNumber(10, 40)), // Normal AST
        total_proteins: formatNumber(getRandomNumber(6.5, 8.5, 1)), // Normal protein range
        albumin: formatNumber(getRandomNumber(3.5, 5.5, 1)), // Normal albumin
        albumin_globulin_ratio: formatNumber(getRandomNumber(1.0, 2.0, 2)) // Normal A/G ratio
      };
    }
  };
  
  return generateLiverProfile();
};

// Random sample data for Parkinsons Disease - Updated for more variation
export const getRandomParkinsonsData = () => {
  // Determine if we want to generate a likely Parkinson's or healthy profile
  const isParkinsonsProfile = getRandomBoolean(0.4); // 40% chance of Parkinson's profile
  
  return {
    Fo: formatNumber(getRandomNumber(isParkinsonsProfile ? 80 : 120, isParkinsonsProfile ? 120 : 260, 3)),
    Fhi: formatNumber(getRandomNumber(isParkinsonsProfile ? 80 : 120, isParkinsonsProfile ? 120 : 260, 3)),
    Flo: formatNumber(getRandomNumber(isParkinsonsProfile ? 80 : 120, isParkinsonsProfile ? 120 : 260, 3)),
    jitterPercent: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.5 : 0, isParkinsonsProfile ? 1 : 0.5, 3)),
    jitterAbs: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.0005 : 0, isParkinsonsProfile ? 0.001 : 0.0005, 6)),
    RAP: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.001 : 0, isParkinsonsProfile ? 0.003 : 0.001, 6)),
    PPQ: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.001 : 0, isParkinsonsProfile ? 0.003 : 0.001, 6)),
    DDP: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.001 : 0, isParkinsonsProfile ? 0.003 : 0.001, 6)),
    Shimmer: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.1 : 0, isParkinsonsProfile ? 0.2 : 0.1, 3)),
    shimmerDb: formatNumber(getRandomNumber(isParkinsonsProfile ? 1 : 0, isParkinsonsProfile ? 2 : 1, 3)),
    APQ3: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.02 : 0, isParkinsonsProfile ? 0.05 : 0.02, 3)),
    APQ5: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.02 : 0, isParkinsonsProfile ? 0.05 : 0.02, 3)),
    APQ: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.05 : 0, isParkinsonsProfile ? 0.15 : 0.05, 3)),
    DDA: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.05 : 0, isParkinsonsProfile ? 0.15 : 0.05, 3)),
    NHR: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.2 : 0, isParkinsonsProfile ? 0.5 : 0.2, 3)),
    HNR: formatNumber(getRandomNumber(isParkinsonsProfile ? 0 : 20, isParkinsonsProfile ? 20 : 40, 3)),
    RPDE: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.5 : 0, isParkinsonsProfile ? 1 : 0.5, 3)),
    DFA: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.5 : 0, isParkinsonsProfile ? 1 : 0.5, 3)),
    spread1: formatNumber(getRandomNumber(isParkinsonsProfile ? -8 : -4, isParkinsonsProfile ? 0 : 8, 3)),
    spread2: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.5 : 0, isParkinsonsProfile ? 1 : 0.5, 3)),
    D2: formatNumber(getRandomNumber(isParkinsonsProfile ? 2 : 0, isParkinsonsProfile ? 5 : 2, 3)),
    PPE: formatNumber(getRandomNumber(isParkinsonsProfile ? 0.5 : 0, isParkinsonsProfile ? 1 : 0.5, 3))
  };
};

// Random sample data for Kidney Disease - Updated for more variation
export const getRandomKidneyData = () => {
  // Determine if we want to generate a likely kidney disease or healthy profile
  const isKidneyDiseaseProfile = getRandomBoolean(0.4); // 40% chance of kidney disease profile
  
  return {
    age: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 40 : 2, isKidneyDiseaseProfile ? 90 : 40)),
    bp: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 130 : 50, isKidneyDiseaseProfile ? 180 : 130)),
    sg: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 1.005 : 1.015, isKidneyDiseaseProfile ? 1.015 : 1.025, 3)),
    al: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 1 : 0, isKidneyDiseaseProfile ? 5 : 1)),
    su: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 1 : 0, isKidneyDiseaseProfile ? 5 : 1)),
    rbc: isKidneyDiseaseProfile ? (Math.random() > 0.7 ? "normal" : "abnormal") : (Math.random() > 0.3 ? "normal" : "abnormal"),
    pc: isKidneyDiseaseProfile ? (Math.random() > 0.7 ? "normal" : "abnormal") : (Math.random() > 0.3 ? "normal" : "abnormal"),
    pcc: isKidneyDiseaseProfile ? (Math.random() > 0.7 ? "notpresent" : "present") : (Math.random() > 0.3 ? "notpresent" : "present"),
    ba: isKidneyDiseaseProfile ? (Math.random() > 0.7 ? "notpresent" : "present") : (Math.random() > 0.3 ? "notpresent" : "present"),
    bgr: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 200 : 70, isKidneyDiseaseProfile ? 490 : 200)),
    bu: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 50 : 10, isKidneyDiseaseProfile ? 200 : 50)),
    sc: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 1.3 : 0.4, isKidneyDiseaseProfile ? 15 : 1.3, 1)),
    sod: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 110 : 135, isKidneyDiseaseProfile ? 135 : 150)),
    pot: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 2 : 3.5, isKidneyDiseaseProfile ? 3.5 : 7, 1)),
    hemo: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 3.1 : 12, isKidneyDiseaseProfile ? 12 : 17.8, 1)),
    pcv: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 9 : 36, isKidneyDiseaseProfile ? 36 : 54)),
    wc: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 3800 : 5000, isKidneyDiseaseProfile ? 15000 : 21000)),
    rc: formatNumber(getRandomNumber(isKidneyDiseaseProfile ? 2.1 : 4, isKidneyDiseaseProfile ? 4 : 8, 1)),
    htn: isKidneyDiseaseProfile ? (Math.random() > 0.3 ? "yes" : "no") : (Math.random() > 0.7 ? "yes" : "no"),
    dm: isKidneyDiseaseProfile ? (Math.random() > 0.3 ? "yes" : "no") : (Math.random() > 0.7 ? "yes" : "no"),
    cad: isKidneyDiseaseProfile ? (Math.random() > 0.3 ? "yes" : "no") : (Math.random() > 0.7 ? "yes" : "no"),
    appet: isKidneyDiseaseProfile ? (Math.random() > 0.3 ? "poor" : "good") : (Math.random() > 0.7 ? "poor" : "good"),
    pe: isKidneyDiseaseProfile ? (Math.random() > 0.3 ? "yes" : "no") : (Math.random() > 0.7 ? "yes" : "no"),
    ane: isKidneyDiseaseProfile ? (Math.random() > 0.3 ? "yes" : "no") : (Math.random() > 0.7 ? "yes" : "no")
  };
};

// Random sample data for Breast Cancer - Updated for more variation
export const getRandomBreastData = () => {
  // Determine if we want to generate a likely malignant or benign profile
  const isMalignantProfile = getRandomBoolean(0.4); // 40% chance of malignant profile
  
  return {
    radius_mean: formatNumber(getRandomNumber(isMalignantProfile ? 15 : 6, isMalignantProfile ? 28 : 15, 2)),
    texture_mean: formatNumber(getRandomNumber(isMalignantProfile ? 18 : 9, isMalignantProfile ? 40 : 18, 2)),
    perimeter_mean: formatNumber(getRandomNumber(isMalignantProfile ? 90 : 40, isMalignantProfile ? 190 : 90, 2)),
    area_mean: formatNumber(getRandomNumber(isMalignantProfile ? 650 : 200, isMalignantProfile ? 2500 : 650, 2)),
    smoothness_mean: formatNumber(getRandomNumber(isMalignantProfile ? 0.1 : 0.05, isMalignantProfile ? 0.16 : 0.1, 4)),
    compactness_mean: formatNumber(getRandomNumber(isMalignantProfile ? 0.1 : 0.02, isMalignantProfile ? 0.35 : 0.1, 4)),
    concavity_mean: formatNumber(getRandomNumber(isMalignantProfile ? 0.1 : 0, isMalignantProfile ? 0.43 : 0.1, 4)),
    concave_points_mean: formatNumber(getRandomNumber(isMalignantProfile ? 0.05 : 0, isMalignantProfile ? 0.2 : 0.05, 4)),
    symmetry_mean: formatNumber(getRandomNumber(isMalignantProfile ? 0.18 : 0.1, isMalignantProfile ? 0.3 : 0.18, 4)),
    fractal_dimension_mean: formatNumber(getRandomNumber(isMalignantProfile ? 0.05 : 0.04, isMalignantProfile ? 0.1 : 0.05, 4)),
    radius_se: formatNumber(getRandomNumber(isMalignantProfile ? 0.4 : 0.1, isMalignantProfile ? 2 : 0.4, 3)),
    texture_se: formatNumber(getRandomNumber(isMalignantProfile ? 1 : 0.3, isMalignantProfile ? 4 : 1, 3)),
    perimeter_se: formatNumber(getRandomNumber(isMalignantProfile ? 3 : 0.5, isMalignantProfile ? 20 : 3, 3)),
    area_se: formatNumber(getRandomNumber(isMalignantProfile ? 30 : 5, isMalignantProfile ? 500 : 30, 3)),
    smoothness_se: formatNumber(getRandomNumber(isMalignantProfile ? 0.006 : 0.001, isMalignantProfile ? 0.02 : 0.006, 5)),
    compactness_se: formatNumber(getRandomNumber(isMalignantProfile ? 0.02 : 0.005, isMalignantProfile ? 0.16 : 0.02, 5)),
    concavity_se: formatNumber(getRandomNumber(isMalignantProfile ? 0.02 : 0, isMalignantProfile ? 0.4 : 0.02, 5)),
    concave_points_se: formatNumber(getRandomNumber(isMalignantProfile ? 0.01 : 0, isMalignantProfile ? 0.05 : 0.01, 5)),
    symmetry_se: formatNumber(getRandomNumber(isMalignantProfile ? 0.02 : 0.008, isMalignantProfile ? 0.08 : 0.02, 5)),
    fractal_dimension_se: formatNumber(getRandomNumber(isMalignantProfile ? 0.003 : 0.0008, isMalignantProfile ? 0.03 : 0.003, 5)),
    radius_worst: formatNumber(getRandomNumber(isMalignantProfile ? 18 : 7, isMalignantProfile ? 36 : 18, 2)),
    texture_worst: formatNumber(getRandomNumber(isMalignantProfile ? 25 : 12, isMalignantProfile ? 50 : 25, 2)),
    perimeter_worst: formatNumber(getRandomNumber(isMalignantProfile ? 110 : 50, isMalignantProfile ? 250 : 110, 2)),
    area_worst: formatNumber(getRandomNumber(isMalignantProfile ? 800 : 250, isMalignantProfile ? 4000 : 800, 2)),
    smoothness_worst: formatNumber(getRandomNumber(isMalignantProfile ? 0.13 : 0.07, isMalignantProfile ? 0.22 : 0.13, 4)),
    compactness_worst: formatNumber(getRandomNumber(isMalignantProfile ? 0.25 : 0.03, isMalignantProfile ? 1.1 : 0.25, 4)),
    concavity_worst: formatNumber(getRandomNumber(isMalignantProfile ? 0.3 : 0, isMalignantProfile ? 1.3 : 0.3, 4)),
    concave_points_worst: formatNumber(getRandomNumber(isMalignantProfile ? 0.15 : 0, isMalignantProfile ? 0.3 : 0.15, 4)),
    symmetry_worst: formatNumber(getRandomNumber(isMalignantProfile ? 0.3 : 0.15, isMalignantProfile ? 0.7 : 0.3, 4)),
    fractal_dimension_worst: formatNumber(getRandomNumber(isMalignantProfile ? 0.08 : 0.055, isMalignantProfile ? 0.2 : 0.08, 4))
  };
};

// Random sample data for Lung Cancer - Updated for more variation based on Kaggle dataset
export const getRandomLungData = () => {
  // Create a function to generate positive and negative lung cancer profiles with equal probability
  const generateLungProfile = () => {
    // 50% chance of generating a positive lung cancer profile
    const isPositiveProfile = Math.random() < 0.5;
    
    // Values based on the Kaggle lung_cancer.csv dataset
    if (isPositiveProfile) {
      // Positive lung cancer profile (values that tend to indicate lung cancer)
      return {
        gender: Math.random() > 0.5 ? "M" : "F", // Random gender
        age: getRandomNumber(55, 80), // Older age
        smoking: 2, // Heavy smoking
        yellow_fingers: 2, // Yellow fingers present
        anxiety: getRandomNumber(1, 2), // Anxiety may be present
        peer_pressure: getRandomNumber(1, 2), // Peer pressure may be present
        chronic_disease: 2, // Chronic disease present
        fatigue: 2, // Fatigue present
        allergy: getRandomNumber(1, 2), // Allergy may be present
        wheezing: 2, // Wheezing present
        alcohol_consuming: getRandomNumber(1, 2), // Alcohol consumption may be present
        coughing: 2, // Coughing present
        shortness_of_breath: 2, // Shortness of breath present
        swallowing_difficulty: getRandomNumber(1, 2), // Swallowing difficulty may be present
        chest_pain: 2 // Chest pain present
      };
    } else {
      // Negative lung cancer profile (healthy values)
      return {
        gender: Math.random() > 0.5 ? "M" : "F", // Random gender
        age: getRandomNumber(20, 50), // Younger age
        smoking: 1, // Light or no smoking
        yellow_fingers: 1, // No yellow fingers
        anxiety: 1, // No anxiety
        peer_pressure: 1, // No peer pressure
        chronic_disease: 1, // No chronic disease
        fatigue: 1, // No fatigue
        allergy: getRandomNumber(1, 2), // Allergy may be present (not strongly correlated)
        wheezing: 1, // No wheezing
        alcohol_consuming: getRandomNumber(1, 2), // Alcohol consumption may be present (not strongly correlated)
        coughing: 1, // No coughing
        shortness_of_breath: 1, // No shortness of breath
        swallowing_difficulty: 1, // No swallowing difficulty
        chest_pain: 1 // No chest pain
      };
    }
  };
  
  return generateLungProfile();
};
