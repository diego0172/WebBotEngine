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
    initServicesModal(); // Modal para servicios

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

  // ===== Botón ¿Qué incluye? =====
  function initPlanIncludesToggle(){
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-includes');
      if (!btn) return;
      
      console.log('Botón clickeado:', btn);
      
      // Buscar tanto fan-item como plan-mini
      const item = btn.closest('.fan-item') || btn.closest('.plan-mini');
      console.log('Item encontrado:', item);
      
      if (!item) return;
      
      const stack = item.parentElement;
      
      // Cerrar otros items abiertos en el mismo contenedor
      const selector = item.classList.contains('fan-item') ? '.fan-item' : '.plan-mini';
      $$(selector, stack).forEach(f => { 
        if (f !== item) f.classList.remove('open'); 
      });
      
      // Toggle del item actual
      const wasOpen = item.classList.contains('open');
      item.classList.toggle('open');
      console.log('Clase open:', !wasOpen ? 'agregada' : 'removida');
      console.log('Clases del item:', item.className);
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
    // cerrar al seleccionar un link interno (no externos ni botones)
    $$('.menu a', state.header).forEach(a => {
      // Solo cerrar menú en links internos (#), no en externos o botones de acción
      if (a.getAttribute('href')?.startsWith('#')) {
        a.addEventListener('click', () => {
          state.menu.classList.remove('is-open');
          state.menuBtn.setAttribute('aria-expanded', 'false');
        });
      }
    });
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

  // ===== Modal de servicios =====
  function initServicesModal() {
    const servicesData = {
      'agenda': {
        title: '📅 Sistema de Agenda de Citas',
        icon: 'fa-calendar-check',
        description: 'Sistema completo de agendamiento para tu negocio',
        features: [
          'Agenda en tiempo real con disponibilidad automática',
          'Confirmaciones automáticas por correo o WhatsApp',
          'Recordatorios programables para clientes',
          'Panel administrativo para gestionar citas',
          'Calendario sincronizado y vista mensual',
          'Historial completo de citas por cliente',
          'Bloqueo de horarios y días inhábiles',
          'Reportes de ocupación y tendencias'
        ],
        benefits: [
          'Elimina citas duplicadas o perdidas',
          'Reduce tiempo en coordinación telefónica',
          'Mejora experiencia del cliente',
          'Visibilidad total de tu agenda'
        ],
        idealFor: 'Clínicas, consultorios, salones de belleza, servicios profesionales',
        price: 'Desde Q4,500'
      },
      'crm': {
        title: '👥 Sistema CRM Básico',
        icon: 'fa-users',
        description: 'Gestión centralizada de clientes y relaciones',
        features: [
          'Base de datos completa de clientes',
          'Historial de interacciones y compras',
          'Seguimiento de estado de clientes (lead, activo, inactivo)',
          'Notas y comentarios por cliente',
          'Búsqueda y filtros avanzados',
          'Exportación de datos a Excel',
          'Recordatorios de seguimiento',
          'Segmentación por categorías'
        ],
        benefits: [
          'Información de clientes en un solo lugar',
          'Mejor seguimiento de oportunidades',
          'Historial completo para mejor servicio',
          'Evita pérdida de información'
        ],
        idealFor: 'Empresas de servicios, distribuidores, agencias, consultorías',
        price: 'Desde Q4,500'
      },
      'pedidos': {
        title: '📦 Sistema de Control de Pedidos',
        icon: 'fa-box',
        description: 'Seguimiento completo de pedidos y entregas',
        features: [
          'Registro de pedidos con detalle completo',
          'Seguimiento de estados (pendiente, proceso, entregado)',
          'Historial de pedidos por cliente',
          'Cálculo automático de totales',
          'Generación de comprobantes PDF',
          'Notificaciones de cambio de estado',
          'Panel de control con métricas',
          'Búsqueda y filtros por fecha, cliente o estado'
        ],
        benefits: [
          'Control total de pedidos activos',
          'Trazabilidad completa del proceso',
          'Reduce errores y olvidos',
          'Reportes para toma de decisiones'
        ],
        idealFor: 'Distribuidores, restaurantes, tiendas en línea, servicios a domicilio',
        price: 'Desde Q4,500'
      },
      'paneles': {
        title: '📊 Paneles Administrativos',
        icon: 'fa-chart-line',
        description: 'Dashboards con métricas y reportes en tiempo real',
        features: [
          'Dashboard con estadísticas visuales',
          'Gráficos de tendencias y comparativas',
          'Reportes descargables en PDF y Excel',
          'Gestión de usuarios y permisos',
          'Métricas clave personalizables',
          'Filtros por fechas y categorías',
          'Visualización de KPIs importantes',
          'Alertas y notificaciones configurables'
        ],
        benefits: [
          'Toma decisiones basadas en datos',
          'Visibilidad de métricas importantes',
          'Ahorra tiempo en crear reportes manuales',
          'Acceso desde cualquier dispositivo'
        ],
        idealFor: 'Cualquier negocio que necesite visualizar datos y generar reportes',
        price: 'Desde Q5,500'
      },
      'formularios': {
        title: '📨 Formularios Inteligentes',
        icon: 'fa-file-alt',
        description: 'Captación y procesamiento automático de datos',
        features: [
          'Formularios con validación en tiempo real',
          'Almacenamiento en base de datos',
          'Notificaciones automáticas por correo',
          'Confirmaciones personalizadas al usuario',
          'Campos condicionales según respuestas',
          'Protección contra spam',
          'Exportación de datos capturados',
          'Integración con WhatsApp y correo'
        ],
        benefits: [
          'Centraliza solicitudes y contactos',
          'Elimina hojas de cálculo sueltas',
          'Respuestas automáticas profesionales',
          'Información organizada y accesible'
        ],
        idealFor: 'Empresas que reciben solicitudes, cotizaciones o registros frecuentes',
        price: 'Desde Q2,500'
      },
      'integraciones': {
        title: '🔗 Integraciones con Herramientas',
        icon: 'fa-link',
        description: 'Conecta tu sistema con las herramientas que ya usas',
        features: [
          'Integración con WhatsApp Business API',
          'Envío automático de correos',
          'Sincronización con Google Sheets',
          'Conexión con pasarelas de pago',
          'APIs personalizadas para tu negocio',
          'Webhooks para eventos automáticos',
          'Integración con sistemas de terceros',
          'Automatización de flujos de trabajo'
        ],
        benefits: [
          'Automatiza comunicaciones',
          'Conecta herramientas que ya usas',
          'Reduce trabajo manual repetitivo',
          'Flujos de trabajo sin intervención'
        ],
        idealFor: 'Negocios que quieren automatizar procesos y conectar sistemas',
        price: 'Desde Q3,500'
      }
    };

    // Agregar efecto hover a los servicios
    document.querySelectorAll('.service[data-service]').forEach(service => {
      service.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
      });
      service.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });

    // Click en servicio
    document.addEventListener('click', (e) => {
      const serviceCard = e.target.closest('.service[data-service]');
      if (!serviceCard) return;
      
      const serviceType = serviceCard.getAttribute('data-service');
      const data = servicesData[serviceType];
      
      if (!data) return;

      const modalContent = `
        <div style="text-align: center; margin-bottom: 2.5rem; position: relative;">
          <div style="display: inline-block; position: relative; margin-bottom: 1.5rem;">
            <div style="position: absolute; inset: -15px; background: linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899); border-radius: 50%; opacity: 0.2; filter: blur(20px);"></div>
            <div style="position: relative; width: 100px; height: 100px; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 40px rgba(14, 165, 233, 0.4); border: 3px solid rgba(255, 255, 255, 0.1);">
              <i class="fas ${data.icon}" style="font-size: 3rem; color: white;"></i>
            </div>
          </div>
          <p style="font-size: 1.2rem; color: #94a3b8; margin-bottom: 1.5rem; line-height: 1.6; max-width: 600px; margin-left: auto; margin-right: auto;">${data.description}</p>
          <div style="display: inline-flex; align-items: center; gap: 0.75rem; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); color: white; padding: 0.75rem 2rem; border-radius: 50px; font-weight: 700; font-size: 1.3rem; box-shadow: 0 8px 30px rgba(14, 165, 233, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2); border: 2px solid rgba(255, 255, 255, 0.1);">
            <i class="fas fa-tag" style="font-size: 1.1rem;"></i>
            ${data.price}
          </div>
        </div>

        <div style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1)); padding: 2rem; border-radius: 16px; margin-bottom: 2rem; border: 1px solid rgba(14, 165, 233, 0.2); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; right: 0; width: 200px; height: 200px; background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%); pointer-events: none;"></div>
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);">
              <i class="fas fa-star" style="color: white; font-size: 1.2rem;"></i>
            </div>
            <h4 style="margin: 0; color: #f8fafc; font-size: 1.3rem; font-weight: 700;">Características principales</h4>
          </div>
          <ul style="margin: 0; padding-left: 0; list-style: none; color: #e2e8f0; line-height: 2;">
            ${data.features.map(f => `
              <li style="display: flex; align-items: start; gap: 0.75rem; padding: 0.5rem 0;">
                <div style="min-width: 24px; height: 24px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 2px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);">
                  <i class="fas fa-check" style="color: white; font-size: 0.7rem;"></i>
                </div>
                <span style="flex: 1;">${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1)); padding: 2rem; border-radius: 16px; margin-bottom: 2rem; border-left: 5px solid #10b981; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); position: relative; overflow: hidden;">
          <div style="position: absolute; bottom: -30px; right: -30px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%); pointer-events: none;"></div>
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
              <i class="fas fa-rocket" style="color: white; font-size: 1.2rem;"></i>
            </div>
            <h4 style="margin: 0; color: #f8fafc; font-size: 1.3rem; font-weight: 700;">Beneficios para tu negocio</h4>
          </div>
          <ul style="margin: 0; padding-left: 0; list-style: none; color: #e2e8f0; line-height: 2;">
            ${data.benefits.map(b => `
              <li style="display: flex; align-items: start; gap: 0.75rem; padding: 0.5rem 0;">
                <div style="min-width: 24px; height: 24px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 2px; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);">
                  <i class="fas fa-bolt" style="color: white; font-size: 0.7rem;"></i>
                </div>
                <span style="flex: 1;"><strong style="color: #fbbf24;">${b}</strong></span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1)); padding: 1.75rem; border-radius: 16px; margin-bottom: 2.5rem; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); border: 1px solid rgba(139, 92, 246, 0.3);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
              <i class="fas fa-briefcase" style="color: white; font-size: 1rem;"></i>
            </div>
            <p style="margin: 0; color: #c4b5fd; font-size: 1.05rem; flex: 1;">
              <strong style="color: #a78bfa; font-weight: 700;">💼 Ideal para:</strong> ${data.idealFor}
            </p>
          </div>
        </div>

        <div style="text-align: center; padding-top: 1.5rem; border-top: 2px solid rgba(14, 165, 233, 0.2);">
          <a href="https://wa.me/50231239807?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(data.title)}" 
             target="_blank"
             style="display: inline-flex; align-items: center; gap: 0.75rem; background: linear-gradient(135deg, #25D366, #128C7E); color: white; padding: 1.25rem 2.5rem; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 1.1rem; box-shadow: 0 10px 40px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2); border: 2px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; position: relative; overflow: hidden;"
             onmouseover="this.style.transform='scale(1.05) translateY(-2px)'; this.style.boxShadow='0 15px 50px rgba(37, 211, 102, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)'"
             onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='0 10px 40px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'">
            <i class="fab fa-whatsapp" style="font-size: 1.5rem;"></i>
            <span>Solicitar cotización por WhatsApp</span>
            <i class="fas fa-arrow-right" style="font-size: 1rem;"></i>
          </a>
          <p style="margin-top: 1rem; color: #94a3b8; font-size: 0.9rem;">
            <i class="fas fa-shield-alt" style="color: #10b981;"></i> Respuesta en menos de 24 horas
          </p>
        </div>
      `;

      openModal(data.title, modalContent);
    });
  }

})();
