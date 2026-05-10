from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    destination = Column(String, index=True)
    start_date = Column(Date)
    end_date = Column(Date)
    budget = Column(String)
    interests = Column(JSON)
    trip_duration_days = Column(Integer)
    notes = Column(Text, nullable=True)
    total_estimated_cost = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="trips")
    stops = relationship("Stop", back_populates="trip", cascade="all, delete-orphan")

class Stop(Base):
    __tablename__ = "stops"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    date = Column(String)
    daily_estimated_cost = Column(Float, nullable=True)

    trip = relationship("Trip", back_populates="stops")
    activities = relationship("Activity", back_populates="stop", cascade="all, delete-orphan")

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    stop_id = Column(Integer, ForeignKey("stops.id"))
    time = Column(String)
    description = Column(Text)
    category = Column(String, nullable=True) # e.g. food, transport, activity
    estimated_cost = Column(Float, nullable=True)

    stop = relationship("Stop", back_populates="activities")
