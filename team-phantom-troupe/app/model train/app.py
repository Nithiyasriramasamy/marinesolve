from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# --- Configuration & Model Loading ---
MODEL_PATH = 'fishing_model.pkl'
# Attempt to load either of the possible dataset names
DATASET_PATH = 'pfz_ml_dataset.csv' if os.path.exists('pfz_ml_dataset.csv') else 'clean_fishing_dataset.csv'

model = None
df_coords = None

# Load the trained ML model
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print(f"Model loaded successfully from {MODEL_PATH}")
    except Exception as e:
        print(f"Error loading model: {e}")

# Load the dataset for coordinate-based PFZ lookup
if os.path.exists(DATASET_PATH):
    try:
        df_coords = pd.read_csv(DATASET_PATH)
        print(f"Dataset loaded successfully from {DATASET_PATH}")
    except Exception as e:
        print(f"Error loading dataset: {e}")
else:
    print(f"Warning: Dataset not found at {DATASET_PATH}. PFZ automation will fail.")

def get_nearest_pfz(lat, lon):
    """
    Finds the PFZ value of the coordinate in our dataset closest to the given lat/lon.
    Uses simple Euclidean distance for calculation.
    """
    if df_coords is None or df_coords.empty:
        return 1 # Default to 1 if no data is available
    
    # Calculate Euclidean distance to all points in the dataset
    distances = np.sqrt((df_coords['lat'] - lat)**2 + (df_coords['lon'] - lon)**2)
    
    # Find the index of the minimum distance
    nearest_index = distances.idxmin()
    
    # Retrieve the PFZ value for that nearest point
    pfz_value = int(df_coords.loc[nearest_index, 'pfz'])
    return pfz_value

@app.route('/')
def index():
    """Render the main map page."""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """
    Automated prediction endpoint:
    1. Determines PFZ based on nearest coordinate in dataset.
    2. Applies PFZ rule (PFZ=0 -> OVERFISHED).
    3. Uses ML model for PFZ=1 cases.
    """
    try:
        data = request.get_json()
        
        # Extracted user location
        lat = float(data.get('lat'))
        lon = float(data.get('lon'))
        
        # Other environmental features
        sst = float(data.get('sst', 0))
        chlorophyll = float(data.get('chlorophyll', 0))
        boats = float(data.get('boats', 0))
        
        # AUTOMATION: Find the PFZ value based on nearest coordinates
        pfz = get_nearest_pfz(lat, lon)
        
        # Apply deterministic rule: If pfz == 0 → return OVERFISHED
        if pfz == 0:
            result = "OVERFISHED"
            reason = f"Automated Rule: Non-Fishing Zone (PFZ=0) at this location."
        else:
            if model:
                # Prepare features for prediction [sst, chlorophyll, boats, pfz]
                # Using the automated pfz value here
                features = np.array([[sst, chlorophyll, boats, pfz]])
                prediction = model.predict(features)[0]
                result = "OVERFISHED" if prediction == 1 else "SAFE"
                reason = "Model Prediction (Fishing Zone identified)"
            else:
                return jsonify({'error': 'ML model not loaded on server'}), 500
        
        return jsonify({
            'lat': lat,
            'lon': lon,
            'result': result,
            'reason': reason,
            'pfz_used': pfz,
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Running on local development server
    app.run(debug=True, port=5000)
