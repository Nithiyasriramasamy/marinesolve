import pandas as pd
import os
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

def train():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'clean_fishing_dataset.csv')
    model_path = os.path.join(base_dir, 'model', 'fishing_model_v2.pkl')
    
    if not os.path.exists(data_path):
        print("Data not found!")
        return
        
    df = pd.read_csv(data_path)
    print(f"Training on {len(df)} samples...")
    
    X = df[['sst', 'chlorophyll', 'boats', 'pfz']]
    y = df['label']  
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    preds = clf.predict(X_test)
    print("Model Evaluation:")
    print(classification_report(y_test, preds))
    
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(clf, model_path)
    print(f"Model saved out to: {model_path}")

if __name__ == "__main__":
    train()
