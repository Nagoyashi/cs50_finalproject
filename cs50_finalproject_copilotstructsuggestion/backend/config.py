from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from a .env file if it exists

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")  # Default secret key
    DEBUG = os.getenv("DEBUG", "True") == "True"  # Default to True if not set
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///site.db")  # Default to SQLite
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable track modifications for performance
    # Add other configuration variables as needed