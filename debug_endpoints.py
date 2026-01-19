from app import app
from extensions import db
from models import LoanApproval
import pandas as pd
from sqlalchemy import func
import os
import json

def test_endpoints():
    with app.app_context():
        print("Testing metrics...")
        try:
            loans = LoanApproval.query.all()
            if not loans:
                print("No loans found")
            else:
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
                import json
                try:
                    # Simulate Flask's jsonify (or just json.dumps which is stricter)
                    # Flask's jsonify uses app.json_provider which might handle it, but let's check pure json first
                    # or better: use app.json.dumps(metrics)
                    print("Serialized Metrics:", app.json.dumps(metrics))
                except Exception as e:
                    print("Serialization Failed:", e)
        except Exception as e:
            print("Metrics Failed:", e)

        print("\nTesting approval-distribution...")
        try:
            counts = db.session.query(
                LoanApproval.status, func.count(LoanApproval.id)
            ).group_by(LoanApproval.status).all()
            dist = {pred: count for pred, count in counts}
            print("Approval Dist OK:", dist)
        except Exception as e:
            print("Approval Dist Failed:", e)

        print("\nTesting cibil-trend...")
        try:
            loans = LoanApproval.query.order_by(LoanApproval.application_date).all()
            if not loans:
                print("No loans for trend")
            else:
                df = pd.DataFrame([{
                    "timestamp": loan.application_date,
                    "cibil_score": loan.cibil_score
                } for loan in loans])
                df["timestamp"] = pd.to_datetime(df["timestamp"])
                df = df.groupby(df["timestamp"].dt.date).mean(numeric_only=True)
                trend = [{"date": str(date), "cibil_score": round(score, 2)} for date, score in df["cibil_score"].items()]
                print("Cibil Trend OK:", len(trend), "points")
        except Exception as e:
            print("Cibil Trend Failed:", e)

        print("\nTesting income-vs-risk...")
        try:
            loans = LoanApproval.query.all()
            data = [{
                "income": loan.income_annum,
                "risk_score": loan.risk_score
            } for loan in loans]
            print("Income vs Risk OK:", len(data), "items")
        except Exception as e:
            print("Income vs Risk Failed:", e)

        print("\nTesting risk-distribution...")
        try:
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
            print("Risk Dist OK:", risk_bins)
        except Exception as e:
             print("Risk Dist Failed:", e)

        print("\nTesting shap/global...")
        try:
            shap_path = os.path.join(os.path.dirname("user_routes.py"), "shap_feature_importance.json")
            # Note: user_routes.py uses __file__, here we approximate
            # But wait, user_routes.py is in d:\Loan Predictor App
            shap_path = "shap_feature_importance.json"
            if not os.path.exists(shap_path):
                 print("SHAP file missing")
            else:
                with open(shap_path, "r") as f:
                    data = json.load(f)
                print("SHAP Data OK, keys:", data[0].keys() if len(data)>0 else "empty")
        except Exception as e:
            print("SHAP Failed:", e)

if __name__ == "__main__":
    test_endpoints()
