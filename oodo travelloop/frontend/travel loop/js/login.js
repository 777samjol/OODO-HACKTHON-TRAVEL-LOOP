// LOGIN PAGE LOGIC
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const btn  = document.getElementById('signInBtn');
  const txt  = document.getElementById('btnText');
  const arr  = document.getElementById('btnArrow');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Loading state
    txt.textContent = '';
    arr.style.display = 'none';
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    btn.appendChild(spinner);
    btn.disabled = true;

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: emailInput.value,
          password: passwordInput.value,
        })
      });

      if (!response.ok) {
        // If login fails, try signup automatically for demo purposes
        const signupRes = await fetch('/api/v1/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput.value, password: passwordInput.value })
        });
        if (!signupRes.ok) throw new Error('Invalid credentials');
        
        // Retry login after signup
        const retryLogin = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ username: emailInput.value, password: passwordInput.value })
        });
        const data = await retryLogin.json();
        localStorage.setItem('traveloop_token', data.access_token);
      } else {
        const data = await response.json();
        localStorage.setItem('traveloop_token', data.access_token);
      }

      window.location.href = 'home.html';
    } catch (err) {
      alert(err.message);
      // Reset button
      if(btn.contains(spinner)) btn.removeChild(spinner);
      txt.textContent = 'Sign In';
      arr.style.display = 'inline-block';
      btn.disabled = false;
    }
  });
});
