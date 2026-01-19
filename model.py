import pandas as pd
import joblib
import os
import json
import numpy as np
import shap
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.ensemble import RandomForestClassifier
from catboost import CatBoostClassifier, Pool
from xgboost import XGBClassifier

# --- Configuration ---
DATA_PATH = "./dataset/loan_approval_dataset.csv"
MODEL_PATH = "loan_model.cbm"  # Saving the best model (CatBoost for now)
METRICS_PATH = "model_metrics.json"
SHAP_VALUES_PATH = "shap_values.pkl" # Save SHAP values for global explanation
ENCODER_DIR = "encoders"

# --- Load & Preprocess Data ---
print("Loading dataset...")
df = pd.read_csv(DATA_PATH)

# Clean column names
df.columns = df.columns.str.strip()

# Clean string columns
string_cols = df.select_dtypes(include=['object']).columns
for col in string_cols:
    df[col] = df[col].str.strip()

# Map target
status_map = {'Approved': 0, 'Rejected': 1}
df['loan_status'] = df['loan_status'].map(status_map)
df = df.dropna(subset=['loan_status'])

# Features
features = [
    'no_of_dependents', 'education', 'self_employed', 'income_annum', 'loan_amount',
    'loan_term', 'cibil_score', 'residential_assets_value', 'commercial_assets_value',
    'luxury_assets_value', 'bank_asset_value'
]

df = df.dropna(subset=features)

# Feature Engineering
df['loan_income_ratio'] = df['loan_amount'] / df['income_annum']

# Encoders
categorical_cols = ['education', 'self_employed']
os.makedirs(ENCODER_DIR, exist_ok=True)
encoders = {}

print("Encoding categorical features...")
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le
    joblib.dump(le, f"{ENCODER_DIR}/{col}_encoder.pkl")

# Data Splitting
X = df[features + ['loan_income_ratio']]
y = df['loan_status'].astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --- Model Training & Evaluation ---
results = {}

def evaluate_model(name, y_true, y_pred, y_prob):
    return {
        "Model": name,
        "Accuracy": round(accuracy_score(y_true, y_pred), 4),
        "Precision": round(precision_score(y_true, y_pred), 4),
        "Recall": round(recall_score(y_true, y_pred), 4),
        "F1 Score": round(f1_score(y_true, y_pred), 4),
        "ROC AUC": round(roc_auc_score(y_true, y_prob), 4)
    }

print("Training Models...")

# 1. CatBoost
print("Training CatBoost...")
cat_features_indices = [X.columns.get_loc(c) for c in categorical_cols]
train_pool = Pool(X_train, y_train, cat_features=cat_features_indices)
test_pool = Pool(X_test, y_test, cat_features=cat_features_indices)

cat_model = CatBoostClassifier(
    iterations=500, learning_rate=0.05, depth=6, eval_metric='AUC',
    scale_pos_weight=(y_train == 0).sum() / (y_train == 1).sum(),
    random_seed=42, verbose=0
)
cat_model.fit(train_pool, eval_set=test_pool, early_stopping_rounds=50)

y_pred_cat = cat_model.predict(X_test)
y_prob_cat = cat_model.predict_proba(X_test)[:, 1]
results['CatBoost'] = evaluate_model("CatBoost", y_test, y_pred_cat, y_prob_cat)
cat_model.save_model(MODEL_PATH) # Save CatBoost as primary model

# 2. XGBoost
print("Training XGBoost...")
xgb_model = XGBClassifier(
    n_estimators=500, learning_rate=0.05, max_depth=6,
    scale_pos_weight=(y_train == 0).sum() / (y_train == 1).sum(),
    random_state=42, use_label_encoder=False, eval_metric='logloss'
)
xgb_model.fit(X_train, y_train)
y_pred_xgb = xgb_model.predict(X_test)
y_prob_xgb = xgb_model.predict_proba(X_test)[:, 1]
results['XGBoost'] = evaluate_model("XGBoost", y_test, y_pred_xgb, y_prob_xgb)

# 3. Random Forest
print("Training Random Forest...")
rf_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, class_weight='balanced')
rf_model.fit(X_train, y_train)
y_pred_rf = rf_model.predict(X_test)
y_prob_rf = rf_model.predict_proba(X_test)[:, 1]
results['RandomForest'] = evaluate_model("RandomForest", y_test, y_pred_rf, y_prob_rf)

# --- Save Metrics ---
print("Saving metrics...")
with open(METRICS_PATH, "w") as f:
    json.dump(results, f, indent=4)

# --- SHAP Analysis (Global) ---
print("Calculating Global SHAP values (using CatBoost)...")
explainer = shap.TreeExplainer(cat_model)
shap_values = explainer.shap_values(X)

# Save summary data for frontend
# We need feature names and mean absolute SHAP value for importance
feature_importance = pd.DataFrame(list(zip(X.columns, np.abs(shap_values).mean(0))), columns=['feature', 'importance'])
feature_importance = feature_importance.sort_values(by='importance', ascending=False)
feature_importance.to_json("shap_feature_importance.json", orient="records")

print("✅ Training complete. Metrics and SHAP data saved.")
