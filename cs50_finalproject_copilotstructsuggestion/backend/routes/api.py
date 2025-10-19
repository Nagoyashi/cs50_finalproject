from flask import Blueprint, jsonify, request

bp = Blueprint('api', __name__)

@bp.route('/api/example', methods=['GET'])
def example():
    return jsonify({"message": "This is an example endpoint."})

@bp.route('/api/data', methods=['POST'])
def data():
    data = request.json
    return jsonify({"received": data}), 201

# Add more routes as needed for your application.