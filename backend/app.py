# backend/app.py
from flask import Flask, jsonify, session
from flask_cors import CORS
from .routes import api_bp

app = Flask(__name__)
app.secret_key = "supersecretkey"  # 🔒 use env var in production

# Enable CORS for frontend (localhost:3000 or Codespaces URLs)
CORS(
    app,
    origins=["http://localhost:3000", "https://*.github.dev"],
    supports_credentials=True,
)

# Register blueprints
app.register_blueprint(api_bp)


@app.route("/")
def index():
    return jsonify({
        "message": "Backend running. Use /api/register, /api/login, /api/portfolio, etc."
    })

# Logout route


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200


if __name__ == "__main__":
    # Run the backend
    app.run(host="0.0.0.0", port=5000, debug=True)
