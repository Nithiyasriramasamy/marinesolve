import pandas as pd
import numpy as np
import joblib
import os
from math import radians, cos, sin, asin, sqrt

def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 
    return c * r



def get_recommendations(user_lat, user_lon, boat_type, fuel, max_dist_limit, model_path, data_path):
    if not os.path.exists(model_path) or not os.path.exists(data_path):
        return {"error": "Model or dataset not found"}

    model = joblib.load(model_path)
    df = pd.read_csv(data_path)

    # 1. Distances for all points
    df['distance'] = df.apply(lambda row: haversine(user_lat, user_lon, row['lat'], row['lon']), axis=1)

    boat_limits = {
        "small": 10,
        "medium": 30,
        "large": float('inf')
    }
    
    # User's primary search circle
    allowed_max_dist = min(max_dist_limit, boat_limits.get(boat_type.lower(), 10))
    
    # Attempt 1: SAFE zones within Boat Range
    features = ['sst', 'chlorophyll', 'boats', 'pfz']
    
    # Safety score mapping for 4-tier labels
    safety_map = {
        "SAFE": 1.0,
        "MODERATE": 0.5,
        "HIGH_RISK": 0.2,
        "LOW_AVAILABILITY": 0.0
    }

    def process_row(row):
        X = pd.DataFrame([row[features]])
        status = model.predict(X)[0]  # Now returns string label directly
        safety_score = safety_map.get(status, 0.0)
        return status, safety_score

    # Find ANY zones within local range first
    nearby_df = df[df['distance'] <= allowed_max_dist].copy()
    
    is_fallback = False
    message = ""

    # Sort all points by proximity for easy access
    sorted_df = df.sort_values(by='distance')

    if nearby_df.empty:
        # Fallback: Find Top 5 nearest absolute points globally
        nearby_df = sorted_df.head(5).copy()
        is_fallback = True
        message = "No zones within typical range. Displaying nearest global fishing zones."
    else:
        message = f"Found {len(nearby_df)} zones in your area."

    results = []
    for idx, row in nearby_df.iterrows():
        status, safety_score = process_row(row)
        dist = float(row['distance'])
        distance_score = 1 / (1 + dist)
        
        final_score = (0.6 * safety_score) + (0.4 * distance_score)
        
        results.append({
            "lat": float(row['lat']),
            "lon": float(row['lon']),
            "distance": round(dist, 2),
            "status": status,
            "safety_score": float(safety_score),
            "final_score": float(final_score),
            "sst": float(row['sst']),
            "chlorophyll": float(row['chlorophyll']),
            "boats": int(row['boats']),
            "is_fallback": is_fallback
        })

    # Rank results: 
    # Sort backwards by final_score (highest is best)
    results.sort(key=lambda x: x['final_score'], reverse=True)
    
    # Cap to top 3 and assign absolute rank
    top_results = results[:3]
    for i, item in enumerate(top_results):
        item['rank'] = i + 1

    return {
        "recommendations": top_results,
        "boat_limit": allowed_max_dist,
        "message": message,
        "is_fallback": is_fallback
    }

def get_heatmap_data(model_path, data_path):
    if not os.path.exists(model_path) or not os.path.exists(data_path):
        return []

    model = joblib.load(model_path)
    df = pd.read_csv(data_path)
    
    features = ['sst', 'chlorophyll', 'boats', 'pfz']
    X_all = df[features]
    
    # Vectorized prediction for speed
    preds = model.predict(X_all)
    
    intensity_map = {
        "SAFE": 0.9,
        "MODERATE": 0.6,
        "HIGH_RISK": 0.3,
        "LOW_AVAILABILITY": 0.1
    }
    
    heatmap_points = []
    for i, row in df.iterrows():
        intensity = intensity_map.get(preds[i], 0.1)
        heatmap_points.append([float(row['lat']), float(row['lon']), intensity])
        
    return heatmap_points
