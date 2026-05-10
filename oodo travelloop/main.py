from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes.auth import router as auth_router
from routes.itinerary import router as itinerary_router
from routes.analytics import router as analytics_router
from routes.assistant import router as assistant_router
from dotenv import load_dotenv
from database import engine, Base
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="TravelLoop AI Itinerary API",
    description="API for generating AI-powered travel itineraries",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for React frontend (Vite or Create React App)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(itinerary_router, prefix="/api/v1/trips", tags=["Trips"])
app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Budget Analytics"])
app.include_router(assistant_router, prefix="/api/v1/assistant", tags=["AI Assistant"])

app.mount("/", StaticFiles(directory="frontend/travel loop", html=True), name="static")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
