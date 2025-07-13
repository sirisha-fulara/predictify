import pandas as pd
import joblib
import os
from catboost import CatBoostClassifier, Pool
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load dataset
df = pd.read_csv("./dataset/loan_approval_dataset.csv")

# Strip spaces from columns (VERY important)
df.columns = df.columns.str.strip()

# Strip spaces from string columns (optional but good)
df['loan_status'] = df['loan_status'].str.strip()
df['education'] = df['education'].str.strip()
df['self_employed'] = df['self_employed'].str.strip()

# Map loan_status to numeric target
status_map = {'Approved': 0, 'Rejected': 1}
df['loan_status'] = df['loan_status'].map(status_map)

# Drop rows with missing target
df = df[~df['loan_status'].isnull()]

# Features to use
features = [
    'no_of_dependents', 'education', 'self_employed', 'income_annum', 'loan_amount',
    'loan_term', 'cibil_score', 'residential_assets_value', 'commercial_assets_value',
    'luxury_assets_value', 'bank_asset_value'
]

# Check for missing values in features and drop or fill as needed
df = df.dropna(subset=features)

# Create engineered features (if any)
df['loan_income_ratio'] = df['loan_amount'] / df['income_annum']

# Label encode categorical columns
categorical_cols = ['education', 'self_employed']

encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le
    os.makedirs("encoders", exist_ok=True)
    joblib.dump(le, f"encoders/{col}_encoder.pkl")

# Prepare training data
X = df[features + ['loan_income_ratio']]
y = df['loan_status'].astype(int)

# Get categorical feature indices for CatBoost
cat_indices = [X.columns.get_loc(col) for col in categorical_cols]

# Split train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

train_pool = Pool(X_train, y_train, cat_features=cat_indices)
test_pool = Pool(X_test, y_test, cat_features=cat_indices)

# Initialize CatBoost model
model = CatBoostClassifier(
    iterations=1000,
    learning_rate=0.05,
    depth=6,
    eval_metric='AUC',
    scale_pos_weight= (y_train == 0).sum() / (y_train == 1).sum(),
    random_seed=42,
    verbose=100
)

# Train model
model.fit(train_pool, eval_set=test_pool, early_stopping_rounds=50)

# Save model
model.save_model("loan_model.cbm")
print("✅ Model trained and saved successfully.")
