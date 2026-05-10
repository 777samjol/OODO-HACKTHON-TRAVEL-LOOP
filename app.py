from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_engine import generate_itinerary

app = Flask(__name__)

CORS(app)


@app.route('/generate-itinerary', methods=['POST'])
def generate_trip():

    data = request.json

    destination = data['destination']
    budget = data['budget']
    days = data['days']
    interests = data['interests']
    travel_type = data['travel_type']

    itinerary = generate_itinerary(
        destination,
        budget,
        days,
        interests,
        travel_type
    )

    return jsonify({
        "success": True,
        "itinerary": itinerary
    })


if __name__ == "__main__":
    app.run(debug=True)