import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
def generate_itinerary(destination, budget, days, interests, travel_type):

    prompt = f"""
    You are an expert AI travel planner.

    Create a personalized travel itinerary.

    Destination: {destination}
    Budget: {budget}
    Days: {days}
    Interests: {interests}
    Travel Type: {travel_type}

    Include:
    - Day-wise itinerary
    - Food recommendations
    - Estimated expenses
    - Hidden gems
    - Travel tips

    Keep response professional and well formatted.
    """

    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        data=json.dumps({
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        })
    )

    result = response.json()

    return result['choices'][0]['message']['content']