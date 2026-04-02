# 🌊 Hackathon Project

## 👥 Team Name

**Phantom Troupe**

---

## 🎯 Problem Statement

Marine ecosystems are facing critical challenges due to **overfishing and resource overuse**.

Fishermen often lack real-time insights into:

* Where fish are available
* Which areas are already overexploited

This leads to:

* Reduced fish populations
* Economic loss for fishermen
* Long-term environmental damage

---

## 💡 Solution

We developed **SeaGuard AI**, an AI-powered decision support system that predicts whether a fishing area is:

* 🟢 **SAFE** – sustainable fishing zone
* 🔴 **OVERFISHED** – high-risk zone to avoid

### 🔧 Key Features:

* 📍 Location-based prediction using map
* 🧠 Machine learning model for classification
* 🗺️ Interactive map with visual indicators
* 📌 Live location detection
* ⚙️ Automatic PFZ detection using geospatial mapping

### 🧠 How it works:

1. User clicks on map or uses live location
2. System finds nearest fishing zone from dataset
3. ML model predicts sustainability
4. Result shown visually on map

---

## 🧩 Tech Stack

### 🎨 Frontend:

* HTML
* CSS
* JavaScript
* Leaflet.js (for map visualization)

### ⚙️ Backend:

* Python
* Flask
* Scikit-learn (Machine Learning)

### 🗄️ Database:

* CSV Dataset (processed PFZ + environmental data)

---

## ⚙️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/your-username/seaguard-ai.git
cd seaguard-ai
```

### 2. Install dependencies

```bash
pip install flask pandas scikit-learn joblib
```

### 3. Run the application

```bash
python app.py
```

### 4. Open in browser

```
http://127.0.0.1:5000
```

---

## 🚀 Outcome

SeaGuard AI provides a **practical and scalable solution** for sustainable fishing by combining:

* AI prediction
* Real-world-inspired data
* Interactive visualization

---

## 🌍 Impact

* 🎣 Helps fishermen make better decisions
* 🌱 Protects marine biodiversity
* 🏛️ Supports sustainable fisheries management

---
