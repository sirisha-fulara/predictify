from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config
from extensions import db
from user_routes import user_bp
from auth_routes import auth_bp
from admin_routes import admin_bp
import os

app = Flask(
    __name__,
    static_folder=os.path.join(os.getcwd(), 'frontend', 'build'),
    static_url_path='/'
)
app.config.from_object(Config)

CORS(app, supports_credentials=True, static_folder='frontend/build', static_url_path='/')
jwt = JWTManager()
db.init_app(app)
jwt.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(user_bp, url_prefix="/user")
app.register_blueprint(admin_bp, url_prefix="/admin")

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# catch-all route to handle frontend routing
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')
    
# Create DB tables
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
