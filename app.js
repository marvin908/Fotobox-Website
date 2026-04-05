document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  if (!form) return; // Sicherheitscheck

  const btn = form.querySelector('.submit-btn');
  const successMsg = document.getElementById('successMsg');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    btn.textContent = 'Wird gesendet...';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.style.display = 'none';
        successMsg.classList.add('show');
      } else {
        throw new Error('Submit failed');
      }
    } catch (err) {
      btn.textContent = 'Fehler – bitte erneut versuchen';
      btn.disabled = false;
    }
  });
});