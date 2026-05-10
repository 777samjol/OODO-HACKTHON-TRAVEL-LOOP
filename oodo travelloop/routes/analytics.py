from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from database import get_db
from models import Trip, User, Stop
from routes.auth import get_current_user
from pydantic import BaseModel
import google.generativeai as genai
import os
import json

router = APIRouter()

class BudgetAnalysisResponse(BaseModel):
    alerts: list[str]

@router.get("/budget-analysis/{trip_id}", response_model=BudgetAnalysisResponse)
async def budget_analysis(trip_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Fetch trip
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.stops).selectinload(Stop.activities))
        .where(Trip.id == trip_id)
        .where(Trip.user_id == current_user.id)
    )
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # 2. Extract budget info to send to Gemini
    trip_summary = f"Destination: {trip.destination}, Total Budget Level: {trip.budget}, Total Estimated Cost: {trip.total_estimated_cost}. "
    for stop in trip.stops:
        trip_summary += f"Day {stop.date}: Estimated Cost {stop.daily_estimated_cost}. "
        for act in stop.activities:
            trip_summary += f"  - {act.category}: {act.description} (Cost: {act.estimated_cost}). "
            
    # 3. Ask Gemini for analysis
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    prompt = f"""
    You are an AI Budget Travel Analyst for Traveloop. Analyze the following trip itinerary costs and provide 3-5 specific, actionable budget alerts or optimization suggestions.
    
    Trip Details:
    {trip_summary}
    """
    
    try:
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=BudgetAnalysisResponse,
                temperature=0.7,
            ),
        )
        analysis_data = json.loads(response.text)
        return analysis_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
