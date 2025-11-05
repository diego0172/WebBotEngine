// Chatbot Simple - VERSIÓN QUE FUNCIONA
console.log('🚀 Iniciando chatbot simple...');

// Crear el widget inmediatamente
function createSimpleChatbot() {
    console.log('📝 Creando elementos del chatbot...');
    
    // Crear el HTML del chatbot
    const chatbotHTML = `
        <div id="simple-chatbot" style="
            position: fixed !important;
            bottom: 20px !important;
            left: 20px !important;
            z-index: 99999 !important;
            font-family: Arial, sans-serif !important;
        ">
            <div id="chat-bubble" style="
                width: 65px !important;
                height: 65px !important;
                background: linear-gradient(135deg, #0ea5e9, #8b5cf6) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                box-shadow: 0 8px 25px rgba(14, 165, 233, 0.6) !important;
                animation: bounce 2s infinite ease-in-out !important;
                border: 3px solid rgba(255,255,255,0.3) !important;
                filter: drop-shadow(0 0 10px rgba(14, 165, 233, 0.5)) !important;
            ">
                🤖
            </div>
            
            <div id="chat-notification" style="
                position: absolute !important;
                top: -5px !important;
                right: -5px !important;
                width: 20px !important;
                height: 20px !important;
                background: #ef4444 !important;
                color: white !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 12px !important;
                font-weight: bold !important;
                animation: pulse 1.5s infinite !important;
            ">1</div>
            
            <div id="chat-window" style="
                position: absolute !important;
                bottom: 80px !important;
                left: 0 !important;
                width: 320px !important;
                height: 450px !important;
                background: rgba(15, 23, 42, 0.95) !important;
                border-radius: 16px !important;
                border: 1px solid rgba(14, 165, 233, 0.3) !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
                display: none !important;
                flex-direction: column !important;
                backdrop-filter: blur(20px) !important;
            ">
                <div style="
                    background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(139, 92, 246, 0.2)) !important;
                    padding: 16px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                    border-radius: 16px 16px 0 0 !important;
                ">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <i class="fas fa-robot" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: #f8fafc; font-size: 16px;">WebBot Assistant</h4>
                            <span style="color: #10b981; font-size: 12px;">🟢 En línea</span>
                        </div>
                    </div>
                    <button id="close-chat" style="
                        background: none;
                        border: none;
                        color: #94a3b8;
                        cursor: pointer;
                        padding: 8px;
                        border-radius: 6px;
                        font-size: 16px;
                    ">×</button>
                </div>
                
                <div id="messages" style="
                    flex: 1 !important;
                    padding: 16px !important;
                    overflow-y: auto !important;
                    max-height: 300px !important;
                ">
                    <div style="
                        background: rgba(30, 41, 59, 0.8);
                        color: #f8fafc;
                        padding: 12px 16px;
                        border-radius: 18px 18px 18px 4px;
                        margin-bottom: 12px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    ">¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte con nuestros servicios de chatbots y páginas web?</div>
                </div>
                
                <div style="
                    padding: 16px !important;
                    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                    display: flex !important;
                    gap: 12px !important;
                ">
                    <input id="chat-input" type="text" placeholder="Escribe tu mensaje..." style="
                        flex: 1 !important;
                        background: rgba(30, 41, 59, 0.8) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        border-radius: 20px !important;
                        padding: 12px 16px !important;
                        color: #f8fafc !important;
                        font-size: 14px !important;
                        outline: none !important;
                    ">
                    <button id="send-btn" style="
                        width: 40px !important;
                        height: 40px !important;
                        background: linear-gradient(135deg, #0ea5e9, #8b5cf6) !important;
                        border: none !important;
                        border-radius: 50% !important;
                        color: white !important;
                        cursor: pointer !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    ">📩</button>
                </div>
            </div>
        </div>
        
        <style>
            /* Chatbot - Estilos garantizados */
            #simple-chatbot, #simple-chatbot * {
                box-sizing: border-box !important;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-3px); }
                60% { transform: translateY(-1px); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            #messages::-webkit-scrollbar { 
                width: 4px !important; 
            }
            #messages::-webkit-scrollbar-thumb { 
                background: rgba(14, 165, 233, 0.3) !important; 
                border-radius: 2px !important; 
            }
            
            #chat-input:focus {
                border-color: #0ea5e9 !important;
                box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1) !important;
            }
            
            #chat-bubble:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 6px 25px rgba(14, 165, 233, 0.5) !important;
            }
            
            #send-btn:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4) !important;
            }
            
            /* Mobile específico */
            @media (max-width: 768px) {
                #simple-chatbot {
                    bottom: 15px !important;
                    left: 15px !important;
                }
                
                #chat-window {
                    position: fixed !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100vw !important;
                    height: 70vh !important;
                    border-radius: 20px 20px 0 0 !important;
                }
            }
        </style>
    `;
    
    // Insertar en el body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    console.log('✅ HTML del chatbot insertado');
    
    // Verificar inserción inmediatamente
    const insertedChatbot = document.getElementById('simple-chatbot');
    if (insertedChatbot) {
        console.log('🎉 ¡CHATBOT INSERTADO CORRECTAMENTE!', insertedChatbot);
        // Mostrar mensaje en la página también
        setTimeout(() => {
            console.log('%c🤖 CHATBOT ACTIVO - Busca la burbuja azul en la esquina inferior izquierda', 'color: #0ea5e9; font-size: 16px; font-weight: bold;');
        }, 1000);
    } else {
        console.error('❌ ERROR: No se pudo insertar el chatbot');
    }
    
    // Configurar eventos
    setupChatEvents();
}

function setupChatEvents() {
    console.log('⚙️ Configurando eventos del chatbot...');
    
    const bubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('chat-input');
    const notification = document.getElementById('chat-notification');
    
    console.log('🔍 Elementos encontrados:', {
        bubble: !!bubble,
        chatWindow: !!chatWindow,
        closeBtn: !!closeBtn,
        sendBtn: !!sendBtn,
        input: !!input,
        notification: !!notification
    });
    
    if (!bubble) {
        console.error('❌ No se encontró el botón del chat');
        return;
    }
    
    // Abrir chat
    bubble.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🖱️ Click en burbuja del chat');
        
        const chatWindow = document.getElementById('chat-window');
        const chatNotification = document.getElementById('chat-notification');
        
        if (chatWindow) {
            chatWindow.style.display = 'flex';
            chatWindow.style.visibility = 'visible';
            chatWindow.style.opacity = '1';
            chatWindow.classList.add('open');
            console.log('✅ Ventana de chat abierta');
            
            // Focus en el input después de un momento
            setTimeout(() => {
                const chatInput = document.getElementById('chat-input');
                if (chatInput) {
                    chatInput.focus();
                }
            }, 300);
        } else {
            console.error('❌ No se encontró la ventana de chat');
        }
        
        if (chatNotification) {
            chatNotification.style.display = 'none';
        }
    });
    
    // Cerrar chat
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('❌ Cerrando chat');
            
            const chatWindow = document.getElementById('chat-window');
            if (chatWindow) {
                chatWindow.style.display = 'none';
                chatWindow.style.visibility = 'hidden';
                chatWindow.style.opacity = '0';
                chatWindow.classList.remove('open');
                console.log('✅ Ventana de chat cerrada');
            }
        });
    } else {
        console.warn('⚠️ Botón de cerrar no encontrado');
    }
    
    // Enviar mensaje
    function sendMessage() {
        const message = input.value.trim();
        if (message) {
            console.log('📤 Enviando mensaje:', message);
            addMessage(message, 'user');
            input.value = '';
            
            // Respuesta automática
            setTimeout(() => {
                const responses = [
                    '🚀 ¡Gracias por tu mensaje! Nuestros servicios incluyen chatbots inteligentes y páginas web modernas.',
                    '💡 Ofrecemos automatización 24/7 para WhatsApp, Instagram y web.',
                    '📞 Para más información, puedes contactarnos directamente o completar nuestro formulario.',
                    '🎯 ¿Te interesa una demo personalizada de nuestros servicios?'
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }, 1000);
        }
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    console.log('✅ Eventos configurados correctamente');
    
    // Función global para testing
    window.testChatbot = function() {
        console.log('🧪 Probando chatbot...');
        const bubble = document.getElementById('chat-bubble');
        if (bubble) {
            bubble.click();
            console.log('🎯 Simulando click en burbuja');
        } else {
            console.error('❌ Burbuja no encontrada para test');
        }
    };
    
    // Mostrar instrucciones de test
    console.log('💡 Para probar manualmente: testChatbot()');
}

function addMessage(text, sender) {
    const messagesDiv = document.getElementById('messages');
    if (!messagesDiv) return;
    
    const messageDiv = document.createElement('div');
    const isUser = sender === 'user';
    
    messageDiv.style.cssText = `
        background: ${isUser ? 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' : 'rgba(30, 41, 59, 0.8)'} !important;
        color: white !important;
        padding: 12px 16px !important;
        border-radius: ${isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'} !important;
        margin-bottom: 12px !important;
        ${isUser ? '' : 'border: 1px solid rgba(255, 255, 255, 0.1) !important;'}
        margin-left: ${isUser ? '60px' : '0'} !important;
        margin-right: ${isUser ? '0' : '60px'} !important;
        word-wrap: break-word !important;
    `;
    
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Inicializar inmediatamente cuando se carga el DOM
if (document.readyState === 'loading') {
    console.log('⏳ DOM aún cargando, esperando...');
    document.addEventListener('DOMContentLoaded', createSimpleChatbot);
} else {
    console.log('✅ DOM listo, inicializando chatbot inmediatamente');
    createSimpleChatbot();
}

// Verificación adicional después de 2 segundos
setTimeout(() => {
    const chatbot = document.getElementById('simple-chatbot');
    if (!chatbot) {
        console.warn('⚠️ Chatbot no encontrado, re-inicializando...');
        createSimpleChatbot();
    } else {
        console.log('� ¡CHATBOT VISIBLE Y FUNCIONANDO!');
        // Hacer que parpadee una vez para confirmar que está ahí
        const bubble = document.getElementById('chat-bubble');
        if (bubble) {
            bubble.style.animation = 'pulse 0.5s ease-in-out 3';
        }
    }
}, 2000);

console.log('�🎯 Script de chatbot simple cargado - VERSIÓN MEJORADA');