import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import joblib
import os

def train_fishing_model(data_path):
    # 1. Load dataset
    print(f"Loading dataset from: {data_path}...")
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found!")
        return
    
    df = pd.read_csv(data_path)
    print("Dataset loaded successfully.")
    
    # 2. Preprocess data
    # Convert label column: SAFE -> 0, OVERFISHED -> 1
    print("Preprocessing labels...")
    label_map = {'SAFE': 0, 'OVERFISHED': 1}
    df['label'] = df['label'].map(label_map)
    
    # 3. Select features and target
    # Features: sst, chlorophyll, boats, pfz
    features = ['sst', 'chlorophyll', 'boats', 'pfz']
    X = df[features]
    y = df['label']
    
    # 4. Split dataset (80% training, 20% testing)
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # 5. Train a model (RandomForestClassifier with 100 estimators)
    print("Training RandomForest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # 6. Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)
    # Filter classes that are actually in y_test to avoid classification report errors
    unique_labels = sorted(y_test.unique())
    target_names = ['SAFE', 'OVERFISHED']
    
    class_report = classification_report(y_test, y_pred, target_names=target_names)
    
    # Display results
    results = []
    results.append("--- Model Evaluation ---")
    results.append(f"Accuracy: {accuracy:.2%}")
    results.append("\nConfusion Matrix:")
    results.append(str(conf_matrix))
    results.append("\nClassification Report:")
    results.append(class_report)
    results.append("\n--- Sample Predictions ---")
    
    test_inputs = [
        [28, 0.7, 20, 1],
        [29, 0.6, 60, 1],
        [30, 0.3, 50, 0]
    ]
    
    for i, input_data in enumerate(test_inputs):
        pred = model.predict([input_data])[0]
        result = "OVERFISHED" if pred == 1 else "SAFE"
        results.append(f"Input {i+1} {input_data} -> Result: {result}")
    
    output_text = "\n".join(results)
    print(output_text)
    
    # Save results to a file
    with open('results.txt', 'w') as f:
        f.write(output_text)
        
    # 8. Save trained model
    model_filename = 'fishing_model.pkl'
    joblib.dump(model, model_filename)
    print(f"\nModel saved as: {model_filename}")

if __name__ == "__main__":
    dataset_file = 'pfz_ml_dataset.csv'
    train_fishing_model(dataset_file)
