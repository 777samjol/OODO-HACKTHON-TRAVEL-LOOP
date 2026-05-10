from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime

class UserCreate(BaseModel):
    email: str = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")

class UserResponse(BaseModel):
    id: int
    email: str
    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str

class TripRequest(BaseModel):
    destination: str = Field(..., description="The travel destination")
    start_date: date = Field(..., description="The start date of the trip")
    end_date: date = Field(..., description="The end date of the trip")
    budget: str = Field(..., description="Budget level: low, medium, or high")
    interests: List[str] = Field(..., description="List of interests")

class ActivityBase(BaseModel):
    time: str = Field(..., description="Time of the activity")
    description: str = Field(..., description="Description of the activity, including food/transport notes")
    category: Optional[str] = Field(..., description="Category: food, transport, sightseeing, etc.")
    estimated_cost: Optional[float] = Field(..., description="Estimated cost for this activity")

class StopBase(BaseModel):
    date: str = Field(..., description="Date for this stop")
    daily_estimated_cost: Optional[float] = Field(..., description="Total estimated cost for the day")
    activities: List[ActivityBase] = Field(..., description="List of activities for the day")

class TripResponse(BaseModel):
    destination: str
    trip_duration_days: int
    total_estimated_cost: Optional[float] = Field(..., description="Total trip estimated cost")
    stops: List[StopBase]
    notes: Optional[str] = Field(..., description="Trip notes")

class ActivityDB(ActivityBase):
    id: int
    model_config = {"from_attributes": True}

class StopDB(StopBase):
    id: int
    activities: List[ActivityDB] = []
    model_config = {"from_attributes": True}

class TripDB(TripResponse):
    id: int
    user_id: int
    start_date: date
    end_date: date
    budget: str
    interests: List[str]
    created_at: datetime
    stops: List[StopDB] = []
    model_config = {"from_attributes": True}
