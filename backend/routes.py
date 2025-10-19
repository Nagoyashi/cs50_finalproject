# backend/routes.py
from flask import Blueprint, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from .helpers import login_required, get_portfolio, get_cashflow, get_networth
from .db_init import get_db_connection

api_bp = Blueprint("api", __name__, url_prefix="/api")

# ---- Auth ----


@api_bp.route("/register", methods=["POST"])
def register_api():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    confirm = data.get("confirmation")

    if not username or not password or not confirm:
        return jsonify({"error": "Missing fields"}), 400
    if password != confirm:
        return jsonify({"error": "Passwords do not match"}), 400

    hash_pw = generate_password_hash(password)
    conn = get_db_connection()
    try:
        conn.execute(
            "INSERT INTO users (username, hash) VALUES (?, ?)", (username, hash_pw))
        conn.commit()
        return jsonify({"message": "Registration successful"}), 201
    except Exception:
        return jsonify({"error": "Username exists"}), 400
    finally:
        conn.close()


@api_bp.route("/login", methods=["POST"])
def login_api():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()

    if user and check_password_hash(user["hash"], password):
        session["user_id"] = user["id"]
        return jsonify({"message": f"Welcome {username}!"}), 200
    return jsonify({"error": "Invalid username or password"}), 401


# ---- Portfolio ----
@api_bp.route("/portfolio")
@login_required
def portfolio():
    user_id = session["user_id"]
    portfolio, cash, total = get_portfolio(user_id)
    return jsonify({"portfolio": portfolio, "cash": cash, "total": total})


# ---- Networth ----
@api_bp.route("/networth")
@login_required
def networth():
    user_id = session["user_id"]
    return jsonify(get_networth(user_id))


# ---- Cashflow ----
@api_bp.route("/cashflow")
@login_required
def cashflow():
    user_id = session["user_id"]
    return jsonify(get_cashflow(user_id))
