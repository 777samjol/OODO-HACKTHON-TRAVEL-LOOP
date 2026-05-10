// EXPLORE PAGE LOGIC
document.addEventListener('DOMContentLoaded', () => {

  const TRIPS = [
    { title: 'Maldives Escape',  type: 'Beach',    img: 'assets/dest1.png', days: 7,  price: 85000,  rating: 4.9, reviews: 218, location: 'Maldives',  cat: 'beach' },
    { title: 'Japan in Bloom',   type: 'Cultural', img: 'assets/dest2.png', days: 10, price: 110000, rating: 4.8, reviews: 174, location: 'Japan',     cat: 'cultural' },
    { title: 'Amalfi Coast',     type: 'City',     img: 'assets/dest3.png', days: 8,  price: 135000, rating: 4.7, reviews: 89,  location: 'Italy',     cat: 'city' },
    { title: 'Bali Retreat',     type: 'Beach',    img: 'assets/dest1.png', days: 6,  price: 65000,  rating: 4.6, reviews: 312, location: 'Indonesia', cat: 'beach' },
    { title: 'Swiss Alps Trek',  type: 'Adventure',img: 'assets/dest2.png', days: 9,  price: 175000, rating: 4.9, reviews: 57,  location: 'Switzerland', cat: 'adventure' },
    { title: 'Paris City Break', type: 'City',     img: 'assets/dest3.png', days: 5,  price: 95000,  rating: 4.5, reviews: 401, location: 'France',    cat: 'city' },
  ];

  const TYPE_EMOJI = { Beach:'🏖️', Cultural:'🏛️', City:'🌆', Adventure:'🧗', Mountains:'🏔️' };

  function starSVG() {
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" style="color:var(--warning)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }

  function clockSVG() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  }

  function pinSVG() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }

  function renderTrips(list) {
    const grid = document.getElementById('exploreGrid');
    document.getElementById('resultsCount').textContent = `Showing ${list.length} result${list.length !== 1 ? 's' : ''}`;
    grid.innerHTML = list.map(t => `
      <a href="itinerary.html" class="card trip-card">
        <img class="card-img" src="${t.img}" alt="${t.title}">
        <div class="card-body">
          <div class="card-tag">${TYPE_EMOJI[t.type] || '✈️'} ${t.type}</div>
          <div class="card-title">${t.title}</div>
          <div class="card-meta">
            ${clockSVG()} ${t.days} Days
            ${pinSVG()} ${t.location}
          </div>
        </div>
        <div class="card-footer">
          <div class="price" style="color:var(--primary);font-size:15px;font-weight:700">₹${t.price.toLocaleString('en-IN')}</div>
          <div class="rating" style="display:flex;align-items:center;gap:4px;font-size:12px">
            ${starSVG()} ${t.rating} <span style="color:var(--text-3)">(${t.reviews})</span>
          </div>
        </div>
      </a>
    `).join('');
  }

  // Initial render
  renderTrips(TRIPS);

  // Budget slider
  const slider = document.getElementById('budgetRange');
  const valLabel = document.getElementById('budgetVal');
  if (slider) {
    slider.addEventListener('input', () => {
      const v = Number(slider.value);
      const pct = ((v - 10000) / (500000 - 10000)) * 100;
      slider.style.setProperty('--pct', pct + '%');
      if(valLabel) valLabel.textContent = '₹' + v.toLocaleString('en-IN');
    });
  }

  // Filter apply
  document.getElementById('applyFilters')?.addEventListener('click', () => {
    let filtered = [...TRIPS];

    // Budget
    const max = Number(slider?.value || 500000);
    filtered = filtered.filter(t => t.price <= max);

    // Types
    const typeChecks = document.querySelectorAll('.check-item input[type="checkbox"]:checked');
    const checkedLabels = Array.from(typeChecks).map(cb => cb.parentElement.textContent.trim());
    
    // Simplistic text matching for categories
    if (checkedLabels.length > 0) {
      const activeTypes = [];
      if(checkedLabels.includes('Beach')) activeTypes.push('Beach');
      if(checkedLabels.includes('Mountains')) activeTypes.push('Mountains');
      if(checkedLabels.includes('Cultural')) activeTypes.push('Cultural');
      if(checkedLabels.includes('Adventure')) activeTypes.push('Adventure');
      if(checkedLabels.includes('City Break')) activeTypes.push('City');
      
      if(activeTypes.length > 0) {
        filtered = filtered.filter(t => activeTypes.includes(t.type));
      }
    }

    renderTrips(filtered);
  });

  // Clear filters
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    // Reset slider
    if (slider) { slider.value = 500000; slider.style.setProperty('--pct','100%'); if(valLabel) valLabel.textContent = '₹5,00,000'; }
    // Uncheck all boxes
    document.querySelectorAll('.check-item input[type="checkbox"]').forEach(cb => cb.checked = false);
    renderTrips(TRIPS);
  });

  // Sort
  document.getElementById('sortSelect')?.addEventListener('change', (e) => {
    let sorted = [...TRIPS];
    if (e.target.value.includes('Low to High'))  sorted.sort((a,b) => a.price - b.price);
    if (e.target.value.includes('High to Low'))  sorted.sort((a,b) => b.price - a.price);
    if (e.target.value.includes('Rating'))        sorted.sort((a,b) => b.rating - a.rating);
    if (e.target.value.includes('Duration'))      sorted.sort((a,b) => b.days - a.days);
    renderTrips(sorted);
  });

  // Search
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    renderTrips(q ? TRIPS.filter(t => t.title.toLowerCase().includes(q) || t.location.toLowerCase().includes(q)) : TRIPS);
  });

});
