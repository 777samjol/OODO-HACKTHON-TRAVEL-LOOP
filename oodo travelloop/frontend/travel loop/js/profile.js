// PROFILE PAGE LOGIC
document.addEventListener('DOMContentLoaded', () => {

  // Tab switching
  const tabMap = {
    tabTrips:   'profileTripsGrid',
    tabReviews: null, // reviews are always shown below
    tabSaved:   null,
  };

  ['tabTrips', 'tabReviews', 'tabSaved'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(id)?.classList.add('active');
    });
  });

  // Edit Profile Logic
  const nameEl = document.getElementById('profileName');
  const bioEl = document.getElementById('profileBio');
  
  // Load saved profile
  if(localStorage.getItem('traveloop_profile_name')) {
    nameEl.textContent = localStorage.getItem('traveloop_profile_name');
  }
  if(localStorage.getItem('traveloop_profile_bio')) {
    bioEl.textContent = localStorage.getItem('traveloop_profile_bio');
  }

  document.getElementById('editProfileBtn')?.addEventListener('click', () => {
    const newName = window.prompt("Enter your new name:", nameEl.textContent);
    if(newName) {
      nameEl.textContent = newName;
      localStorage.setItem('traveloop_profile_name', newName);
    }

    const newBio = window.prompt("Enter a short bio:", bioEl.textContent);
    if(newBio) {
      bioEl.textContent = newBio;
      localStorage.setItem('traveloop_profile_bio', newBio);
    }
  });

});
