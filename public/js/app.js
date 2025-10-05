// public/js/app.js

// ===== Scroll suave en anclas =====
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });
});
// Sombra en header al hacer scroll
(() => {
  const h = document.querySelector('.header');
  if(!h) return;
  const onScroll = () => h.classList.toggle('is-scrolled', window.scrollY > 2);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();


// ===== WhatsApp (opcional) =====
document.addEventListener('DOMContentLoaded', function(){
  var btnWhats = document.getElementById('btnWhats');
  if(btnWhats){
    btnWhats.addEventListener('click', function(){
      var nombre = document.getElementById('nombre') ? document.getElementById('nombre').value.trim() : '';
      var t = 'Hola, quiero una demo.' + (nombre ? ' Soy ' + nombre + '.' : '');
      var url = 'https://wa.me/50231239807?text=' + encodeURIComponent(t);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
});

// ===== Reveal por scroll (.reveal) =====
(function(){
  function setupReveals(){
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if(!items.length) return;

    items.forEach(function(el){
      el.classList.remove('visible');
      void el.offsetWidth;
    });

    var obs = new IntersectionObserver(function(entries, observer){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:0.08, rootMargin:'0px 0px -10% 0px' });

    items.forEach(function(el){ obs.observe(el); });
  }
  document.addEventListener('DOMContentLoaded', setupReveals);
  window.addEventListener('pageshow', setupReveals);
})();

// ===== Hero: separación al hacer scroll (data-scroll-fade) =====
(function(){
  function setupScrollSplitSections(){
    var sections = [].slice.call(document.querySelectorAll('[data-scroll-fade]'));
    if(!sections.length) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking = false;

    function compute(){
      ticking = false;
      var vh = window.innerHeight || 1;
      var isMobile = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
      var maxShift = isMobile ? 60 : 140;
      var maxY = isMobile ? 6 : 10;
      var end = vh * 0.4;

      sections.forEach(function(sec){
        var rect = sec.getBoundingClientRect();
        var y = -rect.top;
        var t = Math.max(0, Math.min(1, y / end));

        var text = sec.querySelector('.hero-text');
        var bot  = sec.querySelector('.hero-bot');
        if(!text || !bot) return;

        var txText = reduce ? 0 : (0 + (-maxShift - 0) * t);
        var txBot  = reduce ? 0 : (0 + ( maxShift - 0) * t);
        var tyText = reduce ? 0 : (0 + (-maxY    - 0) * t);
        var tyBot  = reduce ? 0 : (0 + ( maxY    - 0) * t);

        text.style.transform = 'translate(' + txText + 'px,' + tyText + 'px)';
        bot.style.transform  = 'translate(' + txBot  + 'px,' + tyBot  + 'px)';
      });
    }
    function onScroll(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    }

    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    compute();
  }

  document.addEventListener('DOMContentLoaded', setupScrollSplitSections);
  window.addEventListener('pageshow', setupScrollSplitSections);
})();

// ===== Servicios: entrada al hacer scroll (data-services) =====
(function(){
  function setupServicesScroll(){
    var section = document.querySelector('[data-services]');
    if(!section) return;
    var cards = [].slice.call(section.querySelectorAll('.service'));
    if(!cards.length) return;

    var observer = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var el = en.target;
        var idx = cards.indexOf(el);
        var delay = Math.min(idx*100, 300);
        el.style.transitionDelay = delay + 'ms';
        var icon = el.querySelector('.service-icon');
        if(icon) icon.style.transitionDelay = delay + 'ms';
        el.classList.add('in-view');
        obs.unobserve(el);
      });
    }, { threshold:0.15 });

    cards.forEach(function(c){ observer.observe(c); });
  }
  document.addEventListener('DOMContentLoaded', setupServicesScroll);
  window.addEventListener('pageshow', setupServicesScroll);
})();

// ===== ¿Qué incluye? por plan (delegación) =====
(function(){
  document.addEventListener('click', function(e){
    var btn = e.target.closest('.btn-includes');
    if(!btn) return;
    e.stopPropagation();
    var item = btn.closest('.fan-item');
    if(!item) return;
    var stack = item.parentElement;
    stack.querySelectorAll('.fan-item').forEach(function(f){ if(f !== item) f.classList.remove('open'); });
    item.classList.toggle('open');
  });
})();

// ===== Popup de planes =====
(function(){
  var modal = document.getElementById('plansModal');
  var modalBody = document.getElementById('modalBody');
  var modalTitle = document.getElementById('modalTitle');
  var lastFocus = null;

  var __savedScrollY = 0;

  function lockScroll(){
    __savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    document.body.dataset.scrollY = String(__savedScrollY);
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + __savedScrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.classList.add('modal-open');
  }

  function unlockScroll(){
    var topStr = document.body.style.top || '';
    var y = 0;
    if(topStr){
      var n = parseInt(topStr, 10);
      if(!isNaN(n)) y = -n;
    } else if (document.body.dataset.scrollY){
      y = parseInt(document.body.dataset.scrollY, 10) || 0;
    }

    document.body.classList.remove('modal-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    delete document.body.dataset.scrollY;

    requestAnimationFrame(function(){
      window.scrollTo(0, y);
    });
  }

  function openModal(title, html){
    lastFocus = document.activeElement;
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modal.classList.add('show');
    lockScroll();
    var dialog = modal.querySelector('.modal__dialog');
    setTimeout(function(){ dialog && dialog.focus(); }, 10);
  }

  function closeModal(){
    modal.classList.remove('show');
    unlockScroll();
    modalBody.innerHTML = '';
    if(lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  window.__openPlansModal = openModal;
  window.__closePlansModal = closeModal;

  (function(){
    var modal = document.getElementById('plansModal');
    if(!modal) return;

    document.addEventListener('click', function(e){
      var card = e.target.closest('.price-card');
      if(card && !e.target.closest('.modal-template')){
        var tpl = card.querySelector('.modal-template');
        if(!tpl) return;
        var title = card.getAttribute('data-category') || (card.querySelector('.card-title') ? card.querySelector('.card-title').textContent : 'Planes');
        if (window.__openPlansModal) window.__openPlansModal(title, tpl.innerHTML);
        return;
      }
      if(e.target.closest('[data-close="modal"]')){
        if (window.__closePlansModal) window.__closePlansModal();
      }
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && modal.classList.contains('show')){
        if (window.__closePlansModal) window.__closePlansModal();
      }
    });
  })();

})();


// === Hamburguesa (pegar al final de app.js) ===
(() => {
  const header = document.querySelector('.header');
  const nav = header ? header.querySelector('.menu') : null;
  const btn = header ? header.querySelector('.menu-toggle') : null;
  if (!nav || !btn) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });

  // Cerrar al hacer click en un link
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }));
})();



// ===== Envío del formulario de demo =====
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("demoForm");
  var msg  = document.getElementById("demoMsg");
  if (!form) return;

  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    var payload = {
      nombre:   form.nombre ? form.nombre.value.trim() : '',
      email:    form.email ? form.email.value.trim() : '',
      telefono: form.telefono ? form.telefono.value.trim() : '',
      mensaje:  form.mensaje ? form.mensaje.value.trim() : ''
    };

    if (!payload.nombre || !payload.email) {
      alert("Completa nombre y correo");
      return;
    }

    try {
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Enviando..."; }

      var res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      var data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Error");

      form.reset();
      if (msg) { msg.style.display = "block"; }
    } catch (err) {
      console.error(err);
      alert("No se pudo enviar, intenta de nuevo");
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Enviar"; }
    }
  });
});
