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

import re

app=Flask(__name__)

# Ensure instance folder exists for SQLite (Explicitly match Config path)
basedir = os.path.abspath(os.path.dirname(__file__))
instance_dir = os.path.join(basedir, 'instance')
if not os.path.exists(instance_dir):
    os.makedirs(instance_dir)

app.config.from_object(Config)

# Check Origin Function
def check_origin(origin):
    print(f"DEBUG: Checking Origin: {origin}", flush=True)
    if origin is None:
        return True
    if "localhost" in origin:
        return True
    if ".vercel.app" in origin:
        return True
    print(f"DEBUG: Origin REJECTED: {origin}", flush=True)
    return False

# Update CORS to use the check_origin function
CORS(app, supports_credentials=True, origins=check_origin)

@app.before_request
def log_request_info():
    from flask import request
    print(f"DEBUG: Headers: {request.headers}", flush=True)
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
