import pandas as pd
import numpy as np
import os

def prepare_symptoms_array(symptoms):
    '''
    Convert a list of symptoms to a ndim(X) (in this case 131) that matches the
    dataframe used to train the machine learning model

    Output:
    - X (np.array) = X values ready as input to ML model to get prediction
    '''
    # Get the absolute path to the data directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, 'data')
    
    df = pd.read_csv(os.path.join(data_dir, 'clean_dataset.tsv'), sep='\t')
    symptoms_array = np.zeros((1, len(df.columns)-1))  # -1 for target column
    
    # Print available columns for debugging
    print("Available columns:", df.columns.tolist())
    print("Received symptoms:", symptoms)
    
    for symptom in symptoms:
        try:
            # Find the column that matches the symptom (case-insensitive)
            matching_cols = [col for col in df.columns if col.lower() == symptom.lower()]
            if matching_cols:
                symptom_idx = df.columns.get_loc(matching_cols[0])
                symptoms_array[0, symptom_idx] = 1
            else:
                print(f"Warning: Symptom '{symptom}' not found in dataset")
        except Exception as e:
            print(f"Error processing symptom '{symptom}': {str(e)}")
            continue

    return symptoms_array
