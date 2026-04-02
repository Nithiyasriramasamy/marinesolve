import os
import math
from dotenv import load_dotenv
from twilio.rest import Client

# Load credentials from .env file (never hardcode secrets!)
load_dotenv()

ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER")

try:
    client = Client(ACCOUNT_SID, AUTH_TOKEN)
except Exception as e:
    client = None
    print(f"Twilio client init error: {e}")

def calculate_direction_distance(user_lat, user_lon, zone_lat, zone_lon):
    """Calculates exactly distance (km) and compass direction."""
    # Distance using Haversine
    lat1, lon1, lat2, lon2 = map(math.radians, [user_lat, user_lon, zone_lat, zone_lon])
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371 
    distance = c * r

    # Direction (Bearing)
    y = math.sin(dlon) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlon)
    bearing = math.atan2(y, x)
    bearing = math.degrees(bearing)
    bearing = (bearing + 360) % 360

    compass_brackets = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"]
    direction = compass_brackets[round(bearing / 45)]

    return round(distance, 2), direction

def generate_sms(user_lat, user_lon, zone_lat, zone_lon, result, boats):
    try:
        boats_val = int(boats)
    except (TypeError, ValueError):
        boats_val = "Unknown"
        
    distance, direction = calculate_direction_distance(user_lat, user_lon, zone_lat, zone_lon)

    if distance == 0:
        dir_str = "N/A"
        dist_str = "0.0"
        advice = "You are at the fishing zone"
    else:
        dir_str = direction
        dist_str = str(distance)
        if result == "SAFE":
            advice = "Good fishing zone, low risk"
        elif result == "MODERATE":
            advice = "Moderate activity, proceed with caution"
        elif result == "HIGH_RISK":
            advice = "High fishing pressure, consider alternatives"
        elif result == "LOW_AVAILABILITY":
            advice = "Low fish availability in this area"
        else:
            advice = "Status unknown"

    sms = (
        "PFZ Alert\n\n"
        f"Direction: {dir_str}\n"
        f"Distance: {dist_str} km\n\n"
        f"Status: {result}\n"
        f"Boats: {boats_val}\n\n"
        f"Advice: {advice}"
    )
    
    return sms

def send_sms(to_number, message):
    if not client:
        print("Twilio client is not initialized.")
        return False
        
    try:
        msg = client.messages.create(
            body=message,
            from_=TWILIO_NUMBER,
            to=to_number
        )
        print("SMS sent successfully:", msg.sid)
        return True
    except Exception as e:
        print("Error sending SMS:", e)
        return False
