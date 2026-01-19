from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, set_access_cookies,
    jwt_required, unset_jwt_cookies, get_jwt_identity
)
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp= Blueprint("auth", __name__, url_prefix="/auth")
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 409
    
    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    # get data from frontend
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # make user obj and find it in database
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    # make an access token and set cookies for the user session
    access_token = create_access_token(identity=str(user.id),additional_claims={"role": user.role})
    response = jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    })
    set_access_cookies(response, access_token)
    return response

@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(response)
    return response

@auth_bp.route("/check", methods=["GET"])
@jwt_required()
def check():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({"loggedIn": True, "email": user.email})