from fastapi import APIRouter, HTTPException, Depends
from schemas import TripRequest, TripResponse, StopBase, ActivityBase, TripDB
from models import Trip, Stop, Activity, User
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from routes.auth import get_current_user
import google.generativeai as genai
import os
import json

router = APIRouter()

async def generate_gemini_trip(request: TripRequest) -> TripResponse:
    # Ensure the API key is available
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "INSERT_YOUR_GEMINI_API_KEY_HERE":
        raise HTTPException(
            status_code=500, 
            detail="Gemini API key is not configured. Please add it to the .env file."
        )

    # Configure the Gemini API client
    genai.configure(api_key=api_key)
    
    # We will use gemini-2.5-flash as it is fast and supports JSON response schemas
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    duration = (request.end_date - request.start_date).days + 1
    
    if duration <= 0:
        raise HTTPException(status_code=400, detail="End date must be after start date")

    # Construct the prompt
    prompt = f"""
    Create a highly detailed, premium travel itinerary for a trip to {request.destination}.
    The trip starts on {request.start_date} and ends on {request.end_date} (Duration: {duration} days).
    The budget is '{request.budget}'.
    Interests: {', '.join(request.interests) if request.interests else 'general sightseeing'}.

    Return the itinerary structured exactly according to the provided JSON schema.
    IMPORTANT: You must include `daily_estimated_cost` for each stop, and `estimated_cost` and `category` (food, transport, activity) for each individual activity. Provide a realistic `total_estimated_cost` for the entire trip.
    """

    try:
        # Call the Gemini model asynchronously asking for a JSON response matching our Pydantic schema
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=TripResponse,
                temperature=0.7,
            ),
        )
        
        # Parse the JSON string response directly into our Pydantic model
        trip_data = json.loads(response.text)
        return TripResponse(**trip_data)
        
    except Exception as e:
        # Log the exception or handle it
        raise HTTPException(status_code=500, detail=f"Failed to generate trip with Gemini: {str(e)}")

@router.post("/generate-trip", response_model=TripDB)
async def generate_trip(request: TripRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Generate an AI-powered travel trip using Google Gemini based on user preferences
    and save it to the database, linked to the authenticated user.
    """
    # 1. Generate via Gemini
    trip_res = await generate_gemini_trip(request)
    
    # 2. Build SQLAlchemy models
    db_trip = Trip(
        user_id=current_user.id,
        destination=request.destination,
        start_date=request.start_date,
        end_date=request.end_date,
        budget=request.budget,
        interests=request.interests,
        trip_duration_days=trip_res.trip_duration_days,
        notes=trip_res.notes,
        total_estimated_cost=trip_res.total_estimated_cost,
        stops=[]
    )
    
    for stop in trip_res.stops:
        db_stop = Stop(
            date=stop.date,
            daily_estimated_cost=stop.daily_estimated_cost,
            activities=[]
        )
        for act in stop.activities:
            db_act = Activity(
                time=act.time,
                description=act.description,
                category=act.category,
                estimated_cost=act.estimated_cost
            )
            db_stop.activities.append(db_act)
        db_trip.stops.append(db_stop)
        
    # 3. Save to database
    db.add(db_trip)
    await db.commit()
    
    # 4. Fetch the fully loaded trip (with IDs and relationships) to return
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.stops).selectinload(Stop.activities))
        .where(Trip.id == db_trip.id)
    )
    saved_trip = result.scalar_one()
    
    return saved_trip

@router.get("/{trip_id}", response_model=TripDB)
async def get_trip(trip_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Retrieve a saved trip by its ID, ensuring the user owns it.
    """
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.stops).selectinload(Stop.activities))
        .where(Trip.id == trip_id)
        .where(Trip.user_id == current_user.id)
    )
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found or unauthorized")
    return trip
