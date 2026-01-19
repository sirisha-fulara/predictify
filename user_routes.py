from flask import Blueprint, request, jsonify
from sqlalchemy import func
from flask_jwt_extended import jwt_required, get_jwt_identity
import numpy as np
import joblib
from catboost import CatBoostClassifier, Pool
import pandas as pd
import shap
from extensions import db
from models import LoanApproval
from datetime import datetime
import os
import json

user_bp = Blueprint("user", __name__)

# Load model & encoders once
model = CatBoostClassifier()
# Dynamically find the path to this file, then build path to model
model_path = os.path.join(os.path.dirname(__file__), "loan_model.cbm")
model.load_model(model_path)

encoder_path = os.path.join(os.path.dirname(__file__), "encoders", "education_encoder.pkl")
education_encoder = joblib.load(encoder_path)

self_path = os.path.join(os.path.dirname(__file__), "encoders", "self_employed_encoder.pkl")
self_employed_encoder = joblib.load(self_path)

REQUIRED_FIELDS = [
    'no_of_dependents', 'education', 'self_employed', 'income_annum',
    'loan_amount', 'loan_term', 'cibil_score', 'residential_assets_value',
    'commercial_assets_value', 'luxury_assets_value', 'bank_asset_value'
]

@user_bp.route("/stats/metrics", methods=["GET"])
@jwt_required()
def public_key_metrics():
    # Query all loan records
    loans = LoanApproval.query.all()
    if not loans:
        # Return zeroed metrics
        return jsonify({
            "approval_rate": 0,
            "avg_risk_score": 0,
            "avg_income": 0,
            "avg_cibil_score": 0,
            "total_predictions": 0
        })

    df = pd.DataFrame([{
        "prediction": loan.status,
        "risk_score": loan.risk_score,
        "income_annum": loan.income_annum,
        "cibil_score": loan.cibil_score
    } for loan in loans])

    approval_rate = (df["prediction"] == "Approved").mean() * 100
    avg_risk = df["risk_score"].mean()
    avg_income = df["income_annum"].mean()
    avg_cibil = df["cibil_score"].mean()

    metrics = {
        "approval_rate": round(approval_rate, 2),
        "avg_risk_score": round(avg_risk, 2),
        "avg_income": round(avg_income, 2),
        "avg_cibil_score": round(avg_cibil, 2),
        "total_predictions": len(df)
    }
    return jsonify(metrics)

@user_bp.route("/stats/approval-distribution", methods=["GET"])
@jwt_required()
def public_approval_distribution():
    counts = db.session.query(
        LoanApproval.status, func.count(LoanApproval.id)
    ).group_by(LoanApproval.status).all()

    dist = {pred: count for pred, count in counts}
    return jsonify(dist)

@user_bp.route("/stats/cibil-trend", methods=["GET"])
@jwt_required()
def public_cibil_trend():
    loans = LoanApproval.query.order_by(LoanApproval.application_date).all()
    if not loans: return jsonify([])
    df = pd.DataFrame([{
        "timestamp": loan.application_date,
        "cibil_score": loan.cibil_score
    } for loan in loans])
    
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.groupby(df["timestamp"].dt.date).mean(numeric_only=True)
    
    trend = [{"date": str(date), "cibil_score": round(score, 2)} for date, score in df["cibil_score"].items()]
    return jsonify(trend)

@user_bp.route("/stats/income-vs-risk", methods=["GET"])
@jwt_required()
def public_income_vs_risk():
    loans = LoanApproval.query.all()
    data = [{
        "income": loan.income_annum,
        "risk_score": loan.risk_score
    } for loan in loans]
    return jsonify(data)

@user_bp.route("/stats/risk-distribution", methods=["GET"])
@jwt_required()
def public_risk_distribution():
    loans = LoanApproval.query.all()
    risk_bins = {
        "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0
    }
    for loan in loans:
        r = loan.risk_score
        if r <= 20: risk_bins["0-20"] += 1
        elif r <= 40: risk_bins["21-40"] += 1
        elif r <= 60: risk_bins["41-60"] += 1
        elif r <= 80: risk_bins["61-80"] += 1
        else: risk_bins["81-100"] += 1
    return jsonify(risk_bins)

@user_bp.route("/metrics", methods=["GET"])
# @cross_origin(supports_credentials=True) # Let global CORS handle it
def get_metrics():
    try:
        metrics_path = os.path.join(os.path.dirname(__file__), "model_metrics.json")
        if not os.path.exists(metrics_path):
            return jsonify({"error": "Metrics not found"}), 404
        with open(metrics_path, "r") as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route("/shap/global", methods=["GET"])
# @cross_origin(supports_credentials=True)
def get_global_shap():
    try:
        shap_path = os.path.join(os.path.dirname(__file__), "shap_feature_importance.json")
        if not os.path.exists(shap_path):
            return jsonify({"error": "SHAP data not found"}), 404
        with open(shap_path, "r") as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    user_id = get_jwt_identity()
    data = request.get_json()

    missing = [f for f in REQUIRED_FIELDS if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        # Encode categorical features as integers
        education = education_encoder.transform([data["education"]])[0]
        self_employed = self_employed_encoder.transform([data["self_employed"]])[0]

        # Engineered feature
        loan_income_ratio = float(data["loan_amount"]) / float(data["income_annum"])

        # Build a pandas DataFrame with one row preserving categorical features as ints
        input_dict = {
            'no_of_dependents': float(data['no_of_dependents']),
            'education': education,           # categorical as int
            'self_employed': self_employed,   # categorical as int
            'income_annum': float(data['income_annum']),
            'loan_amount': float(data['loan_amount']),
            'loan_term': float(data['loan_term']),
            'cibil_score': float(data['cibil_score']),
            'residential_assets_value': float(data['residential_assets_value']),
            'commercial_assets_value': float(data['commercial_assets_value']),
            'luxury_assets_value': float(data['luxury_assets_value']),
            'bank_asset_value': float(data['bank_asset_value']),
            'loan_income_ratio': loan_income_ratio
        }

        df_input = pd.DataFrame([input_dict])

        # Features list for SHAP pairing
        all_features = list(df_input.columns)

        # Categorical feature column names
        cat_features = ['education', 'self_employed']

        # Create Pool with categorical feature columns specified by name
        pool = Pool(df_input, cat_features=cat_features)

        # Predict
        pred = model.predict(pool)[0]
        proba = model.predict_proba(pool)[0]

        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(df_input)

        if isinstance(shap_values, list) and len(shap_values) > 1:
            shap_vals = shap_values[1][0]  # positive class
        else:
            shap_vals = shap_values[0]  # single array for binary

        feature_impacts = list(zip(all_features, shap_vals))

        # Sort by absolute impact descending
        feature_impacts.sort(key=lambda x: abs(x[1]), reverse=True)

        # Top 3 positive and negative features
        top_positive = [(f, round(v, 3)) for f, v in feature_impacts if v > 0][:3]
        top_negative = [(f, round(v, 3)) for f, v in feature_impacts if v < 0][:3]

        explanation = {
            "features_increasing_approval": top_negative,
            "features_increasing_rejection": top_positive,
        }

        result = {
            "user_id": user_id,
            "prediction": "Approved" if pred == 0 else "Rejected",
            "risk_score": round(proba[1] * 100, 2),  # Probability rejection
            "confidence": round(max(proba) * 100, 2),
            "explanation": explanation
        }
        
        # Save prediction result to database
        new_entry = LoanApproval(
            user_id=user_id,
            status="Approved" if pred == 0 else "Rejected",
            cibil_score=float(data["cibil_score"]),
            risk_score=round(proba[1] * 100, 2),
            income_annum=float(data["income_annum"]),
            application_date=datetime.utcnow()
        )
        db.session.add(new_entry)
        db.session.commit()


        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    history = LoanApproval.query.filter_by(user_id=user_id).order_by(LoanApproval.application_date.desc()).all()
    
    result = []
    for record in history:
        result.append({
            "id": record.id,
            "prediction": record.status,
            "risk_score": record.risk_score,
            "date": record.application_date.strftime("%Y-%m-%d %H:%M:%S"),
            "cibil_score": record.cibil_score,
            "income_annum":record.income_annum
        })
    return jsonify(result)
