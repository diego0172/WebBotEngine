// Scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// WhatsApp prellenado
document.addEventListener('DOMContentLoaded', () => {
  const btnWhats = document.getElementById('btnWhats');
  if (btnWhats) {
    btnWhats.addEventListener('click', e => {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value || '';
      const base = 'https://wa.me/50231239807'; // tu número con código de país
      const txt = encodeURIComponent(`Hola, quiero una demo de BotEngine. Mi nombre: ${nombre}`);
      window.open(`${base}?text=${txt}`, '_blank');
    });
  }
});

// Envío del formulario a /api/demo
const form = document.getElementById('demoForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const r = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (r.ok) {
        document.getElementById('demoMsg').style.display = 'block';
        form.reset();
      } else {
        alert('No se pudo enviar. Intenta de nuevo.');
      }
    } catch (err) {
      alert('Error de red. Intenta de nuevo.');
    }
  });
}
