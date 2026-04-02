import csv
import random

def dms_to_decimal(d, m, s, direction):
    decimal = d + m/60.0 + s/3600.0
    if direction in ['S', 'W']:
        decimal = -decimal
    return round(decimal, 4)

# Data extracted from the image
raw_pfs_data = [
    ("Majali", "14 53 0 N", "73 59 46 E"),
    ("Sadasguvgarg", "14 50 4 N", "74 0 42 E"),
    ("Karwar", "14 48 6 N", "74 2 3 E"),
    ("Belekeri", "14 44 3 N", "74 3 51 E"),
    ("Gangavali", "14 33 46 N", "74 11 37 E"),
    ("Tadri", "14 29 56 N", "74 15 28 E"),
    ("Kumta Pt", "14 27 30 N", "74 16 11 E"),
    ("Dhareshvar", "14 19 0 N", "74 20 20 E"),
    ("Karki", "14 17 35 N", "74 20 58 E"),
    ("Honavar", "14 15 48 N", "74 21 33 E"),
    ("Kasarkod", "14 14 10 N", "74 20 4 E"),
    ("Navayatkere", "14 11 34 N", "74 19 43 E"),
    ("Mavalli", "14 9 52 N", "74 20 36 E"),
    ("Shirali", "14 1 2 N", "74 24 39 E"),
    ("Bhatkal", "13 58 1 N", "74 24 27 E"),
    ("Baindur", "13 47 29 N", "74 20 54 E"),
    ("Navunda", "13 43 38 N", "74 33 52 E"),
    ("Gangoli", "13 39 38 N", "74 27 18 E"),
    ("Coondapoor (gangoli)", "13 37 3 N", "74 35 40 E"),
    ("Kota", "13 31 32 N", "74 37 21 E"),
    ("Hangarkatta", "13 28 33 N", "74 34 35 E"),
    ("Malpe", "13 20 14 N", "74 37 34 E"),
    ("Udiyavara", "13 17 13 N", "74 36 56 E"),
    ("Kapu", "13 15 13 N", "74 37 9 E"),
    ("Mulki", "13 4 35 N", "74 43 39 E"),
    ("Hosabettu-Udaivar", "13 2 37 N", "74 44 7 E"),
    ("Suratakal Pt", "12 58 37 N", "74 44 44 E"),
    ("New Mangalore", "12 55 40 N", "74 44 38 E"),
    ("Mangalore", "12 51 58 N", "74 43 48 E"),
]

def parse_dms(dms_str):
    parts = dms_str.split()
    d = float(parts[0])
    m = float(parts[1])
    s = float(parts[2])
    direction = parts[3]
    return d, m, s, direction

processed_data = []
latitudes = []
longitudes = []

for location, lat_dms, lon_dms in raw_pfs_data:
    lat = dms_to_decimal(*parse_dms(lat_dms))
    lon = dms_to_decimal(*parse_dms(lon_dms))
    processed_data.append({"lat": lat, "lon": lon, "pfz": 1})
    latitudes.append(lat)
    longitudes.append(lon)

# Generate 20 additional rows with pfz = 0
min_lat, max_lat = min(latitudes), max(latitudes)
min_lon, max_lon = min(longitudes), max(longitudes)

# Padding to differentiate a bit if needed, but "nearby" means within or around this range
# Let's add 0.5 degree padding to the range if needed, or just stay within it
for _ in range(20):
    # Generating coordinates that are "nearby" but potentially slightly different
    # Most PFZs are offshore, so pfz=0 could be further inland or much further offshore
    # For simplicity, we just pick random points in the same bounding box
    rnd_lat = round(random.uniform(min_lat, max_lat), 4)
    rnd_lon = round(random.uniform(min_lon, max_lon), 4)
    
    # Avoid exact duplicates with pfz=1 points (unlikely but good to check)
    if not any(d['lat'] == rnd_lat and d['lon'] == rnd_lon for d in processed_data):
        processed_data.append({"lat": rnd_lat, "lon": rnd_lon, "pfz": 0})

# Write to CSV
with open('pfz_data.csv', 'w', newline='') as csvfile:
    fieldnames = ['lat', 'lon', 'pfz']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for row in processed_data:
        writer.writerow(row)

print(f"Generated pfz_data.csv with {len(processed_data)} rows.")
