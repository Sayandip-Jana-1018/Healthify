import xgboost as xgb
import pandas as pd
import os

class DiseaseModel:

    def __init__(self):
        self.all_symptoms = None
        self.symptoms = None
        self.pred_disease = None
        self.model = xgb.XGBClassifier()
        
        # Get the absolute path to the data directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_dir = os.path.join(current_dir, 'data')
        
        # Load disease list
        dataset_path = os.path.join(self.data_dir, 'dataset.csv')
        self.diseases = self.disease_list(dataset_path)

    def load_xgboost(self, model_path):
        try:
            self.model.load_model(model_path)
            print(f"Successfully loaded model from {model_path}")
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            raise

    def save_xgboost(self, model_path):
        self.model.save_model(model_path)

    def predict(self, X):
        try:
            self.symptoms = X
            disease_pred_idx = self.model.predict(self.symptoms)
            # Convert disease_pred_idx to integer for indexing
            pred_idx = disease_pred_idx[0]
            self.pred_disease = self.diseases[pred_idx]
            disease_probability_array = self.model.predict_proba(self.symptoms)
            disease_probability = disease_probability_array[0, pred_idx]
            return self.pred_disease, disease_probability
        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            raise

    def describe_disease(self, disease_name):
        if disease_name not in self.diseases:
            return "That disease is not contemplated in this model"
        
        try:
            # Read disease dataframe
            desc_path = os.path.join(self.data_dir, 'symptom_Description.csv')
            desc_df = pd.read_csv(desc_path)
            desc_df = desc_df.apply(lambda col: col.str.strip())
            return desc_df[desc_df['Disease'] == disease_name]['Description'].values[0]
        except Exception as e:
            print(f"Error getting disease description: {str(e)}")
            return "Description not available"

    def describe_predicted_disease(self):
        if self.pred_disease is None:
            return "No predicted disease yet"

        return self.describe_disease(self.pred_disease)
    
    def disease_precautions(self, disease_name):
        if disease_name not in self.diseases:
            return "That disease is not contemplated in this model"

        try:
            # Read precautions dataframe
            prec_path = os.path.join(self.data_dir, 'symptom_precaution.csv')
            prec_df = pd.read_csv(prec_path)
            prec_df = prec_df.apply(lambda col: col.str.strip())
            
            # Get precautions for the disease
            precautions = prec_df[prec_df['Disease'] == disease_name].iloc[0, 1:].tolist()
            return [p for p in precautions if pd.notna(p)]
        except Exception as e:
            print(f"Error getting disease precautions: {str(e)}")
            return ["Precautions not available"]

    def predicted_disease_precautions(self):
        if self.pred_disease is None:
            return ["No predicted disease yet"]

        return self.disease_precautions(self.pred_disease)

    def disease_list(self, dataset_path):
        try:
            df = pd.read_csv(dataset_path)
            return df['Disease'].unique()
        except Exception as e:
            print(f"Error loading disease list: {str(e)}")
            raise
