// Mejoras de compatibilidad y diseño para formulario
document.addEventListener('DOMContentLoaded', function() {
    
    // Aplicar estilos mejorados al formulario si no se aplicaron correctamente
    const demoForm = document.getElementById('demoForm');
    if (demoForm) {
        // Remover cualquier estilo inline que pueda estar interfiriendo
        demoForm.removeAttribute('style');
        
        // Asegurar que tenga la clase correcta
        demoForm.classList.add('demo-form-enhanced');
        
        // Mejorar los inputs
        const inputs = demoForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.removeAttribute('style');
            
            // Añadir eventos de focus para mejor UX
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                if (this.value.trim() !== '') {
                    this.parentElement.classList.add('filled');
                } else {
                    this.parentElement.classList.remove('filled');
                }
            });
        });
        
        // Validación visual mejorada
        const submitBtn = demoForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            demoForm.addEventListener('submit', function(e) {
                const requiredFields = demoForm.querySelectorAll('input[required]');
                let allValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.parentElement.classList.add('error');
                        allValid = false;
                    } else {
                        field.parentElement.classList.remove('error');
                    }
                });
                
                if (!allValid) {
                    e.preventDefault();
                    
                    // Vibrar en móvil para indicar error
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100, 50, 100]);
                    }
                }
            });
        }
    }
    
    // Mejorar el espaciado en dispositivos pequeños
    function adjustLayoutForMobile() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Asegurar que el chatbot no interfiera
            document.body.style.paddingBottom = '80px';
            
            // Ajustar el formulario para móvil
            const demoSection = document.getElementById('demo');
            if (demoSection) {
                demoSection.style.marginBottom = '60px';
            }
        } else {
            document.body.style.paddingBottom = '';
            const demoSection = document.getElementById('demo');
            if (demoSection) {
                demoSection.style.marginBottom = '';
            }
        }
    }
    
    // Ajustar al cargar y al cambiar tamaño
    adjustLayoutForMobile();
    window.addEventListener('resize', adjustLayoutForMobile);
    
    console.log('📱 Mejoras de formulario y diseño móvil aplicadas');
});

// CSS adicional para estados del formulario
const formStyles = `
.demo-form-enhanced .focused {
    transform: translateY(-1px);
}

.demo-form-enhanced .error input,
.demo-form-enhanced .error textarea {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.demo-form-enhanced .error label {
    color: #ef4444 !important;
}

.demo-form-enhanced .filled label {
    color: #0ea5e9;
}

/* Animación suave para los campos */
.demo-form-enhanced div {
    transition: all 0.2s ease;
}

/* Mejorar el botón de WhatsApp */
#demoForm button[type="button"] {
    background: #25d366 !important;
    color: white !important;
    border: 1px solid #25d366 !important;
}

#demoForm button[type="button"]:hover {
    background: #128c7e !important;
    border-color: #128c7e !important;
}
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = formStyles;
document.head.appendChild(styleSheet);