// DISCOVER PAGE — Hero Slider + Interactions
document.addEventListener('DOMContentLoaded', () => {

  // ---- Hero Slider ----
  const slides  = document.querySelectorAll('.hero-slide');
  const dots    = document.querySelectorAll('.slider-dot');
  let current   = 0;
  let autoTimer;

  const CONTENT = [
    {
      line1: 'DISCOVER',
      line2: 'INDONESIA',
      desc: 'The jungle and other sanctuaries are home to elephants, langur monkeys and tigers. As the largest archipelagic country in the world, Indonesia is blessed with so many different people, cultures, and traditions.',
    },
    {
      line1: 'EXPLORE',
      line2: 'ITALY',
      desc: 'From the rolling hills of Tuscany to the dramatic Amalfi Coast, Italy is a country that intoxicates the senses. Ancient ruins, renaissance art, world-class cuisine — a journey through time awaits.',
    },
    {
      line1: 'ESCAPE TO',
      line2: 'MALDIVES',
      desc: 'A necklace of 1,200 coral islands in the Indian Ocean, the Maldives is synonymous with paradise. Crystal lagoons, overwater bungalows, and pristine white-sand beaches beckon the weary traveller.',
    },
  ];

  function goTo(idx) {
    // Fade out current
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    // Update text with fade
    const l1 = document.getElementById('heroLine1');
    const l2 = document.getElementById('heroLine2');
    const desc = document.getElementById('heroDesc');

    [l1, l2, desc].forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(12px)'; });

    setTimeout(() => {
      l1.textContent  = CONTENT[current].line1;
      l2.textContent  = CONTENT[current].line2;
      desc.textContent = CONTENT[current].desc;
      [l1, l2, desc].forEach(el => {
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.opacity = '1'; el.style.transform = 'translateY(0)';
      });
    }, 300);
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoTimer);
      goTo(Number(dot.dataset.i));
      startAuto();
    });
  });

  startAuto();

  // ---- Navbar scroll style ----
  const nav = document.getElementById('topnav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ---- Save button toggle ----
  document.querySelectorAll('.card-save-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const saved = btn.classList.toggle('saved');
      btn.style.background = saved ? 'rgba(245,156,42,0.8)' : '';
    });
  });

  // ---- Intersection Observer for grid cards animation ----
  const gridCards = document.querySelectorAll('.dest-grid-card, .stat-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i * 0.08) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  gridCards.forEach(card => {
    card.style.opacity = '0'; card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(card);
  });

  // Add visible style
  const style = document.createElement('style');
  style.textContent = '.dest-grid-card.visible, .stat-item.visible { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(style);

});
