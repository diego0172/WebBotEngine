// ========= Decoraciones Navideñas =========

// Crear copos de nieve
function createSnowflakes() {
  const snowflakesContainer = document.createElement('div');
  snowflakesContainer.className = 'snowflakes';
  document.body.appendChild(snowflakesContainer);

  const snowflakeChars = ['❄', '❅', '❆'];
  const numberOfSnowflakes = 50;

  for (let i = 0; i < numberOfSnowflakes; i++) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
    
    // Posición aleatoria
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.fontSize = (Math.random() * 1.5 + 0.5) + 'em';
    snowflake.style.opacity = Math.random() * 0.6 + 0.4;
    
    // Duración de animación aleatoria
    snowflake.style.animationDuration = (Math.random() * 10 + 10) + 's';
    snowflake.style.animationDelay = Math.random() * 5 + 's';
    
    snowflakesContainer.appendChild(snowflake);
  }
}

// Crear carrito de Santa con CSS Art
function createSantaSleigh() {
  const sleighContainer = document.createElement('div');
  sleighContainer.className = 'santa-sleigh';
  
  // Crear Santa
  const santa = document.createElement('div');
  santa.className = 'santa';
  santa.innerHTML = `
    <div class="santa-hat"></div>
    <div class="santa-head"></div>
    <div class="santa-beard"></div>
    <div class="santa-body"></div>
    <div class="santa-belt"></div>
    <div class="santa-buckle"></div>
  `;
  
  // Crear trineo
  const sleigh = document.createElement('div');
  sleigh.className = 'sleigh';
  sleigh.innerHTML = `
    <div class="sleigh-front"></div>
    <div class="sleigh-body">
      <div class="gift" style="bottom: 25px; left: 20px;"></div>
      <div class="gift" style="bottom: 25px; left: 40px;"></div>
      <div class="gift" style="bottom: 25px; left: 60px;"></div>
      <div class="gift" style="bottom: 10px; left: 30px;"></div>
      <div class="gift" style="bottom: 10px; left: 50px;"></div>
    </div>
    <div class="sleigh-runner"></div>
  `;
  
  // Crear reno
  const reindeer = document.createElement('div');
  reindeer.className = 'reindeer';
  reindeer.innerHTML = `
    <div class="reindeer-body"></div>
    <div class="reindeer-head"></div>
    <div class="reindeer-antler-left"></div>
    <div class="reindeer-antler-right"></div>
    <div class="reindeer-nose"></div>
    <div class="reindeer-leg"></div>
    <div class="reindeer-leg"></div>
    <div class="reindeer-leg"></div>
    <div class="reindeer-leg"></div>
  `;
  
  sleighContainer.appendChild(reindeer);
  sleighContainer.appendChild(sleigh);
  sleighContainer.appendChild(santa);
  
  document.body.appendChild(sleighContainer);
}

// Crear árbol de Navidad con luces
function createChristmasTree() {
  const treeContainer = document.createElement('div');
  treeContainer.className = 'christmas-tree';
  
  const tree = document.createElement('div');
  tree.className = 'tree';
  
  // Agregar luces al árbol
  for (let i = 1; i <= 8; i++) {
    const light = document.createElement('div');
    light.className = 'tree-light';
    tree.appendChild(light);
  }
  
  const trunk = document.createElement('div');
  trunk.className = 'tree-trunk';
  
  const star = document.createElement('div');
  star.className = 'tree-star';
  
  tree.appendChild(trunk);
  tree.appendChild(star);
  treeContainer.appendChild(tree);
  document.body.appendChild(treeContainer);
}

// Agregar divisores de nieve entre secciones
function addSnowDividers() {
  const sections = document.querySelectorAll('section');
  
  sections.forEach((section, index) => {
    if (index < sections.length - 1) {
      const divider = document.createElement('div');
      divider.className = 'snow-divider';
      
      const pile = document.createElement('div');
      pile.className = 'snow-pile';
      
      divider.appendChild(pile);
      section.after(divider);
    }
  });
}

// Agregar decoraciones flotantes al formulario
function addFormDecorations() {
  const demoSection = document.getElementById('demo');
  if (!demoSection) return;
  
  const decorations = ['🎁', '⭐', '🔔', '🎀', '❄️', '🕯️'];
  const positions = [
    { top: '10%', left: '5%', delay: '0s' },
    { top: '20%', right: '5%', delay: '0.5s' },
    { top: '40%', left: '3%', delay: '1s' },
    { top: '60%', right: '3%', delay: '1.5s' },
    { top: '80%', left: '8%', delay: '2s' },
    { top: '85%', right: '8%', delay: '2.5s' }
  ];
  
  decorations.forEach((emoji, index) => {
    const decoration = document.createElement('div');
    decoration.className = 'form-decoration';
    decoration.innerHTML = emoji;
    decoration.style.position = 'absolute';
    
    if (positions[index].top) decoration.style.top = positions[index].top;
    if (positions[index].left) decoration.style.left = positions[index].left;
    if (positions[index].right) decoration.style.right = positions[index].right;
    
    decoration.style.animationDelay = positions[index].delay;
    
    demoSection.style.position = 'relative';
    demoSection.appendChild(decoration);
  });
}

// Activar modo navideño
function activateChristmasMode() {
  // Agregar clase al body
  document.body.classList.add('christmas-mode');
  
  // Crear todos los elementos navideños
  createSnowflakes();
  createSantaSleigh();
  createChristmasTree();
  addSnowDividers();
  addFormDecorations();
  
  console.log('🎄 Modo Navideño Activado 🎅');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', activateChristmasMode);
} else {
  activateChristmasMode();
}

// Control opcional: desactivar/activar con tecla especial (Ctrl + Shift + X)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'X') {
    document.body.classList.toggle('christmas-mode');
    
    const isActive = document.body.classList.contains('christmas-mode');
    const message = isActive ? '🎄 Decoraciones activadas' : '❌ Decoraciones desactivadas';
    
    // Mostrar notificación temporal
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      z-index: 10000;
      animation: fadeInOut 2s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
  }
});

// Agregar estilos de animación para la notificación
if (!document.getElementById('christmas-animations')) {
    const christmasStyle = document.createElement('style');
    christmasStyle.id = 'christmas-animations';
    christmasStyle.textContent = `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(-10px); }
        10%, 90% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(christmasStyle);
}
