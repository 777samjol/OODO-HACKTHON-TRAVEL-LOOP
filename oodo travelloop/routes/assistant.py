from fastapi import APIRouter, HTTPException, Depends
from models import User
from routes.auth import get_current_user
from pydantic import BaseModel
import google.generativeai as genai
import os
import json

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    trip_context: str = "" # Optional context about their current trip

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def travel_assistant_chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    prompt = f"""
    You are Traveloop's AI Travel Assistant. The user asks: "{request.message}".
    Context about their trip: {request.trip_context}.
    Answer in a helpful, friendly, and concise manner.
    """
    response = await model.generate_content_async(prompt)
    return {"reply": response.text}

class PackingCategory(BaseModel):
    category: str
    items: list[str]

class PackingResponse(BaseModel):
    categories: list[PackingCategory]
    
class PackingRequest(BaseModel):
    destination: str
    duration_days: int
    weather: str = "Unknown"

@router.post("/packing-assistant", response_model=PackingResponse)
async def packing_assistant(request: PackingRequest, current_user: User = Depends(get_current_user)):
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    prompt = f"""
    Create a packing checklist for a {request.duration_days}-day trip to {request.destination}. 
    Weather expected: {request.weather}.
    Include categories like clothing, electronics, documents, essentials.
    Return strictly in the provided JSON schema.
    """
    try:
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=PackingResponse,
                temperature=0.7,
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
