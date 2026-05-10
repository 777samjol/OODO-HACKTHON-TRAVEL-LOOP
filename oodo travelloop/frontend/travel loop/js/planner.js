document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('plannerForm');
  const overlay = document.getElementById('loadingOverlay');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('traveloop_token');
    if (!token) {
      alert("You must be logged in to generate a trip.");
      window.location.href = "index.html";
      return;
    }

    const dest = document.getElementById('dest').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const budget = document.getElementById('budget').value;
    const interestsRaw = document.getElementById('interests').value;
    const interests = interestsRaw.split(',').map(s => s.trim()).filter(s => s);

    overlay.style.display = 'flex';

    try {
      const response = await fetch('/api/v1/trips/generate-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destination: dest,
          start_date: start,
          end_date: end,
          budget: budget,
          interests: interests
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate trip');
      }

      const tripData = await response.json();
      
      // Redirect to dynamic itinerary
      window.location.href = `itinerary.html?id=${tripData.id}`;
      
    } catch (err) {
      alert("Error: " + err.message);
      overlay.style.display = 'none';
    }
  });
});
