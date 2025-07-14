from extensions import db

class User(db.Model):
    id= db.Column(db.Integer, primary_key=True)
    email= db.Column(db.String(80), unique=True, nullable=False)
    password= db.Column(db.String(80), nullable=False)
    role = db.Column(db.String(20), default="user")
    loan_approvals = db.relationship('LoanApproval', back_populates='user')

    

class LoanApproval(db.Model):
    __tablename__ = "loan_approvals"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'), nullable=False )
    status = db.Column(db.String(10), nullable=False)  # 'Approved' or 'Rejected'
    cibil_score = db.Column(db.Float, nullable=True)
    risk_score = db.Column(db.Float, nullable=True)
    income_annum = db.Column(db.Float, nullable=True)
    application_date = db.Column(db.DateTime, nullable=False)
    # Add more fields if needed, like loan_amount, etc.
    user = db.relationship('User', back_populates='loan_approvals')
