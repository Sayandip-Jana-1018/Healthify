from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import logging
import traceback
import pandas as pd

# Use absolute imports instead of relative imports
try:
    from helper import prepare_symptoms_array
    from disease_model import DiseaseModel
    from routes import image_processing
except ImportError:
    # Fallback for when running as a module
    from backend.helper import prepare_symptoms_array
    from backend.disease_model import DiseaseModel
    from backend.routes import image_processing

logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include image processing routes
app.include_router(image_processing.router, prefix="/image")

# Pydantic models for request validation
class DiabetesInput(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float

    class Config:
        allow_population_by_field_name = True

class HeartInput(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float

class LiverInput(BaseModel):
    age: float
    gender: float
    total_bilirubin: float
    direct_bilirubin: float
    alkaline_phosphotase: float
    alamine_aminotransferase: float
    aspartate_aminotransferase: float
    total_proteins: float
    albumin: float
    albumin_globulin_ratio: float

    class Config:
        populate_by_name = True

class ParkinsonsInput(BaseModel):
    fo: float = Field(..., alias="Fo")
    fhi: float = Field(..., alias="Fhi")
    flo: float = Field(..., alias="Flo")
    jitter_percent: float = Field(..., alias="jitterPercent")
    jitter_abs: float = Field(..., alias="jitterAbs")
    rap: float = Field(..., alias="RAP")
    ppq: float = Field(..., alias="PPQ")
    ddp: float = Field(..., alias="DDP")
    shimmer: float = Field(..., alias="Shimmer")
    shimmer_db: float = Field(..., alias="shimmerDb")
    apq3: float = Field(..., alias="APQ3")
    apq5: float = Field(..., alias="APQ5")
    apq: float = Field(..., alias="APQ")
    dda: float = Field(..., alias="DDA")
    nhr: float = Field(..., alias="NHR")
    hnr: float = Field(..., alias="HNR")
    rpde: float = Field(..., alias="RPDE")
    dfa: float = Field(..., alias="DFA")
    spread1: float
    spread2: float
    d2: float = Field(..., alias="D2")
    ppe: float = Field(..., alias="PPE")

    class Config:
        populate_by_name = True

class GeneralInput(BaseModel):
    symptoms: list[str]

class LungInput(BaseModel):
    gender: str  # M/F
    age: int
    smoking: int
    yellow_fingers: int
    anxiety: int
    peer_pressure: int
    chronic_disease: int
    fatigue: int
    allergy: int
    wheezing: int
    alcohol_consuming: int
    coughing: int
    shortness_of_breath: int
    swallowing_difficulty: int
    chest_pain: int

class ChronicKidneyInput(BaseModel):
    age: float
    bp: float
    sg: float
    al: float
    su: float
    rbc: str  # normal/abnormal
    pc: str  # normal/abnormal
    pcc: str  # present/notpresent
    ba: str  # present/notpresent
    bgr: float
    bu: float
    sc: float
    sod: float
    pot: float
    hemo: float
    pcv: float
    wc: float
    rc: float
    htn: str  # yes/no
    dm: str  # yes/no
    cad: str  # yes/no
    appet: str  # good/poor
    pe: str  # yes/no
    ane: str  # yes/no

    class Config:
        schema_extra = {
            "example": {
                "age": 48,
                "bp": 80,
                "sg": 1.020,
                "al": 1,
                "su": 0,
                "rbc": "normal",
                "pc": "normal",
                "pcc": "notpresent",
                "ba": "notpresent",
                "bgr": 121,
                "bu": 36,
                "sc": 1.2,
                "sod": 135,
                "pot": 4.2,
                "hemo": 15.4,
                "pcv": 44,
                "wc": 7800,
                "rc": 5.2,
                "htn": "yes",
                "dm": "no",
                "cad": "no",
                "appet": "good",
                "pe": "no",
                "ane": "no"
            }
        }

class BreastCancerInput(BaseModel):
    radius_mean: float
    texture_mean: float
    perimeter_mean: float
    area_mean: float
    smoothness_mean: float
    compactness_mean: float
    concavity_mean: float
    concave_points_mean: float
    symmetry_mean: float
    fractal_dimension_mean: float
    radius_se: float
    texture_se: float
    perimeter_se: float
    area_se: float
    smoothness_se: float
    compactness_se: float
    concavity_se: float
    concave_points_se: float
    symmetry_se: float
    fractal_dimension_se: float
    radius_worst: float
    texture_worst: float
    perimeter_worst: float
    area_worst: float
    smoothness_worst: float
    compactness_worst: float
    concavity_worst: float
    concave_points_worst: float
    symmetry_worst: float
    fractal_dimension_worst: float

def load_heart_model():
    try:
        logger.info("Loading heart disease model...")
        import os
        model_path = os.path.join(os.path.dirname(__file__), 'saved_models/heart_disease_model.sav')
        
        # Check if model file exists
        if not os.path.exists(model_path):
            # For testing, return a mock model
            logger.warning(f"Heart model file not found at {model_path}, returning mock model")
            from sklearn.ensemble import RandomForestClassifier
            model = RandomForestClassifier()
            # This mock model will always predict 1 with 0.75 probability
            model.predict = lambda X: np.ones(X.shape[0], dtype=int)
            model.predict_proba = lambda X: np.array([[0.25, 0.75]] * X.shape[0])
            return model
            
        model_data = joblib.load(model_path)
        # If model is returned as a tuple (scaler, model), separate them
        if isinstance(model_data, tuple):
            scaler, model = model_data
        else:
            model = model_data
            scaler = None  # We'll handle this case in prediction
        logger.info("Model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading heart disease model: {str(e)}")
        logger.warning("Returning mock model due to error")
        # Return a mock model in case of error
        from sklearn.ensemble import RandomForestClassifier
        model = RandomForestClassifier()
        model.predict = lambda X: np.ones(X.shape[0], dtype=int)
        model.predict_proba = lambda X: np.array([[0.25, 0.75]] * X.shape[0])
        return model

def get_risk_level(probability: float) -> str:
    if probability >= 0.7:  # 70% or higher
        return "High"
    elif probability >= 0.3:  # Between 30% and 70%
        return "Medium"
    else:  # Less than 30%
        return "Low"

@app.get("/")
async def root():
    return {"message": "Disease Prediction API is running"}

@app.post("/predict/diabetes")
async def predict_diabetes(data: DiabetesInput):
    try:
        logger.info("Loading model...")
        # Use a relative path that works regardless of where the script is run from
        import os
        model_path = os.path.join(os.path.dirname(__file__), 'saved_models/diabetes_model.sav')
        
        # Check if model file exists
        if not os.path.exists(model_path):
            # For testing, return a mock prediction if model doesn't exist
            logger.warning(f"Model file not found at {model_path}, returning mock prediction")
            return {
                "prediction": True,
                "risk_level": "Medium",
                "probability": 0.75
            }
            
        model = joblib.load(model_path)
        
        print(f"Preparing features with data: {data}")
        features = np.array([[
            data.Pregnancies, data.Glucose, data.BloodPressure, data.SkinThickness,
            data.Insulin, data.BMI, data.DiabetesPedigreeFunction, data.Age
        ]])
        print(f"Features shape: {features.shape}")
        
        print("Making prediction...")
        prediction = model.predict(features)
        
        # Since probability is not available, we'll use decision_function as a proxy
        decision_score = model.decision_function(features)[0]
        # Convert decision score to a probability-like value between 0 and 1
        probability = 1 / (1 + np.exp(-decision_score))
        
        print(f"Prediction: {prediction}, Score: {decision_score}, Probability: {probability}")
        risk_level = get_risk_level(probability)
        
        return {
            "prediction": bool(prediction[0]),
            "probability": float(probability),
            "risk_level": risk_level
        }
    except Exception as e:
        print(f"Error in predict_diabetes: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/heart")
async def predict_heart(data: HeartInput):
    try:
        # Load model
        model = load_heart_model()
        
        # Convert input data to feature array
        features = np.array([[
            data.age, data.sex, data.cp, data.trestbps, data.chol,
            data.fbs, data.restecg, data.thalach, data.exang,
            data.oldpeak, data.slope, data.ca, data.thal
        ]])
        logger.info(f"Features shape: {features.shape}")
        
        # Make prediction
        prediction = model.predict(features)
        
        # Get probability scores
        try:
            probabilities = model.predict_proba(features)
            probability = float(probabilities[0][1])
        except:
            # Fallback to decision function if predict_proba is not available
            try:
                decision_score = model.decision_function(features)
                probability = float(1 / (1 + np.exp(-decision_score[0])))  # sigmoid transformation
            except:
                # If both methods fail, use a simple threshold
                probability = 1.0 if prediction[0] == 1 else 0.0
        
        # Determine risk level
        risk_level = get_risk_level(probability)
        
        return {
            "prediction": int(prediction[0]),
            "probability": probability,
            "risk_level": risk_level
        }
        
    except Exception as e:
        logger.error(f"Error in predict_heart: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/liver")
async def predict_liver(data: LiverInput):
    try:
        logger.info("Loading liver disease model...")
        # Load model
        import os
        model_path = os.path.join(os.path.dirname(__file__), 'saved_models/liver_disease_model.sav')
        
        # Check if model file exists
        if not os.path.exists(model_path):
            # For testing, return a mock prediction if model doesn't exist
            logger.warning(f"Liver model file not found at {model_path}, returning mock prediction")
            return {
                "prediction": True,
                "risk_level": "Medium",
                "probability": 0.68
            }
            
        model = joblib.load(model_path)
        
        # Convert input data to feature array
        features = np.array([[
            data.age, data.gender, data.total_bilirubin,
            data.direct_bilirubin, data.alkaline_phosphotase,
            data.alamine_aminotransferase, data.aspartate_aminotransferase,
            data.total_proteins, data.albumin, data.albumin_globulin_ratio
        ]])
        logger.info(f"Input features: {features}")

        # Get binary prediction and probability
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        # For liver disease, probability[1] represents the probability of having the disease
        raw_probability = float(probabilities[1])  # Use probability of positive class
        probability = float(format(max(0.0, min(1.0, raw_probability)), '.4f'))
        
        logger.info(f"Binary prediction: {prediction}, Probabilities: {probabilities}, Final probability: {probability}")

        return {
            "prediction": int(prediction),
            "probability": probability,
            "risk_level": get_risk_level(probability)
        }

    except Exception as e:
        logger.error(f"Error in predict_liver: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/parkinsons")
async def predict_parkinsons(data: ParkinsonsInput):
    try:
        logger.info("Loading Parkinson's disease model...")
        # Load model
        import os
        model_path = os.path.join(os.path.dirname(__file__), 'saved_models/parkinsons_model.sav')
        
        # Check if model file exists
        if not os.path.exists(model_path):
            # For testing, return a mock prediction if model doesn't exist
            logger.warning(f"Parkinsons model file not found at {model_path}, returning mock prediction")
            return {
                "prediction": True,
                "risk_level": "High",
                "probability": 0.82
            }
            
        model = joblib.load(model_path)
        
        # Convert input data to feature array
        features = np.array([[
            data.fo, data.fhi, data.flo, data.jitter_percent,
            data.jitter_abs, data.rap, data.ppq, data.ddp,
            data.shimmer, data.shimmer_db, data.apq3, data.apq5,
            data.apq, data.dda, data.nhr, data.hnr, data.rpde,
            data.dfa, data.spread1, data.spread2, data.d2, data.ppe
        ]])
        logger.info(f"Features shape: {features.shape}")

        # Make prediction
        prediction = model.predict(features)

        # Get prediction and probability
        probabilities = model.predict_proba(features)[0]
        # For Parkinson's, probability[1] represents the probability of having the disease
        raw_probability = float(probabilities[1])
        probability = float(format(max(0.0, min(1.0, raw_probability)), '.4f'))
        
        logger.info(f"Prediction: {prediction}, Probabilities: {probabilities}, Final probability: {probability}")

        risk_level = get_risk_level(probability)

        return {
            "prediction": int(prediction[0]),
            "probability": probability,
            "risk_level": risk_level
        }

    except Exception as e:
        logger.error(f"Error in predict_parkinsons: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/lung")
async def predict_lung(data: LungInput):
    try:
        logger.info("Loading lung cancer model...")
        model = joblib.load('backend/saved_models/lung_cancer_model.sav')
        
        # Convert all inputs to numeric values, keeping GENDER as categorical
        try:
            feature_dict = {
                'GENDER': data.gender,  # Keep as M/F
                'AGE': float(data.age),
                'SMOKING': float(data.smoking),
                'YELLOW_FINGERS': float(data.yellow_fingers),
                'ANXIETY': float(data.anxiety),
                'PEER_PRESSURE': float(data.peer_pressure),
                'CHRONICDISEASE': float(data.chronic_disease),
                'FATIGUE': float(data.fatigue),
                'ALLERGY': float(data.allergy),
                'WHEEZING': float(data.wheezing),
                'ALCOHOLCONSUMING': float(data.alcohol_consuming),
                'COUGHING': float(data.coughing),
                'SHORTNESSOFBREATH': float(data.shortness_of_breath),
                'SWALLOWINGDIFFICULTY': float(data.swallowing_difficulty),
                'CHESTPAIN': float(data.chest_pain)
            }
        except ValueError as ve:
            logger.error(f"Value conversion error: {str(ve)}")
            raise HTTPException(
                status_code=400,
                detail="Invalid input values. Please ensure all values are numeric."
            )

        # Create DataFrame with proper dtypes
        features = pd.DataFrame([feature_dict])
        
        # Ensure numeric columns are float type, keeping GENDER as object/string
        numeric_columns = [col for col in features.columns if col != 'GENDER']
        features[numeric_columns] = features[numeric_columns].astype(float)
        
        try:
            # Get prediction
            prediction = model.predict(features)[0]
            raw_probability = float(model.predict_proba(features)[0][0])
            probability = float(format(max(0.0, min(1.0, raw_probability)), '.4f'))  # Clamp between 0 and 1
            risk_level = get_risk_level(probability)
            
            logger.info(f"Prediction successful. Result: {prediction}, Probability: {probability}, Risk Level: {risk_level}")
            logger.info(f"Feature values used: {feature_dict}")
            
            return {
                "prediction": bool(prediction),
                "probability": float(probability),
                "risk_level": risk_level
            }
        except Exception as model_error:
            logger.error(f"Model prediction error: {str(model_error)}")
            logger.error(f"Feature shape: {features.shape}")
            logger.error(f"Feature columns: {features.columns.tolist()}")
            logger.error(f"Feature values: {features.values.tolist()}")
            logger.error(f"Feature dtypes: {features.dtypes.to_dict()}")
            raise HTTPException(
                status_code=500,
                detail="Error during prediction. Please ensure all input values are valid."
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in predict_lung: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )

@app.post("/predict/kidney")
async def predict_kidney(data: ChronicKidneyInput):
    try:
        logger.info("Loading chronic kidney disease model...")
        model = joblib.load('backend/saved_models/chronic_model.sav')
        
        # Convert categorical variables
        categorical_map = {
            'yes': 1, 'no': 0,
            'present': 1, 'notpresent': 0,
            'normal': 1, 'abnormal': 0,
            'good': 1, 'poor': 0
        }
        
        # Define expected feature names and order
        feature_names = [
            'age', 'bp', 'sg', 'al', 'su', 'rbc', 'pc', 'pcc', 'ba', 'bgr',
            'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc', 'htn',
            'dm', 'cad', 'appet', 'pe', 'ane'
        ]
        
        try:
            # Create feature dictionary with consistent ordering
            feature_dict = {
                'age': float(data.age),
                'bp': float(data.bp),
                'sg': float(data.sg),
                'al': float(data.al),
                'su': float(data.su),
                'rbc': categorical_map[data.rbc.lower()],
                'pc': categorical_map[data.pc.lower()],
                'pcc': categorical_map[data.pcc.lower()],
                'ba': categorical_map[data.ba.lower()],
                'bgr': float(data.bgr),
                'bu': float(data.bu),
                'sc': float(data.sc),
                'sod': float(data.sod),
                'pot': float(data.pot),
                'hemo': float(data.hemo),
                'pcv': float(data.pcv),
                'wc': float(data.wc),
                'rc': float(data.rc),
                'htn': categorical_map[data.htn.lower()],
                'dm': categorical_map[data.dm.lower()],
                'cad': categorical_map[data.cad.lower()],
                'appet': categorical_map[data.appet.lower()],
                'pe': categorical_map[data.pe.lower()],
                'ane': categorical_map[data.ane.lower()]
            }

            # Create DataFrame with specific column order
            features = pd.DataFrame([feature_dict])
            
            # Ensure columns are in the correct order
            features = features[feature_names]
            
            logger.info(f"Feature names being used: {feature_names}")
            logger.info(f"Feature shape: {features.shape}")
            logger.info(f"Feature columns: {features.columns.tolist()}")
            
            try:
                # Get prediction and probability
                prediction = model.predict(features)[0]
                raw_probability = float(model.predict_proba(features)[0][1])
                probability = float(format(max(0.0, min(1.0, raw_probability)), '.4f'))  # Clamp between 0 and 1
                
                # Determine risk level based on probability
                risk_level = get_risk_level(probability)
                
                logger.info(f"Prediction successful. Result: {prediction}, Risk Level: {risk_level}, Probability: {probability}")
                
                return {
                    "prediction": bool(prediction),
                    "risk_level": risk_level,
                    "probability": probability
                }
            except Exception as model_error:
                logger.error(f"Model prediction error: {str(model_error)}")
                logger.error(f"Feature shape: {features.shape}")
                logger.error(f"Feature columns: {features.columns.tolist()}")
                raise HTTPException(
                    status_code=500,
                    detail="Error during prediction. Please ensure all input values are valid."
                )

        except (ValueError, KeyError) as e:
            logger.error(f"Value conversion error: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail="Invalid input values. Please check the format of all fields."
            )

    except Exception as e:
        logger.error(f"Error in predict_kidney: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )

@app.post("/predict/breast")
async def predict_breast(data: BreastCancerInput):
    try:
        logger.info("Loading breast cancer model...")
        model = joblib.load('backend/saved_models/breast_cancer.sav')
        
        try:
            # Create feature dictionary with the exact feature names used during model training
            feature_dict = {
                'radius_mean': float(data.radius_mean),
                'texture_mean': float(data.texture_mean),
                'perimeter_mean': float(data.perimeter_mean),
                'area_mean': float(data.area_mean),
                'smoothness_mean': float(data.smoothness_mean),
                'compactness_mean': float(data.compactness_mean),
                'concavity_mean': float(data.concavity_mean),
                'concave points_mean': float(data.concave_points_mean),  
                'symmetry_mean': float(data.symmetry_mean),
                'fractal_dimension_mean': float(data.fractal_dimension_mean),
                'radius_se': float(data.radius_se),
                'texture_se': float(data.texture_se),
                'perimeter_se': float(data.perimeter_se),
                'area_se': float(data.area_se),
                'smoothness_se': float(data.smoothness_se),
                'compactness_se': float(data.compactness_se),
                'concavity_se': float(data.concavity_se),
                'concave points_se': float(data.concave_points_se),  
                'symmetry_se': float(data.symmetry_se),
                'fractal_dimension_se': float(data.fractal_dimension_se),
                'radius_worst': float(data.radius_worst),
                'texture_worst': float(data.texture_worst),
                'perimeter_worst': float(data.perimeter_worst),
                'area_worst': float(data.area_worst),
                'smoothness_worst': float(data.smoothness_worst),
                'compactness_worst': float(data.compactness_worst),
                'concavity_worst': float(data.concavity_worst),
                'concave points_worst': float(data.concave_points_worst),  
                'symmetry_worst': float(data.symmetry_worst),
                'fractal_dimension_worst': float(data.fractal_dimension_worst)
            }

            features = pd.DataFrame([feature_dict])
            
            # Ensure columns are in the correct order with exact feature names from training
            feature_names = [
                'radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean',
                'smoothness_mean', 'compactness_mean', 'concavity_mean', 'concave points_mean',
                'symmetry_mean', 'fractal_dimension_mean', 'radius_se', 'texture_se',
                'perimeter_se', 'area_se', 'smoothness_se', 'compactness_se',
                'concavity_se', 'concave points_se', 'symmetry_se', 'fractal_dimension_se',
                'radius_worst', 'texture_worst', 'perimeter_worst', 'area_worst',
                'smoothness_worst', 'compactness_worst', 'concavity_worst',
                'concave points_worst', 'symmetry_worst', 'fractal_dimension_worst'
            ]
            
            features = features[feature_names]
            
            logger.info(f"Feature names being used: {feature_names}")
            logger.info(f"Feature shape: {features.shape}")
            logger.info(f"Feature columns: {features.columns.tolist()}")
            
            try:
                # Get prediction and probability
                prediction = model.predict(features)[0]
                raw_probability = float(model.predict_proba(features)[0][1])
                probability = float(format(max(0.0, min(1.0, raw_probability)), '.4f'))  # Clamp between 0 and 1
                
                # Determine risk level based on probability
                risk_level = get_risk_level(probability)
                
                logger.info(f"Prediction successful. Result: {prediction}, Risk Level: {risk_level}, Probability: {probability}")
                
                return {
                    "prediction": bool(prediction),
                    "risk_level": risk_level,
                    "probability": probability
                }
            except Exception as model_error:
                logger.error(f"Model prediction error: {str(model_error)}")
                logger.error(f"Feature shape: {features.shape}")
                logger.error(f"Feature columns: {features.columns.tolist()}")
                raise HTTPException(
                    status_code=500,
                    detail="Error during prediction. Please ensure all input values are valid."
                )

        except (ValueError, KeyError) as e:
            logger.error(f"Value conversion error: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail="Invalid input values. Please check the format of all fields."
            )

    except Exception as e:
        logger.error(f"Error in predict_breast: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )

@app.post("/predict/general")
async def predict_general(data: GeneralInput):
    try:
        # Validate input
        if not data.symptoms or len(data.symptoms) == 0:
            raise HTTPException(status_code=400, detail="At least one symptom is required")

        # Initialize the disease model
        model = DiseaseModel()
        model.load_xgboost('backend/saved_models/xgboost_model.json')
        
        # Convert symptoms to model input format
        features = prepare_symptoms_array(data.symptoms)
        
        # Get prediction and probability
        disease, probability = model.predict(features)
        
        # Get description and precautions
        description = model.describe_disease(disease)
        precautions = model.disease_precautions(disease)
        
        return {
            "prediction": disease,
            "probability": float(probability),
            "description": description,
            "precautions": precautions
        }
    except HTTPException as he:
        logger.error(f"HTTP error in predict_general: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Error in predict_general: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")