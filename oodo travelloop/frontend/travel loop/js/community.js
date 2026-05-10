// COMMUNITY PAGE LOGIC
document.addEventListener('DOMContentLoaded', () => {

  // Like button toggles
  document.querySelectorAll('[id^="likeBtn"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const liked = btn.classList.toggle('liked');
      const svgEl = btn.querySelector('svg');
      svgEl.setAttribute('fill', liked ? 'currentColor' : 'none');
      svgEl.setAttribute('stroke', liked ? 'none' : 'currentColor');
      // Update count
      const parts = btn.textContent.trim().split(' ');
      const count = parseInt(parts[0]);
      btn.innerHTML = btn.innerHTML.replace(/\d+ Likes/, `${liked ? count + 1 : count - 1} Likes`);
    });
  });

  // Tabs
  const tabs = ['tabFeed', 'tabTrending', 'tabFollowing'];
  tabs.forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(id)?.classList.add('active');
    });
  });

  // Follow buttons
  document.querySelectorAll('.follow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const following = btn.textContent === 'Following';
      btn.textContent = following ? 'Follow' : 'Following';
      btn.style.background = following ? '' : 'var(--primary-glow)';
    });
  });

  // New Post button
  document.getElementById('newPostBtn')?.addEventListener('click', () => {
    alert('Post creation modal coming soon!');
  });

});
