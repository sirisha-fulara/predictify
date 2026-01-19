from app import app
from extensions import db
from models import LoanApproval

with app.app_context():
    count = LoanApproval.query.count()
    print(f"LoanApproval count: {count}")
    
    # Check if SHAP file exists
    import os
    shap_path = os.path.join(os.path.dirname(__file__), "shap_feature_importance.json")
    print(f"SHAP file exists: {os.path.exists(shap_path)}")
