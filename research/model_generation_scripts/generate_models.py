
import pandas as pd
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sentence_transformers import SentenceTransformer

# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
CRIME_CSV_PATH = os.path.join(BASE_DIR, 'Crime Prediction', 'crime_kolkata.csv')
BNS_CSV_PATH = os.path.join(BASE_DIR, 'FIR Automation', 'testing1.csv')
ASSETS_DIR = os.path.join(BASE_DIR, 'backend', 'assets')

os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_crime_model():
    print("Generating Crime Prediction Model...")
    if not os.path.exists(CRIME_CSV_PATH):
        print(f"Error: {CRIME_CSV_PATH} not found.")
        return

    df = pd.read_csv(CRIME_CSV_PATH)
    
    # Preprocessing based on notebook logic
    # Group by Ward, Year, Month
    crime_grouped = (
        df.groupby(['Ward', 'Year', 'Month'])
        .size()
        .reset_index(name='Crime_Count')
    )
    
    X = crime_grouped[['Ward', 'Year', 'Month']]
    y = crime_grouped['Crime_Count']
    
    # Train Model
    print("Training Random Forest...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save Model
    output_path = os.path.join(ASSETS_DIR, 'crime_model.pkl')
    with open(output_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Saved crime model to {output_path}")

def generate_bns_assets():
    print("\nGenerating BNS Search Assets...")
    if not os.path.exists(BNS_CSV_PATH):
        print(f"Error: {BNS_CSV_PATH} not found.")
        return

    try:
        df = pd.read_csv(BNS_CSV_PATH, encoding='latin1')
    except:
        df = pd.read_csv(BNS_CSV_PATH) # Try default encoding
        
    print(f"Loaded {len(df)} BNS sections.")
    
    # Load model
    print("Loading Sentence-BERT model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Generate embeddings
    print("Generating embeddings...")
    descriptions = df['Description'].fillna('').tolist()
    embeddings = model.encode(descriptions)
    
    # Save Data and Embeddings
    # We save as a dict containing the DF and the embeddings numpy array
    assets = {
        'df': df,
        'embeddings': embeddings
    }
    
    output_path = os.path.join(ASSETS_DIR, 'bns_assets.pkl')
    with open(output_path, 'wb') as f:
        pickle.dump(assets, f)
    print(f"Saved BNS assets to {output_path}")

if __name__ == "__main__":
    generate_crime_model()
    generate_bns_assets()
    print("\nDone.")
