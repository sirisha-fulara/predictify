from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config
from extensions import db
from user_routes import user_bp
from auth_routes import auth_bp
from admin_routes import admin_bp

import os

app=Flask(__name__)

# Ensure instance folder exists for SQLite
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

app.config.from_object(Config)

# Update CORS to allow specific origins for credentials support
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": [
            "https://predictify-49qt.vercel.app", 
            "http://localhost:3000"
        ]
    }
})
jwt = JWTManager()
db.init_app(app)
jwt.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(user_bp, url_prefix="/user")
app.register_blueprint(admin_bp, url_prefix="/admin")

@app.route("/")
def home():
    return ("Flask app running")
    
# Create DB tables
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
