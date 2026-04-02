import csv
import random
import pandas as pd

def transform_dataset(input_file, output_file):
    # Load dataset
    df = pd.read_csv(input_file)
    
    # Task 1 & 2: Remove duplicate rows
    initial_count = len(df)
    df = df.drop_duplicates().reset_index(drop=True)
    unique_count = len(df)
    
    # Task 3 & 4: Add new columns and fill values based on logic
    # Task 5: Create label column
    
    def get_features_and_label(row):
        pfz = row['pfz']
        if pfz == 1:
            sst = round(random.uniform(26, 29), 2)
            chlorophyll = round(random.uniform(0.6, 0.8), 3)
        else:
            sst = round(random.uniform(29, 31), 2)
            chlorophyll = round(random.uniform(0.2, 0.4), 3)
            
        boats = random.randint(10, 80)
        
        # Labeling logic
        if boats > 40 and pfz == 1:
            label = 'OVERFISHED'
        else:
            label = 'SAFE'
            
        return pd.Series([sst, chlorophyll, boats, label])

    # Apply to existing unique rows
    df[['sst', 'chlorophyll', 'boats', 'label']] = df.apply(get_features_and_label, axis=1)
    
    # Task 6: Balanced dataset
    # Current counts
    counts = df['label'].value_counts()
    overfished_count = counts.get('OVERFISHED', 0)
    safe_count = counts.get('SAFE', 0)
    
    print(f"Unique rows: {unique_count}")
    print(f"Initial distribution: {dict(counts)}")
    
    # Augment to balance classes if needed
    if overfished_count < safe_count:
        needed = safe_count - overfished_count
        print(f"Augmenting OVERFISHED class with {needed} more rows...")
        
        # Pick random pfz=1 rows and regenerate them with boats > 40
        pfz1_rows = df[df['pfz'] == 1]
        if not pfz1_rows.empty:
            for _ in range(needed):
                new_row = pfz1_rows.sample(n=1).copy().iloc[0]
                new_row['sst'] = round(random.uniform(26, 29), 2)
                new_row['chlorophyll'] = round(random.uniform(0.6, 0.8), 3)
                new_row['boats'] = random.randint(41, 80)
                new_row['label'] = 'OVERFISHED'
                # Append to dataframe
                df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        else:
            print("WARNING: No pfz=1 rows found to generate OVERFISHED labels!")
            
    elif safe_count < overfished_count:
        needed = overfished_count - safe_count
        print(f"Augmenting SAFE class with {needed} more rows...")
        # Similar logic but boats <= 40 or pfz=0
        for _ in range(needed):
            new_row = df.sample(n=1).copy().iloc[0]
            if new_row['pfz'] == 1:
                new_row['sst'] = round(random.uniform(26, 29), 2)
                new_row['chlorophyll'] = round(random.uniform(0.6, 0.8), 3)
                new_row['boats'] = random.randint(10, 40)
            else:
                new_row['sst'] = round(random.uniform(29, 31), 2)
                new_row['chlorophyll'] = round(random.uniform(0.2, 0.4), 3)
                new_row['boats'] = random.randint(10, 80)
            new_row['label'] = 'SAFE'
            df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

    # Shuffle dataset
    df = df.sample(frac=1).reset_index(drop=True)
    
    # Task 7: Output final columns in order
    final_cols = ['lat', 'lon', 'pfz', 'sst', 'chlorophyll', 'boats', 'label']
    df = df[final_cols]
    
    # Final check
    print(f"Final distribution: {dict(df['label'].value_counts())}")
    print(f"Total rows: {len(df)}")
    
    # Task 8: Return final dataset
    df.to_csv(output_file, index=False)

if __name__ == "__main__":
    transform_dataset('pfz_data.csv', 'pfz_ml_dataset.csv')
