from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, LoanApproval
import pandas as pd
from sqlalchemy import func

admin_bp = Blueprint("admin", __name__)

# Admin-protected route
@admin_bp.route("/metrics", methods=["GET"])
@jwt_required()
def key_metrics():
    user_id = get_jwt_identity()

    # Query all loan records
    loans = LoanApproval.query.all()
    if not loans:
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

@admin_bp.route("/approval-distribution", methods=["GET"])
@jwt_required()
def approval_distribution():
    counts = db.session.query(
        LoanApproval.status, func.count(LoanApproval.id)
    ).group_by(LoanApproval.status).all()

    dist = {pred: count for pred, count in counts}
    return jsonify(dist)

@admin_bp.route("/cibil-trend", methods=["GET"])
@jwt_required()
def cibil_trend():
    loans = LoanApproval.query.order_by(LoanApproval.application_date).all()
    df = pd.DataFrame([{
        "timestamp": loan.application_date,
        "cibil_score": loan.cibil_score
    } for loan in loans])
    
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.groupby(df["timestamp"].dt.date).mean(numeric_only=True)
    
    trend = [{"date": str(date), "cibil_score": round(score, 2)} for date, score in df["cibil_score"].items()]
    return jsonify(trend)

@admin_bp.route("/income-vs-risk", methods=["GET"])
@jwt_required()
def income_vs_risk():
    loans = LoanApproval.query.all()
    data = [{
        "income": loan.income_annum,
        "risk_score": loan.risk_score
    } for loan in loans]
    return jsonify(data)

@admin_bp.route("/risk-distribution", methods=["GET"])
@jwt_required()
def risk_distribution():
    loans = LoanApproval.query.all()
    risk_bins = {
        "0-20": 0,
        "21-40": 0,
        "41-60": 0,
        "61-80": 0,
        "81-100": 0
    }

    for loan in loans:
        r = loan.risk_score
        if r <= 20:
            risk_bins["0-20"] += 1
        elif r <= 40:
            risk_bins["21-40"] += 1
        elif r <= 60:
            risk_bins["41-60"] += 1
        elif r <= 80:
            risk_bins["61-80"] += 1
        else:
            risk_bins["81-100"] += 1

    return jsonify(risk_bins)
