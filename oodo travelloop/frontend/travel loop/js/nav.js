/* =============================================
   SHARED NAVIGATION COMPONENT
   ============================================= */

(function () {
  const PAGES = [
    {
      href: 'home.html',
      label: 'Home',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    },
    {
      href: 'explore.html',
      label: 'Explore',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
    },
    {
      href: 'planner.html',
      label: 'AI Planner',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
    },
    {
      href: 'itinerary.html',
      label: 'Itinerary',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
    },
    {
      href: 'budget.html',
      label: 'Budget',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
    },
    {
      href: 'community.html',
      label: 'Community',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
      href: 'profile.html',
      label: 'Profile',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
    }
  ];

  const currentPage = window.location.pathname.split('/').pop() || 'home.html';

  function buildSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.innerHTML = `
      <div class="sidebar-logo">
        <div class="logo-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        </div>
        <span>Traveloop</span>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">Menu</div>
        ${PAGES.map(p => `
          <a href="${p.href}" class="nav-link ${currentPage === p.href ? 'active' : ''}">
            ${p.icon}
            <span class="nav-text">${p.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-bottom">
        <a href="profile.html" class="sidebar-user">
          <img src="assets/avatar.png" alt="User" class="avatar">
          <div class="user-info">
            <div class="user-name">Alex Morgan</div>
            <div class="user-tag">@alexmorgan</div>
          </div>
        </a>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', buildSidebar);
})();
