from flask import Flask, request
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

# Robust Manual CORS Handling
# Allow any Vercel subdomain or Localhost
ALLOWED_ORIGINS_REGEX = re.compile(r"^(https://.*\.vercel\.app|http://localhost:\d+)$")

CORS(app) # Basic init

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin and ALLOWED_ORIGINS_REGEX.match(origin):
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response
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
