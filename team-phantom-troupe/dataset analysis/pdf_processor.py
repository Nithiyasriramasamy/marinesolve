import os
import re
import random
import pandas as pd
import pdfplumber

def dms_to_decimal(d, m, s, direction):
    decimal = float(d) + float(m)/60.0 + float(s)/3600.0
    if direction.upper() in ['S', 'W']:
        decimal = -decimal
    return round(decimal, 4)

# Regex to capture DMS
lat_pattern = re.compile(r"(\d+)\s*[\s\°\'\"]*\s*(\d+)\s*[\s\°\'\"]*\s*(\d+)\s*[\s\°\'\"]*\s*([NSns])")
lon_pattern = re.compile(r"(\d+)\s*[\s\°\'\"]*\s*(\d+)\s*[\s\°\'\"]*\s*(\d+)\s*[\s\°\'\"]*\s*([EWew])")

def process_pdfs(folder_path):
    extracted_data = []
    
    for filename in os.listdir(folder_path):
        if not filename.lower().endswith('.pdf'):
            continue
            
        pdf_path = os.path.join(folder_path, filename)
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    # extract_text usually preserves line by line text
                    text = page.extract_text()
                    if not text:
                        continue
                        
                    for line in text.split('\n'):
                        lat_match = lat_pattern.search(line)
                        lon_match = lon_pattern.search(line)
                        
                        # Sometimes extracting table gives better columns but lines usually suffice
                        if lat_match and lon_match:
                            lat_d, lat_m, lat_s, lat_dir = lat_match.groups()
                            lon_d, lon_m, lon_s, lon_dir = lon_match.groups()
                            
                            dec_lat = dms_to_decimal(lat_d, lat_m, lat_s, lat_dir)
                            dec_lon = dms_to_decimal(lon_d, lon_m, lon_s, lon_dir)
                            
                            # Basic validation: India coordinates should be approx Lat 5-40, Lon 65-100
                            # This prevents catching random numbers
                            if 5 <= dec_lat <= 40 and 65 <= dec_lon <= 100:
                                extracted_data.append({
                                    'lat': dec_lat,
                                    'lon': dec_lon,
                                    'pfz': 1
                                })
                                
                    # If lines didn't have matches, but it's a grid, extract_tables could help
                    tables = page.extract_tables()
                    for table in tables:
                        for row in table:
                            # A row is a list of cell strings
                            row_text = " ".join([str(cell) for cell in row if cell])
                            lat_match = lat_pattern.search(row_text)
                            lon_match = lon_pattern.search(row_text)
                            if lat_match and lon_match:
                                lat_d, lat_m, lat_s, lat_dir = lat_match.groups()
                                lon_d, lon_m, lon_s, lon_dir = lon_match.groups()
                                
                                dec_lat = dms_to_decimal(lat_d, lat_m, lat_s, lat_dir)
                                dec_lon = dms_to_decimal(lon_d, lon_m, lon_s, lon_dir)
                                
                                # Verify constraints
                                if 5 <= dec_lat <= 40 and 65 <= dec_lon <= 100:
                                    extracted_data.append({
                                        'lat': dec_lat,
                                        'lon': dec_lon,
                                        'pfz': 1
                                    })
        except Exception as e:
            print(f"Failed to process {filename}: {e}")
            
    return pd.DataFrame(extracted_data)

def generate_ml_dataset(df):
    if df.empty:
        return df
        
    # Remove duplicates based on lat/lon
    initial_len = len(df)
    df = df.drop_duplicates(subset=['lat', 'lon']).reset_index(drop=True)
    num_pfz = len(df)
    print(f"Dropping text duplicates: Found {num_pfz} unique PFZ rows from {initial_len} initially captured matches.")
    
    if num_pfz == 0:
        return df

    # Generate non-PFZ data
    min_lat, max_lat = df['lat'].min() - 0.5, df['lat'].max() + 0.5
    min_lon, max_lon = df['lon'].min() - 0.5, df['lon'].max() + 0.5
    
    non_pfz_data = []
    # Balance: generating same number of non_pfz as pfz=1
    for _ in range(num_pfz):
        rnd_lat = round(random.uniform(min_lat, max_lat), 4)
        rnd_lon = round(random.uniform(min_lon, max_lon), 4)
        non_pfz_data.append({'lat': rnd_lat, 'lon': rnd_lon, 'pfz': 0})
        
    df_non_pfz = pd.DataFrame(non_pfz_data)
    
    # Combine dataset
    final_df = pd.concat([df, df_non_pfz], ignore_index=True)
    
    # Generate ML Features
    def apply_features(row):
        pfz = row['pfz']
        if pfz == 1:
            sst = round(random.uniform(26, 29), 2)
            chlor = round(random.uniform(0.6, 0.8), 3)
        else:
            sst = round(random.uniform(29, 31), 2)
            chlor = round(random.uniform(0.2, 0.4), 3)
            
        boats = random.randint(10, 80)
        
        # ML Label logic
        if pfz == 0:
            label = "OVERFISHED"
        elif pfz == 1 and boats > 40:
            label = "OVERFISHED"
        else:
            label = "SAFE"
            
        return pd.Series([sst, chlor, boats, label])
        
    final_df[['sst', 'chlorophyll', 'boats', 'label']] = final_df.apply(apply_features, axis=1)
    
    # Ensure standard order and Shuffle
    final_df = final_df[['lat', 'lon', 'pfz', 'sst', 'chlorophyll', 'boats', 'label']]
    final_df = final_df.sample(frac=1).reset_index(drop=True)
    
    return final_df

if __name__ == "__main__":
    folder = "pfz dataset"
    df_extracted = process_pdfs(folder)
    
    if len(df_extracted) > 0:
        final_df = generate_ml_dataset(df_extracted)
        print(f"\nFinal dataset rows: {len(final_df)}")
        print(f"Distribution: {dict(final_df['label'].value_counts())}")
        
        output_path = "final_pdf_ml_dataset.csv"
        final_df.to_csv(output_path, index=False)
        print(f"Successfully generated clean CSV ready for ML: {output_path}")
    else:
        print("No matches were found in the PDFs!")
