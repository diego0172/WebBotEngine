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
(function () {
  function nukeState() {
    try {
      document.cookie.split(";").forEach(function (c) {
        var name = c.trim().split("=")[0];
        if (name) {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      });
    } catch (e) {}
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(function (regs) { regs.forEach(function (r) { r.unregister(); }); })
        .catch(function () {});
    }
  }

  function setupReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    items.forEach(function (el) {
      el.classList.remove("visible");
      void el.offsetWidth;
    });

    var obs = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

    items.forEach(function (el) { obs.observe(el); });
  }

  function setupForm() {
    var f = document.getElementById("demoForm");
    var msg = document.getElementById("demoMsg");
    var btnW = document.getElementById("btnWhats");
    if (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        if (msg) { msg.style.display = "block"; }
        try { f.reset(); } catch (e) {}
      });
    }
    if (btnW) {
      btnW.addEventListener("click", function () {
        var nombre = document.getElementById("nombre") ? document.getElementById("nombre").value.trim() : "";
        var t = "Hola, quiero una demo. " + (nombre ? "Soy " + nombre + "." : "");
        var url = "https://wa.me/50200000000?text=" + encodeURIComponent(t);
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }
  }

  window.addEventListener("pageshow", function () {
    nukeState();
    setupReveals();
  });

  document.addEventListener("DOMContentLoaded", function () {
    nukeState();
    setupReveals();
    setupForm();
  });

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
})();

(function(){
  function clamp01(x){ return x < 0 ? 0 : x > 1 ? 1 : x }
  function lerp(a,b,t){ return a + (b - a) * t }

  function setupScrollSplitSections(){
    var sections = [].slice.call(document.querySelectorAll('[data-scroll-fade]'))
    if(!sections.length) return

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    var ticking = false

    function compute(){
      ticking = false
      var vh = window.innerHeight || 1
      var isMobile = window.matchMedia && window.matchMedia('(max-width: 900px)').matches
      var maxShift = isMobile ? 60 : 140   // desplazamiento horizontal máximo
      var maxY     = isMobile ? 6  : 10    // desplazamiento vertical máximo

      sections.forEach(function(sec){
        var rect = sec.getBoundingClientRect()
        var y = -rect.top
        var start = 0
        var end = vh * 0.4                  // termina antes: al 40% del viewport
        var t = clamp01((y - start) / (end - start))

        var text = sec.querySelector('.hero-text')
        var bot  = sec.querySelector('.hero-bot')
        if(!text || !bot) return

        var txText = reduce ? 0 : lerp(0, -maxShift, t)
        var txBot  = reduce ? 0 : lerp(0,  maxShift, t)
        var tyText = reduce ? 0 : lerp(0, -maxY, t)
        var tyBot  = reduce ? 0 : lerp(0,  maxY, t)

        text.style.transform = 'translate(' + txText + 'px,' + tyText + 'px)'
        bot.style.transform  = 'translate(' + txBot  + 'px,' + tyBot  + 'px)'
      })
    }

    function onScroll(){
      if(ticking) return
      ticking = true
      requestAnimationFrame(compute)
    }

    window.addEventListener('scroll', onScroll, {passive:true})
    window.addEventListener('resize', onScroll)
    compute()
  }

  document.addEventListener('DOMContentLoaded', setupScrollSplitSections)
  window.addEventListener('pageshow', setupScrollSplitSections)
})();


