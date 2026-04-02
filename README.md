# 🌊 SeaGuard AI — Intelligent Marine Fishing Advisory System

SeaGuard AI is a full-stack marine advisory platform that helps fishermen identify the **safest and most productive fishing zones** using machine learning, real-time geospatial analysis, and automated SMS alerts.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Flask](https://img.shields.io/badge/Flask-3.1-000000?logo=flask)
![Scikit-Learn](https://img.shields.io/badge/ScikitLearn-1.6-F7931E?logo=scikit-learn)
![Twilio](https://img.shields.io/badge/Twilio-SMS-F22F46?logo=twilio)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet)

---

## 🎯 What It Does

1. **Collects user input** — vessel type, fuel capacity, GPS location, max travel distance
2. **Runs ML predictions** — a trained Random Forest model classifies each fishing zone
3. **Ranks zones algorithmically** — using a weighted formula combining **safety (60%)** and **proximity (40%)**
4. **Displays results on an interactive map** — with ranked markers, heatmap visualization, and popup details
5. **Sends SMS alerts automatically** — the top recommendation is dispatched via Twilio to the fisherman's phone

---

## 🧠 Machine Learning Pipeline

### 4-Tier Classification System

| Label | Condition | Safety Score |
|-------|-----------|-------------|
| 🟢 `SAFE` | PFZ zone & boats < 40 | 1.0 |
| 🟡 `MODERATE` | PFZ zone & boats 40–60 | 0.5 |
| 🔴 `HIGH_RISK` | PFZ zone & boats > 60 | 0.2 |
| ⚪ `LOW_AVAILABILITY` | Non-PFZ zone | 0.0 |

### Scientifically Consistent Synthetic Data

| Feature | PFZ = 1 (Fishing Zone) | PFZ = 0 (Non-Fishing) |
|---------|----------------------|---------------------|
| SST (°C) | 26 – 29 | 29 – 31 |
| Chlorophyll (mg/m³) | 0.6 – 0.8 | 0.2 – 0.4 |
| Boats | Coastal: 40–80 / Offshore: 10–40 | Same distribution |

### Zone Ranking Formula

```
distance_score = 1 / (1 + distance_km)
final_score = (0.6 × safety_score) + (0.4 × distance_score)
```

Top 3 zones are selected and ranked by `final_score` (descending).

---

## 🏗️ Tech Stack

### Backend
- **Flask** — REST API server
- **Scikit-Learn** — Random Forest classifier
- **Pandas / NumPy** — Data processing
- **Twilio** — Automated SMS alerts
- **Gunicorn** — Production WSGI server

### Frontend
- **React 18** — Component-based UI
- **React Router** — Client-side navigation
- **Leaflet + react-leaflet** — Interactive maps
- **leaflet.heat** — Heatmap visualization
- **Axios** — HTTP client
- **Lucide React** — Icon library

---

## 📁 Project Structure

```
marine tracker/
├── backend/
│   ├── app.py                      # Flask API (routes: /recommend, /heatmap, /health)
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Twilio credentials (not in git)
│   ├── .python-version             # Python 3.11 for deployment
│   ├── data/
│   │   └── clean_fishing_dataset.csv
│   ├── model/
│   │   └── fishing_model_v2.pkl    # Trained Random Forest model
│   ├── scripts/
│   │   ├── generate_dataset.py     # Synthetic data generation
│   │   └── train_model.py          # Model training script
│   └── utils/
│       ├── recommendation.py       # ML prediction & zone ranking engine
│       └── sms_service.py          # Twilio SMS generation & dispatch
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                 # Main router & state management
│       ├── index.css               # Global styles
│       └── pages/
│           ├── Welcome.jsx         # Landing page
│           ├── Auth.jsx            # Login/Signup with age verification
│           ├── UserSetup.jsx       # Vessel & fuel configuration
│           ├── Location.jsx        # GPS location selection
│           ├── RecommendationMap.jsx # Map + heatmap + ranked zones
│           └── Summary.jsx         # Trip summary with scores
│
├── vercel.json                     # Vercel deployment config
└── .gitignore
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Twilio credentials
echo TWILIO_ACCOUNT_SID=your_sid > .env
echo TWILIO_AUTH_TOKEN=your_token >> .env
echo TWILIO_PHONE_NUMBER=your_number >> .env

# Generate dataset & train model (if needed)
python scripts/generate_dataset.py
python scripts/train_model.py

# Start server
python app.py
```

Backend runs at: `http://127.0.0.1:5001`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## ☁️ Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | **Vercel** | Auto-deploys from GitHub |
| Backend | **Render** | `https://marinesolve-1.onrender.com` |

### Render Configuration

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn app:app` |
| Python Version | `3.11` (via `.python-version`) |

Environment variables on Render:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

---

## 📱 SMS Alert Format

When a recommendation is generated, an SMS is automatically sent:

```
PFZ Alert

Direction: SE
Distance: 9.92 km

Status: SAFE
Boats: 22

Advice: Good fishing zone, low risk
```

---

## 🗺️ Features

- **🥇 Ranked Zones** — Top 3 zones with Gold/Silver/Bronze visual indicators
- **🔥 Heatmap Toggle** — Switch between marker view and full dataset heat visualization
- **📊 Score Breakdown** — Safety score + distance score = final rank score
- **📱 Auto SMS** — Twilio SMS sent on every recommendation
- **👤 Age Personalization** — Under 18: safe zones only | 40+: safety prioritized
- **⛽ Fuel Estimation** — Checks if fuel is sufficient for the recommended distance

---

## 👥 Team

**Team Phantom Troupe** — Built for marine ecosystem conservation and fisherman safety.

---

## 📄 License

This project is for educational and research purposes.
