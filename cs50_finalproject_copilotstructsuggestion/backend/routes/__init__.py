from flask import Blueprint

bp = Blueprint('api', __name__)

from . import api  # Import the routes defined in api.py to register them with the blueprint