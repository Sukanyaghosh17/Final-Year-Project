import pickle
import sys
import pandas as pd
import numpy as np

def inspect_pkl(file_path):
    print(f"--- Inspecting: {file_path} ---\n")
    try:
        with open(file_path, 'rb') as f:
            data = pickle.load(f)
            
        print(f"Type: {type(data)}")
        
        if isinstance(data, dict):
            print(f"Keys: {list(data.keys())}")
            for k, v in data.items():
                print(f"  Key '{k}': {type(v)}")
                if hasattr(v, 'shape'):
                    print(f"    Shape: {v.shape}")
                elif isinstance(v, list):
                    print(f"    Length: {len(v)}")
                elif isinstance(v, pd.DataFrame):
                    print(f"    DataFrame Shape: {v.shape}")
                    print(f"    Columns: {list(v.columns)}")
                    print(f"    Head:\n{v.head(2)}")
        elif isinstance(data, pd.DataFrame):
            print("DataFrame Info:")
            print(data.info())
            print("\nHead:")
            print(data.head())
        elif hasattr(data, 'get_params'): # Sklearn model
            print("Scikit-learn Model:")
            print(data)
            print(f"Params: {data.get_params()}")
            
        else:
            print(data)
            
    except Exception as e:
        print(f"Error reading {file_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python inspect_pkl.py <path_to_pkl_file>")
    else:
        inspect_pkl(sys.argv[1])
