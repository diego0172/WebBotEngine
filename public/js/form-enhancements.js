// Mejoras adicionales para formularios y animaciones
document.addEventListener('DOMContentLoaded', function() {
    
    // Mejorar el formulario de demo
    const demoForm = document.getElementById('demoForm');
    if (demoForm) {
        demoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = demoForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Animación de loading
            submitBtn.textContent = 'Enviando...';
            submitBtn.style.background = 'linear-gradient(45deg, rgba(14,165,233,0.8), rgba(139,92,246,0.8))';
            submitBtn.disabled = true;
            
            // Añadir spinner
            const spinner = document.createElement('span');
            spinner.innerHTML = ' <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.appendChild(spinner);
            
            try {
                const formData = new FormData(demoForm);
                const response = await fetch('/api/demo', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    // Éxito
                    submitBtn.style.background = 'linear-gradient(45deg, rgba(16,185,129,0.9), rgba(34,197,94,0.9))';
                    submitBtn.textContent = '¡Enviado! ✨';
                    
                    // Mostrar mensaje de éxito
                    showNotification('¡Gracias! Tu solicitud ha sido enviada correctamente.', 'success');
                    
                    // Reset después de 3 segundos
                    setTimeout(() => {
                        demoForm.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Error en el envío');
                }
            } catch (error) {
                // Error
                submitBtn.style.background = 'linear-gradient(45deg, rgba(239,68,68,0.9), rgba(220,38,38,0.9))';
                submitBtn.textContent = 'Error al enviar ❌';
                showNotification('Hubo un error al enviar. Por favor intenta de nuevo.', 'error');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Sistema de notificaciones
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__icon">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <span class="notification__message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => notification.classList.add('notification--show'), 100);
        
        // Auto-remove
        setTimeout(() => {
            notification.classList.remove('notification--show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // Animaciones adicionales para imágenes
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar todas las imágenes de servicios
    document.querySelectorAll('img[src*="serv-"], .bot, .card-cover').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Efecto parallax sutil para el robot
    const botImage = document.querySelector('.bot');
    if (botImage) {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            botImage.style.transform = `translateY(${rate}px) scale(1.02)`;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    console.log('🎨 Mejoras adicionales cargadas: formularios, notificaciones y animaciones');
});

// CSS adicional inyectado
const additionalStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    background: rgba(10, 14, 26, 0.95);
    border: 1px solid rgba(14, 165, 233, 0.3);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    max-width: 350px;
}

.notification--show {
    transform: translateX(0);
}

.notification--success {
    border-color: rgba(16, 185, 129, 0.4);
}

.notification--error {
    border-color: rgba(239, 68, 68, 0.4);
}

.notification__content {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #f8fafc;
}

.notification__icon {
    font-size: 18px;
    flex-shrink: 0;
}

.notification__message {
    font-size: 14px;
    line-height: 1.4;
}

.animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Mejoras para el scroll */
html {
    scroll-behavior: smooth;
}

/* Loading spinner mejorado */
.fa-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);