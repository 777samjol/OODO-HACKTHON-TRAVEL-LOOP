# TravelLoop Backend & UI

This repository contains the FastAPI backend and UI components for the TravelLoop AI Itinerary Planner.

## For the Frontend Developer

### 1. UI Components
You will find the animated glassmorphism cards we designed in the `ui_components/` folder:
- `GlassCard.jsx`: The React component you can drop into your project.
- `GlassCard.css`: The CSS required for the glassmorphism effects (import this in your React app).
- `demo.html`: A standalone demo showing how the cards look and behave.

### 2. Backend API
The backend is built with FastAPI and PostgreSQL. It uses Google Gemini to generate travel itineraries.

**Local Setup:**
1. Make sure you have Python 3.10+ installed.
2. Install dependencies: `pip install -r requirements.txt`
3. Create a `.env` file in the root directory (do not commit this file!) and add:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/travelloop"
   ```
4. Start the server: `uvicorn main:app --reload`
5. The API documentation (Swagger) will be available at `http://127.0.0.1:8000/docs`.

### 3. Endpoints
- `POST /api/v1/generate-itinerary`: Accepts `destination`, `start_date`, `end_date`, `budget`, and `interests`. Returns a fully generated JSON itinerary and saves it to the database.
- `GET /api/v1/{itinerary_id}`: Fetches a saved itinerary from the database.

> **Note**: CORS is already configured in `main.py` to allow requests from `http://localhost:3000` and `http://localhost:5173`.
