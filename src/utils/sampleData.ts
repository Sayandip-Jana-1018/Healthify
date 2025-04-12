// Utility function to get random number between min and max (inclusive)
const getRandomNumber = (min: number, max: number, decimals: number = 0): number => {
  const randomNum = Math.random() * (max - min) + min;
  return Number(randomNum.toFixed(decimals));
};

// Convert number to string with proper formatting
const formatNumber = (num: number): string => num.toString();

// Random sample data for Diabetes
export const getRandomDiabetesData = () => ({
  Pregnancies: formatNumber(getRandomNumber(0, 17)),
  Glucose: formatNumber(getRandomNumber(70, 200)),
  BloodPressure: formatNumber(getRandomNumber(50, 130)),
  SkinThickness: formatNumber(getRandomNumber(0, 60)),
  Insulin: formatNumber(getRandomNumber(0, 850)),
  BMI: formatNumber(getRandomNumber(15, 60, 1)),
  DiabetesPedigreeFunction: formatNumber(getRandomNumber(0.1, 2.5, 3)),
  Age: formatNumber(getRandomNumber(21, 85))
});

// Random sample data for Heart Disease
export const getRandomHeartData = () => ({
  age: formatNumber(getRandomNumber(25, 85)),
  sex: formatNumber(getRandomNumber(0, 1)),
  cp: formatNumber(getRandomNumber(0, 3)),
  trestbps: formatNumber(getRandomNumber(90, 200)),
  chol: formatNumber(getRandomNumber(120, 570)),
  fbs: formatNumber(getRandomNumber(0, 1)),
  restecg: formatNumber(getRandomNumber(0, 2)),
  thalach: formatNumber(getRandomNumber(70, 210)),
  exang: formatNumber(getRandomNumber(0, 1)),
  oldpeak: formatNumber(getRandomNumber(0, 6.2, 1)),
  slope: formatNumber(getRandomNumber(0, 2)),
  ca: formatNumber(getRandomNumber(0, 4)),
  thal: formatNumber(getRandomNumber(0, 3))
});

// Random sample data for Liver Disease
export const getRandomLiverData = () => ({
  age: formatNumber(getRandomNumber(4, 90)),
  gender: formatNumber(getRandomNumber(0, 1)),
  total_bilirubin: formatNumber(getRandomNumber(0.1, 75, 1)),
  direct_bilirubin: formatNumber(getRandomNumber(0, 20, 1)),
  alkaline_phosphotase: formatNumber(getRandomNumber(60, 2200)),
  alamine_aminotransferase: formatNumber(getRandomNumber(10, 2000)),
  aspartate_aminotransferase: formatNumber(getRandomNumber(10, 5000)),
  total_proteins: formatNumber(getRandomNumber(2, 10, 1)),
  albumin: formatNumber(getRandomNumber(0.9, 6, 1)),
  albumin_globulin_ratio: formatNumber(getRandomNumber(0.3, 3, 1))
});

// Random sample data for Parkinsons Disease
export const getRandomParkinsonsData = () => ({
  Fo: formatNumber(getRandomNumber(80, 260, 3)),
  Fhi: formatNumber(getRandomNumber(80, 260, 3)),
  Flo: formatNumber(getRandomNumber(80, 260, 3)),
  jitterPercent: formatNumber(getRandomNumber(0, 1, 3)),
  jitterAbs: formatNumber(getRandomNumber(0, 0.001, 6)),
  RAP: formatNumber(getRandomNumber(0, 0.003, 6)),
  PPQ: formatNumber(getRandomNumber(0, 0.003, 6)),
  DDP: formatNumber(getRandomNumber(0, 0.003, 6)),
  Shimmer: formatNumber(getRandomNumber(0, 0.2, 3)),
  shimmerDb: formatNumber(getRandomNumber(0, 2, 3)),
  APQ3: formatNumber(getRandomNumber(0, 0.05, 3)),
  APQ5: formatNumber(getRandomNumber(0, 0.05, 3)),
  APQ: formatNumber(getRandomNumber(0, 0.15, 3)),
  DDA: formatNumber(getRandomNumber(0, 0.15, 3)),
  NHR: formatNumber(getRandomNumber(0, 0.5, 3)),
  HNR: formatNumber(getRandomNumber(0, 40, 3)),
  RPDE: formatNumber(getRandomNumber(0, 1, 3)),
  DFA: formatNumber(getRandomNumber(0, 1, 3)),
  spread1: formatNumber(getRandomNumber(-8, 8, 3)),
  spread2: formatNumber(getRandomNumber(0, 1, 3)),
  D2: formatNumber(getRandomNumber(0, 5, 3)),
  PPE: formatNumber(getRandomNumber(0, 1, 3))
});

// Random sample data for Kidney Disease
export const getRandomKidneyData = () => ({
  age: formatNumber(getRandomNumber(2, 90)),
  bp: formatNumber(getRandomNumber(50, 180)),
  sg: formatNumber(getRandomNumber(1.005, 1.025, 3)),
  al: formatNumber(getRandomNumber(0, 5)),
  su: formatNumber(getRandomNumber(0, 5)),
  rbc: Math.random() > 0.5 ? "normal" : "abnormal",
  pc: Math.random() > 0.5 ? "normal" : "abnormal",
  pcc: Math.random() > 0.5 ? "present" : "notpresent",
  ba: Math.random() > 0.5 ? "present" : "notpresent",
  bgr: formatNumber(getRandomNumber(70, 490)),
  bu: formatNumber(getRandomNumber(10, 200)),
  sc: formatNumber(getRandomNumber(0.4, 15, 1)),
  sod: formatNumber(getRandomNumber(110, 150)),
  pot: formatNumber(getRandomNumber(2, 7, 1)),
  hemo: formatNumber(getRandomNumber(3.1, 17.8, 1)),
  pcv: formatNumber(getRandomNumber(9, 54)),
  wc: formatNumber(getRandomNumber(3800, 21000)),
  rc: formatNumber(getRandomNumber(2.1, 8, 1)),
  htn: Math.random() > 0.5 ? "yes" : "no",
  dm: Math.random() > 0.5 ? "yes" : "no",
  cad: Math.random() > 0.5 ? "yes" : "no",
  appet: Math.random() > 0.5 ? "good" : "poor",
  pe: Math.random() > 0.5 ? "yes" : "no",
  ane: Math.random() > 0.5 ? "yes" : "no"
});

// Random sample data for Breast Cancer
export const getRandomBreastData = () => ({
  radius_mean: formatNumber(getRandomNumber(6, 28, 2)),
  texture_mean: formatNumber(getRandomNumber(9, 40, 2)),
  perimeter_mean: formatNumber(getRandomNumber(43, 190, 2)),
  area_mean: formatNumber(getRandomNumber(140, 2500)),
  smoothness_mean: formatNumber(getRandomNumber(0.05, 0.16, 4)),
  compactness_mean: formatNumber(getRandomNumber(0.02, 0.35, 4)),
  concavity_mean: formatNumber(getRandomNumber(0, 0.5, 4)),
  concave_points_mean: formatNumber(getRandomNumber(0, 0.2, 4)),
  symmetry_mean: formatNumber(getRandomNumber(0.1, 0.3, 4)),
  fractal_dimension_mean: formatNumber(getRandomNumber(0.05, 0.1, 4)),
  radius_se: formatNumber(getRandomNumber(0.1, 2.9, 4)),
  texture_se: formatNumber(getRandomNumber(0.3, 4.5, 4)),
  perimeter_se: formatNumber(getRandomNumber(0.7, 22, 4)),
  area_se: formatNumber(getRandomNumber(6, 550)),
  smoothness_se: formatNumber(getRandomNumber(0.001, 0.03, 6)),
  compactness_se: formatNumber(getRandomNumber(0.002, 0.14, 6)),
  concavity_se: formatNumber(getRandomNumber(0, 0.4, 6)),
  concave_points_se: formatNumber(getRandomNumber(0, 0.05, 6)),
  symmetry_se: formatNumber(getRandomNumber(0.008, 0.08, 6)),
  fractal_dimension_se: formatNumber(getRandomNumber(0.001, 0.03, 6)),
  radius_worst: formatNumber(getRandomNumber(7, 36, 2)),
  texture_worst: formatNumber(getRandomNumber(12, 50, 2)),
  perimeter_worst: formatNumber(getRandomNumber(50, 250, 2)),
  area_worst: formatNumber(getRandomNumber(180, 4000)),
  smoothness_worst: formatNumber(getRandomNumber(0.07, 0.22, 4)),
  compactness_worst: formatNumber(getRandomNumber(0.03, 1.1, 4)),
  concavity_worst: formatNumber(getRandomNumber(0, 1.3, 4)),
  concave_points_worst: formatNumber(getRandomNumber(0, 0.3, 4)),
  symmetry_worst: formatNumber(getRandomNumber(0.15, 0.7, 4)),
  fractal_dimension_worst: formatNumber(getRandomNumber(0.05, 0.2, 4))
});

// Random sample data for Lung Cancer
export const getRandomLungData = () => ({
  gender: Math.random() > 0.5 ? "M" : "F",
  age: formatNumber(getRandomNumber(20, 90)),
  smoking: formatNumber(getRandomNumber(0, 1)),
  yellow_fingers: formatNumber(getRandomNumber(0, 1)),
  anxiety: formatNumber(getRandomNumber(0, 1)),
  peer_pressure: formatNumber(getRandomNumber(0, 1)),
  chronic_disease: formatNumber(getRandomNumber(0, 1)),
  fatigue: formatNumber(getRandomNumber(0, 1)),
  allergy: formatNumber(getRandomNumber(0, 1)),
  wheezing: formatNumber(getRandomNumber(0, 1)),
  alcohol_consuming: formatNumber(getRandomNumber(0, 1)),
  coughing: formatNumber(getRandomNumber(0, 1)),
  shortness_of_breath: formatNumber(getRandomNumber(0, 1)),
  swallowing_difficulty: formatNumber(getRandomNumber(0, 1)),
  chest_pain: formatNumber(getRandomNumber(0, 1))
});
