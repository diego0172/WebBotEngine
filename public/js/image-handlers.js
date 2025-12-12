// Image handlers - Sin inline event handlers para CSP
document.addEventListener('DOMContentLoaded', () => {
    // Handler para el robot del hero
    const heroRobot = document.getElementById('hero-robot');
    if (heroRobot) {
        heroRobot.addEventListener('load', () => {
            console.log('🤖 Robot cargado correctamente');
        });
        
        heroRobot.addEventListener('error', function() {
            console.warn('⚠️ Error al cargar robot, usando fallback');
            this.style.display = 'none';
        });
    }

    // Handler para iconos de servicios con fallback
    const serviceIcons = document.querySelectorAll('.service-icon[data-fallback]');
    serviceIcons.forEach(icon => {
        icon.addEventListener('error', function() {
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('service-icon-fallback')) {
                fallback.style.display = 'flex';
            }
        });
    });

    console.log('✅ Image handlers configurados sin inline events');
});
