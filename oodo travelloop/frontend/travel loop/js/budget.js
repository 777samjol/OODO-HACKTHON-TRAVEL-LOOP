// BUDGET PAGE LOGIC
document.addEventListener('DOMContentLoaded', () => {

  const CATEGORIES = [
    { name: 'Flights',       color: '#38bdf8', emoji: '✈️', spent: 18000, budget: 30000 },
    { name: 'Hotels',        color: '#818cf8', emoji: '🏨', spent: 12000, budget: 35000 },
    { name: 'Food & Dining', color: '#34d399', emoji: '🍜', spent: 4500,  budget: 15000 },
    { name: 'Activities',    color: '#fbbf24', emoji: '🎡', spent: 2800,  budget: 12000 },
    { name: 'Shopping',      color: '#f87171', emoji: '🛍️', spent: 1200,  budget: 10000 },
    { name: 'Transport',     color: '#a78bfa', emoji: '🚄', spent: 0,     budget: 8000  },
  ];

  const EXPENSES = [
    { name: 'Air India Tickets', date: 'May 5, 2026',    amount: -18000, type: 'debit',  emoji: '✈️', color: '#38bdf838' },
    { name: 'Park Hyatt Kyoto',  date: 'May 3, 2026',    amount: -12000, type: 'debit',  emoji: '🏨', color: '#818cf838' },
    { name: 'Tsukiji Market',    date: 'May 2, 2026',    amount: -850,   type: 'debit',  emoji: '🍜', color: '#34d39938' },
    { name: 'Ramen Dinner',      date: 'May 2, 2026',    amount: -620,   type: 'debit',  emoji: '🍜', color: '#34d39938' },
    { name: 'Refund — Hotel',    date: 'Apr 28, 2026',   amount: +3000,  type: 'credit', emoji: '💚', color: '#34d39938' },
    { name: 'JR Rail Pass',      date: 'Apr 25, 2026',   amount: -7500,  type: 'debit',  emoji: '🚄', color: '#a78bfa38' },
  ];

  // ---- Donut Chart ----
  const svgEl = document.getElementById('donutSvg');
  const legendEl = document.getElementById('chartLegend');
  const total = CATEGORIES.reduce((s, c) => s + c.spent, 0);
  let offset = 0;
  const r = 38, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;

  let pathsHTML = '';
  let legendHTML = '';

  CATEGORIES.forEach(cat => {
    const pct = total > 0 ? cat.spent / total : 0;
    const dash = pct * circ;
    pathsHTML += `<circle cx="${cx}" cy="${cy}" r="${r}"
      fill="none" stroke="${cat.color}" stroke-width="14"
      stroke-dasharray="${dash} ${circ - dash}"
      stroke-dashoffset="${-offset}"
      stroke-linecap="butt"/>`;
    offset += dash;

    legendHTML += `<div class="legend-item">
      <div class="legend-dot" style="background:${cat.color}"></div>
      <span>${cat.emoji} ${cat.name}</span>
      <span style="margin-left:auto;font-weight:600">₹${cat.spent.toLocaleString('en-IN')}</span>
    </div>`;
  });

  if (svgEl) svgEl.innerHTML = pathsHTML;
  if (legendEl) legendEl.innerHTML = legendHTML;

  // ---- Budget Bars ----
  const barsEl = document.getElementById('budgetBars');
  if (barsEl) {
    barsEl.innerHTML = CATEGORIES.map(cat => {
      const pct = Math.round((cat.spent / cat.budget) * 100);
      const fillColor = pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--primary)';
      return `<div class="budget-bar-item">
        <div class="budget-bar-head">
          <span class="cat">${cat.emoji} ${cat.name}</span>
          <span class="amounts">₹${cat.spent.toLocaleString('en-IN')} / ₹${cat.budget.toLocaleString('en-IN')}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:${fillColor}"></div>
        </div>
      </div>`;
    }).join('');
  }

  // ---- Expense List ----
  const listEl = document.getElementById('expenseList');
  if (listEl) {
    listEl.innerHTML = EXPENSES.map(exp => `
      <div class="expense-item">
        <div class="expense-icon" style="background:${exp.color};">${exp.emoji}</div>
        <div class="expense-info">
          <div class="name">${exp.name}</div>
          <div class="date">${exp.date}</div>
        </div>
        <div class="expense-amount ${exp.type}">
          ${exp.type === 'credit' ? '+' : ''}₹${Math.abs(exp.amount).toLocaleString('en-IN')}
        </div>
      </div>
    `).join('');
  }

  // ---- Fetch AI Alerts ----
  fetchAIAlerts();

  document.getElementById('addExpBtn')?.addEventListener('click', () => {
    alert('Add Expense form coming soon!');
  });
});

async function fetchAIAlerts() {
  const list = document.getElementById('aiAlertsList');
  if(!list) return;

  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('id');
  if(!tripId) {
    list.innerHTML = '<li>Please open a trip from the dashboard to see AI alerts.</li>';
    return;
  }

  const token = localStorage.getItem('traveloop_token');
  try {
    const res = await fetch(`/api/v1/analytics/budget-analysis/${tripId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if(!res.ok) throw new Error();
    const data = await res.json();

    if(data.alerts && data.alerts.length > 0) {
      list.innerHTML = data.alerts.map(a => `<li style="margin-bottom:8px; display:flex; gap:8px"><span style="color:#fbbf24">⚠️</span> ${a}</li>`).join('');
    } else {
      list.innerHTML = '<li>Your budget looks perfectly optimized!</li>';
    }
  } catch(e) {
    list.innerHTML = '<li>Unable to generate AI alerts at this time.</li>';
  }
}
