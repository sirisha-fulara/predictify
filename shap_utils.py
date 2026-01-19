import shap
import pandas as pd
import numpy as np
from catboost import CatBoostClassifier

# Load model globally to avoid reloading on every request
model = CatBoostClassifier()
try:
    model.load_model("loan_model.cbm")
    explainer = shap.TreeExplainer(model)
except Exception as e:
    print(f"Warning: Model not found or error loading: {e}. SHAP will not work until model is trained.")
    model = None
    explainer = None

def get_local_shap(data_df):
    """
    Calculate SHAP values for a single prediction.
    data_df: DataFrame with a single row of features (preprocessed/encoded).
    """
    if explainer is None:
        return {"error": "Model not loaded"}

    shap_values = explainer.shap_values(data_df)
    
    # shap_values for CatBoost might be 1D array for single row
    
    # We want to return feature names and their impact
    explanation = []
    for col, val in zip(data_df.columns, shap_values[0] if len(shap_values.shape) > 1 else shap_values):
        explanation.append({
            "feature": col,
            "impact": float(val)
        })
    
    # Sort by absolute impact
    explanation.sort(key=lambda x: abs(x['impact']), reverse=True)
    
    return {
        "base_value": float(explainer.expected_value) if isinstance(explainer.expected_value, float) else float(explainer.expected_value[0]),
        "features": explanation
    }

def reload_model():
    global model, explainer
    model = CatBoostClassifier()
    model.load_model("loan_model.cbm")
    explainer = shap.TreeExplainer(model)
