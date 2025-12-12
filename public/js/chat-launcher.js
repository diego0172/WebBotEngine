// ========= Launcher para Chatbot Interactivo =========

document.addEventListener('DOMContentLoaded', function() {
  const openChatBtn = document.getElementById('openChatBtn');
  const demoMsg = document.getElementById('demoMsg');
  
  if (!openChatBtn) return;
  
  openChatBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Obtener datos opcionales del formulario
    const userName = document.getElementById('userName')?.value.trim() || 'Usuario';
    const businessType = document.getElementById('businessType')?.value || '';
    
    // Guardar contexto para el chatbot
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('chatUserName', userName);
      sessionStorage.setItem('chatBusinessType', businessType);
    }
    
    // Mostrar mensaje de éxito
    if (demoMsg) {
      demoMsg.style.display = 'block';
      setTimeout(() => {
        demoMsg.style.display = 'none';
      }, 5000);
    }
    
    // Abrir el chatbot
    openChatbot(userName, businessType);
    
    // Scroll suave hacia arriba para ver el chatbot
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 300);
  });
});

// Función para abrir el chatbot
function openChatbot(userName, businessType) {
  // Buscar el botón/toggle del chatbot
  const chatToggle = document.querySelector('.chatbot-toggle') || 
                     document.querySelector('.chat-toggle') ||
                     document.querySelector('#chatbot-toggle') ||
                     document.querySelector('.bot-toggle');
  
  if (chatToggle) {
    // Si existe el toggle, hacer click en él
    chatToggle.click();
    
    // Esperar a que se abra y enviar mensaje de bienvenida personalizado
    setTimeout(() => {
      sendWelcomeMessage(userName, businessType);
    }, 500);
  } else {
    // Si no hay toggle, intentar mostrar el chatbot directamente
    const chatContainer = document.querySelector('.chatbot-container') ||
                          document.querySelector('.chat-container') ||
                          document.getElementById('chatbot');
    
    if (chatContainer) {
      chatContainer.style.display = 'flex';
      chatContainer.classList.add('active', 'open');
      
      setTimeout(() => {
        sendWelcomeMessage(userName, businessType);
      }, 500);
    } else {
      // Si no existe el chatbot, mostrar alerta
      console.warn('Chatbot no encontrado en la página');
      alert('El chatbot se está cargando... Por favor espera un momento.');
    }
  }
}

// Enviar mensaje de bienvenida personalizado
function sendWelcomeMessage(userName, businessType) {
  const chatMessages = document.querySelector('.chatbot-messages') ||
                       document.querySelector('.chat-messages') ||
                       document.querySelector('.messages-container');
  
  if (!chatMessages) return;
  
  // Limpiar mensajes anteriores si existen
  chatMessages.innerHTML = '';
  
  // Crear mensaje de bienvenida
  const welcomeMsg = document.createElement('div');
  welcomeMsg.className = 'message bot-message';
  
  let greeting = `¡Hola${userName !== 'Usuario' ? ' ' + userName : ''}! 👋`;
  let context = '';
  
  if (businessType) {
    const businessTypes = {
      'restaurant': 'restaurantes y cafeterías',
      'retail': 'tiendas y retail',
      'services': 'servicios profesionales',
      'ecommerce': 'comercio electrónico',
      'health': 'salud y bienestar',
      'education': 'educación',
      'other': 'tu industria'
    };
    context = `\n\nVeo que estás interesado en soluciones para ${businessTypes[businessType] || 'tu negocio'}. `;
  }
  
  welcomeMsg.innerHTML = `
    <div class="message-content">
      <p>${greeting}</p>
      <p>Soy el asistente de BotEngine. 🤖${context}</p>
      <p>¿En qué puedo ayudarte hoy? Puedes preguntarme sobre:</p>
      <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
        <li>💬 Chatbots para WhatsApp y Web</li>
        <li>🌐 Diseño de sitios web</li>
        <li>💰 Precios y planes</li>
        <li>⚙️ Cómo funciona el servicio</li>
        <li>📞 Contactar con un asesor</li>
      </ul>
    </div>
  `;
  
  chatMessages.appendChild(welcomeMsg);
  
  // Enfocar el input del chat
  const chatInput = document.querySelector('.chatbot-input') ||
                    document.querySelector('.chat-input') ||
                    document.querySelector('input[type="text"]');
  
  if (chatInput) {
    setTimeout(() => {
      chatInput.focus();
    }, 100);
  }
}

// Agregar estilos para los mensajes de bienvenida
const style = document.createElement('style');
style.textContent = `
  .message {
    margin: 10px 0;
    padding: 12px 16px;
    border-radius: 12px;
    max-width: 85%;
    animation: messageSlideIn 0.3s ease;
  }
  
  .bot-message {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1));
    border: 1px solid rgba(14, 165, 233, 0.2);
    align-self: flex-start;
  }
  
  .message-content p {
    margin: 8px 0;
    line-height: 1.6;
  }
  
  .message-content p:first-child {
    margin-top: 0;
  }
  
  .message-content p:last-child {
    margin-bottom: 0;
  }
  
  @keyframes messageSlideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
