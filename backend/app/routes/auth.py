from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    verify_jwt_in_request,
)

from ..extensions import db
from ..models import User, UserRole
from ..utils import json_error

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    role = (payload.get("role") or UserRole.STAFF.value).strip()

    if not name or not email or not password:
        return json_error("Name, email, and password are required.")

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return json_error("A user with that email already exists.", 409)

    user_count = User.query.count()
    if user_count > 0:
        verify_jwt_in_request(optional=True)
        current_identity = get_jwt_identity()
        claims = get_jwt()

        if not current_identity or claims.get("role") != UserRole.ADMIN.value:
            return json_error(
                "Only the first user can self-register. Later accounts must be created by an admin.",
                403,
            )

    user = User(
        name=name,
        email=email,
        role=(
            UserRole.ADMIN.value
            if user_count == 0
            else (role if role in {r.value for r in UserRole} else UserRole.STAFF.value)
        ),
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully.", "user": user.to_dict()}), 201


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        return json_error("Email and password are required.")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return json_error("Invalid credentials.", 401)

    if not user.is_active:
        return json_error("This account is inactive.", 403)

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "email": user.email},
    )

    return jsonify({"access_token": token, "user": user.to_dict()})


@auth_bp.get("/me")
@jwt_required()
def me():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return json_error("User not found.", 404)

    return jsonify({"user": user.to_dict()})
