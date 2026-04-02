from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import random
import joblib
import pandas as pd

# Add the current directory to sys.path to find utils
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from utils.recommendation import get_recommendations, get_heatmap_data
from utils.sms_service import generate_sms, send_sms

app = Flask(__name__)
CORS(app) # Enable CORS for React interaction

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'fishing_model_v2.pkl')
DATA_PATH = os.path.join(BASE_DIR, 'data', 'clean_fishing_dataset.csv')

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        
        user_lat = data.get('lat')
        user_lon = data.get('lon')
        boat_type = data.get('boat_type', 'small')
        fuel = data.get('fuel', 0)
        max_dist = data.get('max_distance', 10)
        
        if user_lat is None or user_lon is None:
            return jsonify({"error": "Missing location (lat/lon)"}), 400
        
        # Get recommendations
        results = get_recommendations(
            user_lat, user_lon, boat_type, fuel, float(max_dist), MODEL_PATH, DATA_PATH
        )
        
        # Execute perfectly synchronized SMS utilizing the top real recommendation
        phone = data.get('phone', '+919344878312')
        if results.get('recommendations') and len(results['recommendations']) > 0:
            top_rec = results['recommendations'][0]
            sms_message = generate_sms(
                user_lat, user_lon, 
                top_rec['lat'], top_rec['lon'], 
                top_rec['status'], 
                top_rec.get('boats', 'Unknown')
            )
            # Dispatch synchronously or block? The Twilio API is fast enough for blocking
            sms_sent = send_sms(phone, sms_message)
            results['sms_sent'] = sms_sent
            
        return jsonify(results)
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "SeaGuard AI Backend Online"})

@app.route('/heatmap', methods=['GET'])
def heatmap():
    try:
        points = get_heatmap_data(MODEL_PATH, DATA_PATH)
        return jsonify({"heatmap_points": points})
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
