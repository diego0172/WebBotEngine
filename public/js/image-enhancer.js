// Solución para logos en tema oscuro
(() => {
  'use strict';

  // Función para mejorar visibilidad de imágenes en tema oscuro
  function enhanceImagesForDarkTheme() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      // Esperar a que la imagen cargue
      if (img.complete) {
        processImage(img);
      } else {
        img.addEventListener('load', () => processImage(img));
        img.addEventListener('error', () => handleBrokenImage(img));
      }
    });
  }

  function processImage(img) {
    // Detectar si es una imagen de servicio
    if (img.classList.contains('service-icon')) {
      // Crear un canvas para analizar la imagen
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      
      try {
        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0);
        
        // Obtener datos de píxeles del centro de la imagen
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        let totalBrightness = 0;
        let whitePixels = 0;
        
        // Analizar píxeles para detectar si es mayormente blanca/clara
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const brightness = (r + g + b) / 3;
          
          totalBrightness += brightness;
          if (brightness > 200) whitePixels++;
        }
        
        const avgBrightness = totalBrightness / (pixels.length / 4);
        const whiteRatio = whitePixels / (pixels.length / 4);
        
        // Si la imagen es mayormente blanca, aplicar fondo difuminado muy sutil
        if (avgBrightness > 180 || whiteRatio > 0.6) {
          img.style.background = 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 60%, transparent 90%)';
          img.style.borderRadius = '50%';
          img.style.padding = '6px';
          img.style.boxShadow = '0 0 10px rgba(255,255,255,0.03)';
        }
        
      } catch (e) {
        // Si hay error con canvas (CORS), aplicar mejoras básicas
        console.log('Applying basic image enhancement due to CORS');
        img.style.background = 'rgba(255, 255, 255, 0.05)';
        img.style.borderRadius = '8px';
        img.style.padding = '8px';
      }
    }
  }

  function handleBrokenImage(img) {
    if (img.classList.contains('service-icon')) {
      // Crear icono de reemplazo
      const iconMap = {
        'chatbot': '🤖',
        'web': '🌐', 
        'automatizacion': '⚡'
      };
      
      const src = img.src.toLowerCase();
      let icon = '💼'; // Icono por defecto
      
      Object.keys(iconMap).forEach(key => {
        if (src.includes(key)) {
          icon = iconMap[key];
        }
      });
      
      // Crear div de reemplazo
      const replacement = document.createElement('div');
      replacement.className = 'service-icon-fallback';
      replacement.textContent = icon;
      replacement.style.cssText = `
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        color: white;
        box-shadow: 0 0 20px rgba(14,165,233,.3);
        border: 2px solid #0284c7;
      `;
      
      img.parentNode.replaceChild(replacement, img);
    }
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceImagesForDarkTheme);
  } else {
    enhanceImagesForDarkTheme();
  }

  // También ejecutar cuando las imágenes cambien dinámicamente
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const images = node.querySelectorAll ? node.querySelectorAll('img') : [];
          images.forEach(processImage);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();