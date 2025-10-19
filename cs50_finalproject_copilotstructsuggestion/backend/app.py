from flask import Flask
from routes import bp as api_bp

app = Flask(__name__)
app.secret_key = "supersecretkey"  # 🔒 use env var in production
app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)