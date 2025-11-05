// Verificador de estado de imágenes mejorado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Verificando todas las imágenes...');
    
    const images = document.querySelectorAll('img');
    let report = {
        total: images.length,
        loaded: 0,
        failed: 0,
        enhanced: 0,
        types: {}
    };

    images.forEach((img, index) => {
        // Clasificar tipo de imagen
        let type = 'general';
        if (img.classList.contains('service-icon')) type = 'service-icon';
        else if (img.classList.contains('bot')) type = 'bot';
        else if (img.alt && img.alt.includes('logo')) type = 'logo';
        else if (img.alt && (img.alt.includes('profile') || img.alt.includes('avatar'))) type = 'avatar';
        else if (img.src && img.src.includes('icon')) type = 'icon';
        
        if (!report.types[type]) report.types[type] = 0;
        report.types[type]++;

        // Verificar estado de carga
        if (img.complete && img.naturalHeight !== 0) {
            report.loaded++;
            console.log(`✅ Imagen ${index + 1} (${type}): Cargada correctamente - ${img.src}`);
            
            // Verificar si necesita mejora
            if (img.style.background && img.style.background.includes('radial-gradient')) {
                report.enhanced++;
                console.log(`  🎨 Con fondo difuminado aplicado`);
            }
        } else if (img.complete && img.naturalHeight === 0) {
            report.failed++;
            console.log(`❌ Imagen ${index + 1} (${type}): Error al cargar - ${img.src}`);
        } else {
            // Imagen aún cargando
            img.addEventListener('load', () => {
                report.loaded++;
                console.log(`⏳ Imagen ${index + 1} (${type}): Cargada después - ${img.src}`);
            });
            img.addEventListener('error', () => {
                report.failed++;
                console.log(`💥 Imagen ${index + 1} (${type}): Error después - ${img.src}`);
            });
        }
    });

    // Mostrar resumen después de un momento
    setTimeout(() => {
        console.log('\n📊 RESUMEN DE IMÁGENES:');
        console.log(`Total de imágenes: ${report.total}`);
        console.log(`Cargadas correctamente: ${report.loaded}`);
        console.log(`Con errores: ${report.failed}`);
        console.log(`Con mejoras aplicadas: ${report.enhanced}`);
        console.log('\n📋 Por tipo:');
        Object.entries(report.types).forEach(([type, count]) => {
            console.log(`  ${type}: ${count}`);
        });
        
        // Verificar fondos difuminados aplicados
        const elementsWithGradient = document.querySelectorAll('*[style*="radial-gradient"]');
        console.log(`\n🎨 Elementos con fondo difuminado: ${elementsWithGradient.length}`);
        
        // Verificar tema oscuro
        const isDark = document.body.style.background && 
                      (document.body.style.background.includes('10, 14, 26') || 
                       document.body.style.background.includes('#0a0e1a'));
        console.log(`🌙 Tema oscuro activo: ${isDark ? 'Sí' : 'No'}`);
        
        // Sugerencias de mejora
        if (report.failed > 0) {
            console.log('\n💡 Sugerencias:');
            console.log('- Verificar rutas de imágenes fallidas');
            console.log('- Considerar usar imágenes de respaldo');
        }
        
        if (report.enhanced < report.loaded) {
            console.log('- Algunas imágenes podrían beneficiarse de fondos difuminados');
        }
        
        console.log('\n🎯 WebBotEngine - Sistema de optimización de imágenes activo');
    }, 2000);
});

// Función para aplicar mejoras manuales
window.enhanceAllImages = function() {
    const images = document.querySelectorAll('img');
    let enhanced = 0;
    
    images.forEach(img => {
        if (!img.style.background || !img.style.background.includes('radial-gradient')) {
            img.style.background = 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)';
            img.style.borderRadius = '50%';
            img.style.padding = '5px';
            enhanced++;
        }
    });
    
    console.log(`🎨 Se aplicaron mejoras a ${enhanced} imágenes`);
    return enhanced;
};

// Función para quitar todas las mejoras
window.removeEnhancements = function() {
    const images = document.querySelectorAll('img');
    let removed = 0;
    
    images.forEach(img => {
        if (img.style.background && img.style.background.includes('radial-gradient')) {
            img.style.background = '';
            img.style.borderRadius = '';
            img.style.padding = '';
            removed++;
        }
    });
    
    console.log(`🔄 Se removieron mejoras de ${removed} imágenes`);
    return removed;
};

console.log('📷 Sistema de verificación de imágenes cargado');
console.log('💻 Comandos disponibles:');
console.log('  - enhanceAllImages() : Aplicar fondos difuminados a todas las imágenes');
console.log('  - removeEnhancements() : Quitar todas las mejoras aplicadas');