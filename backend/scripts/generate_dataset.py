import pandas as pd
import numpy as np
import os
import random

def generate_synthetic_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'clean_fishing_dataset.csv')
    
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return

    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} rows from existing dataset.")
    
    sst_list = []
    chloro_list = []
    boats_list = []
    labels = []
    
    for _, row in df.iterrows():
        pfz = row['pfz']
        
        # Rule 1 & 2: Chlorophyll and SST ranges
        if pfz == 1:
            chloro = random.uniform(0.6, 0.8) + np.random.normal(0, 0.05)
            sst = random.uniform(26, 29) + np.random.normal(0, 0.5)
        else:
            chloro = random.uniform(0.2, 0.4) + np.random.normal(0, 0.05)
            sst = random.uniform(29, 31) + np.random.normal(0, 0.5)
            
        # Rule 3: Boats - simulate coast vs offshore
        is_coastal = random.choice([True, False])
        if is_coastal:
            boats = int(random.uniform(40, 80) + np.random.normal(0, 5))
        else:
            boats = int(random.uniform(10, 40) + np.random.normal(0, 3))
            
        boats = max(0, boats) # No negative boats
        
        # Rule 5 & 6: Label Logic
        if pfz == 0:
            label = "LOW_AVAILABILITY"
        else:
            if boats < 40:
                label = "SAFE"
            elif 40 <= boats <= 60:
                label = "MODERATE"
            else:
                label = "HIGH_RISK"
                
        sst_list.append(round(sst, 2))
        chloro_list.append(round(chloro, 3))
        boats_list.append(boats)
        labels.append(label)
        
    df['sst'] = sst_list
    df['chlorophyll'] = chloro_list
    df['boats'] = boats_list
    df['label'] = labels
    
    df.to_csv(data_path, index=False)
    print(f"Successfully generated and wrote {len(df)} synthetic rules-based rows to {data_path}")

if __name__ == "__main__":
    generate_synthetic_data()
