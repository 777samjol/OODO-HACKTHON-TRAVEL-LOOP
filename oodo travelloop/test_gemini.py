import asyncio
from schemas import TripRequest
from datetime import date
from routes.itinerary import generate_gemini_trip

async def test():
    req = TripRequest(
        destination="Kyoto",
        start_date=date(2026, 10, 1),
        end_date=date(2026, 10, 3),
        budget="medium",
        interests=["food", "temples"]
    )
    try:
        res = await generate_gemini_trip(req)
        print("SUCCESS")
        print(res)
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    asyncio.run(test())
