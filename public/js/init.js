// Script de inicialización y feedback visual
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 WebBotEngine iniciando...');
    
    // Loading screen simple
    const body = document.body;
    
    // Verificar que todos los recursos críticos estén listos
    Promise.all([
        // Verificar FontAwesome
        new Promise(resolve => {
            if (document.fonts) {
                document.fonts.ready.then(resolve);
            } else {
                setTimeout(resolve, 1000);
            }
        }),
        // Verificar imagen del robot
        new Promise(resolve => {
            const robotImg = document.querySelector('.bot');
            if (robotImg) {
                if (robotImg.complete) {
                    resolve();
                } else {
                    robotImg.addEventListener('load', resolve);
                    robotImg.addEventListener('error', resolve);
                    setTimeout(resolve, 3000); // timeout
                }
            } else {
                resolve();
            }
        }),
        // Verificar CSS
        new Promise(resolve => {
            setTimeout(resolve, 500); // tiempo mínimo de loading
        })
    ]).then(() => {
        console.log('✅ Todos los recursos cargados');
        
        // Fade in del contenido
        body.style.opacity = '1';
        body.style.transition = 'opacity 0.5s ease-in-out';
        
        // Mostrar mensaje de bienvenida en consola
        setTimeout(() => {
            console.log(`
🤖 ¡Bienvenido a WebBotEngine!

🎨 Tema oscuro profesional ✓
🖼️ Optimización de imágenes ✓  
📱 Diseño responsive ✓
⚡ Performance optimizado ✓
🔧 Sistema de fallbacks ✓

💡 Comandos disponibles en consola:
• enhanceAllImages() - Aplicar fondos difuminados
• removeEnhancements() - Quitar mejoras de imágenes

🌟 ¡Todo listo para una experiencia increíble!
            `);
        }, 1000);
        
        // Pequeña animación de celebración
        const robot = document.querySelector('.bot');
        if (robot) {
            setTimeout(() => {
                robot.style.transform = 'scale(1.05) rotate(5deg)';
                setTimeout(() => {
                    robot.style.transform = '';
                }, 500);
            }, 1500);
        }
    });
    
    // Error handling global mejorado
    window.addEventListener('error', function(e) {
        console.warn('⚠️ Error detectado:', e.filename, e.message);
        
        // Si es un error de imagen, mostrar notificación sutil
        if (e.filename && e.filename.includes('.png') || e.filename.includes('.jpg')) {
            console.log('🔄 Activando sistema de fallback para imágenes...');
        }
    });
    
    // Performance monitoring simple
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const loadTime = performance.now();
                console.log(`⏱️ Página cargada en ${Math.round(loadTime)}ms`);
                
                if (loadTime < 2000) {
                    console.log('🚀 ¡Carga súper rápida!');
                } else if (loadTime < 4000) {
                    console.log('✅ Carga óptima');
                } else {
                    console.log('📡 Verificar conexión para mejor rendimiento');
                }
            }, 100);
        });
    }
});

// Inicialización temprana del tema
document.documentElement.style.setProperty('--transition-duration', '0.3s');
document.body.style.opacity = '0.95'; // Fade in inicial