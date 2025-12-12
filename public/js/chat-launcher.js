// ========= Launcher para Chatbot Interactivo =========

document.addEventListener('DOMContentLoaded', function() {
  const openChatBtn = document.getElementById('openChatBtn');
  const demoMsg = document.getElementById('demoMsg');
  const demoForm = document.getElementById('demoForm');
  
  // Prevenir el submit del formulario
  if (demoForm) {
    demoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Form submit prevented');
      return false;
    });
  }
  
  if (!openChatBtn) {
    console.warn('⚠️ openChatBtn no encontrado');
    return;
  }
  
  console.log('✅ Chat launcher inicializado');
  
  openChatBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ Click en botón de chat detectado - Abriendo nueva página');
    
    // Abrir la página de demo en una nueva pestaña
    window.open('test-demo-chatbot.html', '_blank');
    
    // Mostrar mensaje de confirmación
    if (demoMsg) {
      demoMsg.textContent = '✅ Demo abierta en nueva pestaña. ¡Revisa tu navegador!';
      demoMsg.style.display = 'block';
      setTimeout(() => {
        demoMsg.style.display = 'none';
      }, 5000);
    }
  });
});

// Función para abrir el chatbot
function openChatbot(userName, businessType) {
  // Buscar el botón del nuevo chatbot (chatbot-ai.js)
  const chatBubble = document.getElementById('chat-bubble');
  const chatWindow = document.getElementById('chat-window');
  
  if (chatBubble && chatWindow) {
    // Si el chat no está abierto, hacer click en la burbuja
    if (chatWindow.style.display === 'none' || !chatWindow.style.display) {
      chatBubble.click();
    }
    
    // El chatbot ya tiene su propio mensaje de bienvenida
    console.log('✅ Chatbot abierto desde formulario');
  } else {
    // Fallback: buscar otros elementos del chatbot
    const chatToggle = document.querySelector('.chatbot-toggle') || 
                       document.querySelector('.chat-toggle') ||
                       document.querySelector('#chatbot-toggle') ||
                       document.querySelector('.bot-toggle');
    
    if (chatToggle) {
      chatToggle.click();
    } else {
      console.warn('⚠️ Chatbot no encontrado. Esperando a que se cargue...');
      // Reintentar después de un momento
      setTimeout(() => {
        const retryBubble = document.getElementById('chat-bubble');
        if (retryBubble) {
          retryBubble.click();
          console.log('✅ Chatbot abierto (segundo intento)');
        }
      }, 1000);
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
const launcherStyle = document.createElement('style');
launcherStyle.textContent = `
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
document.head.appendChild(launcherStyle);
