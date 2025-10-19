# backend/app.py
from flask import Flask
from backend.routes import api_bp  # import single blueprint

app = Flask(__name__)
app.secret_key = "supersecretkey"

app.register_blueprint(api_bp)  # register API blueprint

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
