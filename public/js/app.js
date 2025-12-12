// public/js/app.js
(() => {
  'use strict';

  // ===== Helpers =====
  const $  = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== Estado global mínimo =====
  const state = {
    header: null,
    menu: null,
    menuBtn: null,
    modal: null,
    modalDialog: null,
    modalTitle: null,
    modalBody: null,
    lastFocus: null,
    scrollY: 0
  };

  // ===== Init =====
  document.addEventListener('DOMContentLoaded', () => {
    // Cache
    state.header = $('.header');
    state.menu   = $('#site-menu');
    state.menuBtn = $('.menu-toggle');

    state.modal = $('#plansModal');
    if (state.modal) {
      state.modalDialog = $('.modal__dialog', state.modal);
      state.modalTitle  = $('#modalTitle', state.modal);
      state.modalBody   = $('#modalBody', state.modal);
    }

    initSmoothAnchors();
    initHeaderShadow();
    initWhats();
    initReveal();
    initHeroSplit();
    initServicesObserver();
    initPlanIncludesToggle(); // para fan-items si los usas en otra vista
    initPlansModal();
    initHamburger();
    initDemoForm();

    // Si vienen con #hash directo
    if (location.hash && $(location.hash)) {
      $(location.hash).scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });

  // ===== Scroll suave en anclas =====
  function initSmoothAnchors(){
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;

      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      // Cierra menú si está abierto
      if (state.menu && state.menu.classList.contains('is-open')) {
        state.menu.classList.remove('is-open');
        state.menuBtn?.setAttribute('aria-expanded','false');
      }
      el.scrollIntoView({ behavior:'smooth', block:'start' });
    }, { passive: false });
  }

  // ===== Sombra en header al hacer scroll =====
  function initHeaderShadow(){
    if (!state.header) return;
    const onScroll = () => state.header.classList.toggle('is-scrolled', window.scrollY > 2);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== WhatsApp =====
  function initWhats(){
    const btnWhats = $('#btnWhats');
    if (!btnWhats) return;
    btnWhats.addEventListener('click', () => {
      const nombre = $('#nombre')?.value.trim() || '';
      const t = 'Hola, quiero una demo.' + (nombre ? ' Soy ' + nombre + '.' : '');
      const url = 'https://wa.me/50231239807?text=' + encodeURIComponent(t);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // ===== Reveal por scroll (.reveal) - Optimizado =====
  function initReveal(){
    const items = $$('.reveal');
    if (!items.length) return;

    // reset para re-animar correctamente en back-forward cache
    items.forEach(el => { 
      el.classList.remove('visible'); 
      // Fuerza reflow de manera más eficiente
      el.getBoundingClientRect(); 
    });

    const obs = new IntersectionObserver((entries) => {
      // Procesa en batch para mejor performance
      const toAnimate = [];
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          toAnimate.push(entry.target);
        }
      });
      
      if (toAnimate.length) {
        // Anima en el siguiente frame para evitar layout thrashing
        requestAnimationFrame(() => {
          toAnimate.forEach((el, index) => {
            // Escala el delay basado en la posición
            const delay = parseInt(el.style.getPropertyValue('--delay') || '0');
            setTimeout(() => {
              el.classList.add('visible');
              obs.unobserve(el);
            }, delay);
          });
        });
      }
    }, { 
      threshold: 0.08, 
      rootMargin: '0px 0px -8% 0px' 
    });

    items.forEach(el => obs.observe(el));

    // Optimización para navegación hacia atrás
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        items.forEach(el => { 
          el.classList.remove('visible'); 
          el.getBoundingClientRect(); 
          obs.observe(el); 
        });
      }
    }, { passive: true });
  }

  // ===== Hero split por scroll =====
  function initHeroSplit(){
    const sections = $$('[data-scroll-fade]');
    if (!sections.length) return;

    const reduce = prefersReduced();
    let ticking = false;

    const compute = () => {
      ticking = false;
      const vh = window.innerHeight || 1;
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
      const maxShift = isMobile ? 60 : 140;
      const maxY     = isMobile ? 6  : 10;
      const end      = vh * 0.4;

      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const y = -rect.top;
        const t = Math.max(0, Math.min(1, y / end));

        const text = $('.hero-text', sec);
        const bot  = $('.hero-bot', sec);
        if (!text || !bot) return;

        const txText = reduce ? 0 : (-maxShift * t);
        const txBot  = reduce ? 0 : ( maxShift * t);
        const tyText = reduce ? 0 : (-maxY    * t);
        const tyBot  = reduce ? 0 : ( maxY    * t);

        text.style.transform = `translate(${txText}px,${tyText}px)`;
        bot .style.transform = `translate(${txBot }px,${tyBot }px)`;
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    compute();
  }

  // ===== Servicios in-view =====
  function initServicesObserver(){
    const section = $('[data-services]');
    if (!section) return;
    const cards = $$('.service', section);
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const idx = cards.indexOf(el);
        const delay = Math.min(idx * 100, 300);
        el.style.transitionDelay = delay + 'ms';
        const icon = $('.service-icon', el);
        if (icon) icon.style.transitionDelay = delay + 'ms';
        el.classList.add('in-view');
        obs.unobserve(el);
      });
    }, { threshold: 0.15 });

    cards.forEach(c => observer.observe(c));
  }

  // ===== Botón ¿Qué incluye? (si usas fan-stack en otra vista) =====
  function initPlanIncludesToggle(){
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-includes');
      if (!btn) return;
      const item = btn.closest('.fan-item');
      if (!item) return;
      const stack = item.parentElement;
      $$('.fan-item', stack).forEach(f => { if (f !== item) f.classList.remove('open'); });
      item.classList.toggle('open');
    });
  }

  // ===== Modal de planes =====
  function lockScroll(){
    state.scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${state.scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.classList.add('modal-open');
  }
  function unlockScroll(){
    document.body.classList.remove('modal-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, state.scrollY || 0);
  }

  function trapFocus(e){
    if (!state.modal || !state.modal.classList.contains('show')) return;
    if (e.key !== 'Tab') return;
    const focusables = $$(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      state.modal
    ).filter(el => el.offsetParent !== null);
    if (!focusables.length) return;

    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      if (active === first || !state.modal.contains(active)) {
        last.focus(); e.preventDefault();
      }
    } else {
      if (active === last) {
        first.focus(); e.preventDefault();
      }
    }
  }

  function openModal(title, html){
    if (!state.modal) return;
    state.lastFocus = document.activeElement;

    state.modalTitle.textContent = title || 'Planes';
    state.modalBody.innerHTML = html || '';

    state.modal.classList.add('show');
    lockScroll();

    // foco inicial
    setTimeout(() => state.modalDialog?.focus(), 10);

    document.addEventListener('keydown', onEscClose);
    document.addEventListener('keydown', trapFocus);
  }

  function closeModal(){
    if (!state.modal) return;
    state.modal.classList.remove('show');
    unlockScroll();
    state.modalBody.innerHTML = '';

    document.removeEventListener('keydown', onEscClose);
    document.removeEventListener('keydown', trapFocus);

    if (state.lastFocus && typeof state.lastFocus.focus === 'function') {
      state.lastFocus.focus();
    }
  }

  function onEscClose(e){
    if (e.key === 'Escape' && state.modal?.classList.contains('show')) {
      closeModal();
    }
  }

  function initPlansModal(){
    if (!state.modal) return;

    // Abrir: solo clicks en .price-card fuera de su .modal-template
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.price-card');
      if (!card) return;
      if (e.target.closest('.modal-template')) return; // ignora clicks dentro de la plantilla oculta
      const tpl = $('.modal-template', card);
      if (!tpl) return;
      const title = card.getAttribute('data-category') || $('.card-title', card)?.textContent || 'Planes';
      openModal(title, tpl.innerHTML);
    });

    // Cerrar: overlay o botón con data-close
    state.modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close="modal"]') || e.target === $('.modal__overlay', state.modal)) {
        closeModal();
      }
    });
  }

  // ===== Hamburguesa =====
  function initHamburger(){
    if (!state.menu || !state.menuBtn) return;
    state.menuBtn.addEventListener('click', () => {
      const open = state.menu.classList.toggle('is-open');
      state.menuBtn.setAttribute('aria-expanded', String(open));
    });
    // cerrar al seleccionar un link
    $$('.menu a', state.header).forEach(a => a.addEventListener('click', () => {
      state.menu.classList.remove('is-open');
      state.menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

 // ===== Demo form (con validación visual) =====
function initDemoForm(){
  const form = $('#demoForm');
  const msg  = $('#demoMsg');
  if (!form) return;

  // Desactiva validación nativa para usar la nuestra
  form.setAttribute('novalidate', '');
  form.addEventListener('invalid', (e) => e.preventDefault(), true);

  const submitBtn = form.querySelector('button[type="submit"]');

  // Limpia errores al escribir
  form.addEventListener('input', (e)=>{
    const el = e.target.closest('input, textarea');
    if (!el) return;
    el.classList.remove('error');
    const m = el.parentNode.querySelector('.error-message');
    if (m) m.remove();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // limpia previos
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    const payload = {
      nombre:   form.nombre?.value.trim()   || '',
      email:    form.email?.value.trim()    || '',
      telefono: form.telefono?.value.trim() || '',
      mensaje:  form.mensaje?.value.trim()  || ''
    };

    let valid = true;
    if (!payload.nombre) showError(form.nombre, 'Por favor, ingresa tu nombre');
    if (!payload.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email))
      showError(form.email, 'Correo no válido');
    if (!payload.telefono || payload.telefono.length < 7)
      showError(form.telefono, 'Ingresa un teléfono válido');

    function showError(input, message){
      if (!input || !input.classList) return; // Validación para evitar error
      valid = false;
      input.classList.add('error');
      const m = document.createElement('div');
      m.className = 'error-message';
      m.textContent = message;
      input.parentNode.appendChild(m);
    }

    if (!valid) return; // no enviar si hay errores

    try {
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando...'; }

      const res  = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) throw new Error(data.error || 'Error');

      form.reset();
      if (msg) { msg.style.display = 'block'; }
    } catch (err) {
      console.error(err);
      alert('No se pudo enviar, intenta de nuevo');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Enviar'; }
    }
  });
}

})();
