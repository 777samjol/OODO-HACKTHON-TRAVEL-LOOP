document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('id');
  
  if (!tripId) {
    window.location.href = 'planner.html';
    return;
  }

  const token = localStorage.getItem('traveloop_token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const res = await fetch(`/api/v1/trips/${tripId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) throw new Error('Trip not found');
    const trip = await res.json();
    
    renderTripHeader(trip);
    renderDays(trip.stops);
    renderSummary(trip);
    setupPackingAssistant(trip);

  } catch (err) {
    console.error(err);
    document.getElementById('itineraryDays').innerHTML = `<p style="color:red">Failed to load trip: ${err.message}</p>`;
  }

});

function renderTripHeader(trip) {
  const headerCard = document.querySelector('.trip-header-card');
  if(!headerCard) return;
  headerCard.innerHTML = `
    <img class="trip-header-img" src="assets/dest2.png" alt="${trip.destination}">
    <div class="trip-header-body">
      <div>
        <span class="badge badge-accent" style="margin-bottom:8px">✨ AI Generated</span>
        <h2>${trip.destination}</h2>
        <div class="trip-meta-pills">
          <div class="trip-meta-pill">📅 ${trip.start_date} – ${trip.end_date}</div>
          <div class="trip-meta-pill">⏱️ ${trip.trip_duration_days} Days</div>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:22px;font-weight:700;color:var(--primary)">$${trip.total_estimated_cost || 'TBD'}</div>
        <div style="font-size:12px;color:var(--text-3)">estimated total cost</div>
      </div>
    </div>
  `;
}

function renderDays(stops) {
  const container = document.getElementById('itineraryDays');
  if(!container) return;
  container.innerHTML = stops.map((stop, i) => `
    <div class="day-block">
      <div class="day-header">
        <div class="day-number">${i + 1}</div>
        <div>
          <div class="day-label">Day ${i + 1}</div>
          <div class="day-date">${stop.date} · Est Cost: $${stop.daily_estimated_cost || '0'}</div>
        </div>
      </div>
      <div class="activity-list">
        ${stop.activities.map(act => `
          <div class="activity-item">
            <div class="activity-dot"></div>
            <div class="activity-time">${act.time || ''}</div>
            <div class="activity-content">
              <div class="activity-type type-activity">${getIcon(act.category)} ${act.category || 'Activity'}</div>
              <h4>${act.description}</h4>
              <p>Est. Cost: $${act.estimated_cost || '0'}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderSummary(trip) {
  const summaryVals = document.querySelectorAll('.summary-row .value');
  if(summaryVals.length >= 6) {
    summaryVals[0].textContent = trip.destination;
    summaryVals[1].textContent = trip.trip_duration_days + ' Days';
    summaryVals[5].textContent = '$' + (trip.total_estimated_cost || '0');
  }
}

function getIcon(cat) {
  if(!cat) return '✨';
  cat = cat.toLowerCase();
  if(cat.includes('food') || cat.includes('dinner') || cat.includes('lunch')) return '🍔';
  if(cat.includes('travel') || cat.includes('flight') || cat.includes('transport')) return '✈️';
  if(cat.includes('hotel') || cat.includes('stay')) return '🏨';
  return '📍';
}

async function setupPackingAssistant(trip) {
  const checklistContainer = document.querySelector('.summary-card:nth-of-type(3) div');
  if(!checklistContainer) return;
  
  checklistContainer.innerHTML = '<span class="spinner" style="width:20px;height:20px;display:inline-block;border-top-color:var(--primary)"></span> AI generating packing list...';
  
  const token = localStorage.getItem('traveloop_token');
  try {
    const res = await fetch('/api/v1/assistant/packing-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        destination: trip.destination,
        duration_days: trip.trip_duration_days,
        weather: "Unknown"
      })
    });
    if(!res.ok) throw new Error();
    const data = await res.json();
    
    checklistContainer.innerHTML = data.categories.map(cat => 
      cat.items.map(item => `
        <label class="check-item"><input type="checkbox"><span class="checkmark-box"></span> ${item}</label>
      `).join('')
    ).join('');
    
  } catch(e) {
    checklistContainer.innerHTML = '<p>Could not generate packing list.</p>';
  }
}
