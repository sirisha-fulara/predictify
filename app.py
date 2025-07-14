from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config
from extensions import db
from user_routes import user_bp
from auth_routes import auth_bp
from admin_routes import admin_bp

app=Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True)
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
