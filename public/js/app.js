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

    // reinicia estado
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
  function clamp01(x){ return x<0?0:x>1?1:x }
  function lerp(a,b,t){ return a + (b-a)*t }

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
        var t = clamp01(y / end);

        var text = sec.querySelector('.hero-text');
        var bot  = sec.querySelector('.hero-bot');
        if(!text || !bot) return;

        var txText = reduce ? 0 : lerp(0, -maxShift, t);
        var txBot  = reduce ? 0 : lerp(0,  maxShift, t);
        var tyText = reduce ? 0 : lerp(0, -maxY, t);
        var tyBot  = reduce ? 0 : lerp(0,  maxY, t);

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

// ===== Precios: acordeón y alturas base iguales =====
(function(){
  function getGrid(){
    return document.querySelector('#precios .precios-grid') || document.querySelector('#precios > div');
  }

  function equalizePlanHeights(){
    var grid = getGrid();
    if(!grid) return;
    var cards = grid.querySelectorAll('.plan-card');
    if(!cards.length) return;

    // cierra temporalmente <details> para medir altura base
    var details = grid.querySelectorAll('details');
    var openStates = [];
    details.forEach(function(d){ openStates.push(d.open); d.open = false; });

    // limpia min-height
    cards.forEach(function(c){ c.style.minHeight = ''; });

    // mide y fija mínima común
    var maxH = 0;
    cards.forEach(function(c){ maxH = Math.max(maxH, c.getBoundingClientRect().height); });
    var h = Math.ceil(maxH) + 'px';
    cards.forEach(function(c){ c.style.minHeight = h; });

    // restaura estados
    details.forEach(function(d,i){ d.open = openStates[i]; });
  }

  function setupPreciosAccordion(){
    var cont = document.getElementById('precios');
    if(!cont) return;
    var items = cont.querySelectorAll('details');
    if(!items.length) return;

    // cerrar todos al cargar
    items.forEach(function(d){ d.open = false; });

    // al abrir uno, cerrar los demás
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if(this.open){
          items.forEach(function(o){ if(o !== d) o.open = false; });
        }
        requestAnimationFrame(equalizePlanHeights);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    setupPreciosAccordion();
    equalizePlanHeights();
  });
  window.addEventListener('pageshow', function(){
    setupPreciosAccordion();
    equalizePlanHeights();
  });
  window.addEventListener('resize', (function(){
    var t; return function(){ clearTimeout(t); t = setTimeout(equalizePlanHeights, 150); };
  })());
})();
