from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
# ✅ Proper CORS (THIS IS ENOUGH)
CORS(
    app,
    origins=["https://*.vercel.app", "http://localhost:3000"],
    supports_credentials=True
)

from flask_jwt_extended import JWTManager
from config import Config
from extensions import db
from user_routes import user_bp
from auth_routes import auth_bp
from admin_routes import admin_bp
import os

app.config.from_object(Config)

# Ensure instance folder exists for SQLite (CRITICAL FOR RENDER)
try:
    instance_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance')
    if not os.path.exists(instance_path):
        os.makedirs(instance_path)
        print(f"Created instance path: {instance_path}")
except Exception as e:
    print(f"Error creating instance path: {e}")



jwt = JWTManager(app)
db.init_app(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp, url_prefix="/user")
app.register_blueprint(admin_bp, url_prefix="/admin")

@app.route("/")
def home():
    return "Flask app running"

with app.app_context():
    db.create_all()

# ✅ REQUIRED FOR RENDER
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 10000))
    )
