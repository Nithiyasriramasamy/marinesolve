import pandas as pd
import random
import numpy as np

def refine_dataset(input_path, output_path):
    # Load dataset
    df = pd.read_csv(input_path)
    
    # Task 1 & 2: Deduplicate based on unique identifying columns
    initial_len = len(df)
    df = df.drop_duplicates(subset=['lat', 'lon', 'sst', 'chlorophyll', 'boats']).reset_index(drop=True)
    dedup_len = len(df)
    print(f"Removed {initial_len - dedup_len} duplicate rows.")

    # Task 4 & 5: Validate ranges and data quality
    df['sst'] = df['sst'].clip(26, 31)
    df['chlorophyll'] = df['chlorophyll'].clip(0.2, 0.8)
    df['boats'] = df['boats'].clip(10, 80).astype(int)
    
    # Ensure no missing values (fill if any, though there shouldn't be)
    df = df.fillna(method='ffill').fillna(method='bfill')
    
    # Task 3: Fix labels based on updated logic
    def apply_label(row):
        if row['pfz'] == 0:
            return "OVERFISHED"
        elif row['pfz'] == 1 and row['boats'] > 40:
            return "OVERFISHED"
        else:
            return "SAFE"
    
    df['label'] = df.apply(apply_label, axis=1)
    
    # Task 6: Balance dataset
    counts = df['label'].value_counts()
    overfished_count = counts.get('OVERFISHED', 0)
    safe_count = counts.get('SAFE', 0)
    
    print(f"Distribution after update: {dict(counts)}")
    
    if overfished_count > safe_count:
        needed = overfished_count - safe_count
        print(f"Adding {needed} SAFE rows for balance...")
        # SAFE rows must be pfz=1 and boats <= 40
        pfz1_rows = df[df['pfz'] == 1]
        if not pfz1_rows.empty:
            for _ in range(needed):
                # Pick a random pfz=1 row as a base
                new_row = pfz1_rows.sample(n=1).copy().iloc[0]
                # Modify features slightly to keep it unique but consistent
                new_row['boats'] = random.randint(10, 40)
                new_row['sst'] = round(random.uniform(26, 29), 2)
                new_row['chlorophyll'] = round(random.uniform(0.6, 0.8), 3)
                new_row['label'] = "SAFE"
                df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        else:
             # If no pfz=1 rows exist (unlikely), generate from scratch
             print("WARNING: No pfz=1 rows found to generate SAFE labels! Creating synthetic rows.")
             for _ in range(needed):
                new_row = {
                    'lat': round(random.uniform(12.8, 14.9), 4),
                    'lon': round(random.uniform(73.9, 74.8), 4),
                    'pfz': 1,
                    'sst': round(random.uniform(26, 29), 2),
                    'chlorophyll': round(random.uniform(0.6, 0.8), 3),
                    'boats': random.randint(10, 40),
                    'label': "SAFE"
                }
                df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

    elif safe_count > overfished_count:
        needed = safe_count - overfished_count
        print(f"Adding {needed} OVERFISHED rows for balance...")
        # OVERFISHED can be pfz=0 or pfz=1 with boats > 40
        for _ in range(needed):
            new_row = df.sample(n=1).copy().iloc[0]
            # Use random strategy (50/50 chance for pfz=0 or pfz=1/boats>40)
            if random.random() > 0.5:
                # pfz=0
                new_row['pfz'] = 0
                new_row['sst'] = round(random.uniform(29, 31), 2)
                new_row['chlorophyll'] = round(random.uniform(0.2, 0.4), 3)
                new_row['boats'] = random.randint(10, 80)
            else:
                # pfz=1, boats > 40
                new_row['pfz'] = 1
                new_row['sst'] = round(random.uniform(26, 29), 2)
                new_row['chlorophyll'] = round(random.uniform(0.6, 0.8), 3)
                new_row['boats'] = random.randint(41, 80)
            new_row['label'] = "OVERFISHED"
            df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

    # Final de-duplication just in case
    df = df.drop_duplicates().reset_index(drop=True)
    df = df.sample(frac=1).reset_index(drop=True)
    
    print(f"Final distribution: {dict(df['label'].value_counts())}")
    print(f"Final dataset rows: {len(df)}")
    
    # Save the cleaned dataset
    df.to_csv(output_path, index=False)
    print(f"Successfully saved refined dataset to {output_path}")

if __name__ == "__main__":
    refine_dataset('pfz_ml_dataset.csv', 'pfz_ml_dataset_v2.csv')
