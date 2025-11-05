// CHATBOT CON IA - WebBotEngine
class AIBotEngine {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbot();
        this.setupEvents();
        this.showWelcomeMessage();
    }

    createChatbot() {
        const chatHTML = `
        <div id="ai-chatbot" style="
            position: fixed !important;
            bottom: 20px !important;
            left: 20px !important;
            z-index: 99999 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        ">
            <!-- Burbuja del chat -->
            <div id="chat-bubble" style="
                width: 60px !important;
                height: 60px !important;
                background: linear-gradient(135deg, #0ea5e9, #8b5cf6) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                box-shadow: 0 4px 20px rgba(14, 165, 233, 0.5) !important;
                transition: all 0.3s ease !important;
                border: 2px solid rgba(255, 255, 255, 0.2) !important;
                animation: bounce 2s infinite ease-in-out !important;
            ">
                <span style="font-size: 24px; color: white;">🤖</span>
                <div id="notification-badge" style="
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
            </div>

            <!-- Ventana del chat -->
            <div id="chat-window" style="
                position: absolute !important;
                bottom: 80px !important;
                left: 0 !important;
                width: 350px !important;
                height: 500px !important;
                background: rgba(15, 23, 42, 0.95) !important;
                border-radius: 16px !important;
                border: 1px solid rgba(14, 165, 233, 0.3) !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
                display: none !important;
                flex-direction: column !important;
                backdrop-filter: blur(20px) !important;
                overflow: hidden !important;
            ">
                <!-- Header -->
                <div style="
                    background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(139, 92, 246, 0.2)) !important;
                    padding: 16px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
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
                            font-size: 18px;
                        ">🤖</div>
                        <div>
                            <h4 style="margin: 0; color: #f8fafc; font-size: 16px;">WebBot Inteligente</h4>
                            <span style="color: #10b981; font-size: 12px;">🟢 Patrones Inteligentes</span>
                        </div>
                    </div>
                    <button id="close-chat" style="
                        background: none !important;
                        border: none !important;
                        color: #94a3b8 !important;
                        cursor: pointer !important;
                        padding: 8px !important;
                        font-size: 18px !important;
                    ">×</button>
                </div>

                <!-- Mensajes -->
                <div id="messages-container" style="
                    flex: 1 !important;
                    padding: 16px !important;
                    overflow-y: auto !important;
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 12px !important;
                "></div>

                <!-- Input -->
                <div style="
                    padding: 16px !important;
                    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                    display: flex !important;
                    gap: 12px !important;
                ">
                    <input id="chat-input" type="text" placeholder="Pregunta sobre servicios, precios, contacto..." style="
                        flex: 1 !important;
                        background: rgba(30, 41, 59, 0.8) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        border-radius: 20px !important;
                        padding: 12px 16px !important;
                        color: #f8fafc !important;
                        font-size: 14px !important;
                        outline: none !important;
                    ">
                    <button id="send-button" style="
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
                        font-size: 16px !important;
                    ">📩</button>
                </div>
            </div>
        </div>

        <style>
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
            #messages-container::-webkit-scrollbar { width: 4px; }
            #messages-container::-webkit-scrollbar-thumb { 
                background: rgba(14, 165, 233, 0.3); 
                border-radius: 2px; 
            }
        </style>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
        console.log('🤖 Chatbot IA creado');
    }

    setupEvents() {
        const bubble = document.getElementById('chat-bubble');
        const closeBtn = document.getElementById('close-chat');
        const sendBtn = document.getElementById('send-button');
        const input = document.getElementById('chat-input');

        // Abrir/cerrar chat
        bubble.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());

        // Enviar mensaje
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        console.log('✅ Eventos configurados');
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const notification = document.getElementById('notification-badge');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.style.display = 'flex';
            notification.style.display = 'none';
            this.isOpen = true;
            
            // Focus en input
            setTimeout(() => {
                document.getElementById('chat-input').focus();
            }, 300);
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.style.display = 'none';
        this.isOpen = false;
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('bot', '¡Hola! 👋 Soy tu asistente de IA para WebBotEngine. Pregúntame sobre nuestros chatbots, páginas web, precios o cualquier servicio. ¿En qué puedo ayudarte?');
        }, 1000);
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Mostrar mensaje del usuario
        this.addMessage('user', message);
        input.value = '';

        // Mostrar indicador de escritura
        this.showTyping();

        try {
            // Llamada a la IA
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    conversationHistory: this.messages.slice(-10)
                })
            });

            const data = await response.json();
            
            this.hideTyping();

            if (data.ok && data.message) {
                this.addMessage('bot', data.message);
            } else {
                // Fallback si falla la IA
                this.addMessage('bot', this.getFallbackResponse(message));
            }

        } catch (error) {
            console.error('Error IA:', error);
            this.hideTyping();
            this.addMessage('bot', this.getFallbackResponse(message));
        }
    }

    getFallbackResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('precio') || msg.includes('costo') || msg.includes('cuánto')) {
            return '💰 Nuestros precios varían según el proyecto:\n\n• Chatbots: Q1,500 - Q7,000+\n• Páginas web: Q1,500 - Q8,000+\n• Mantenimiento: Q200\n\n¿Te interesa una cotización personalizada?';
        }
        
        if (msg.includes('servicio') || msg.includes('qué hacen') || msg.includes('ofrecen')) {
            return '🚀 En WebBotEngine ofrecemos:\n\n• 🤖 Chatbots inteligentes para WhatsApp e Instagram\n• 🌐 Páginas web modernas y rápidas\n• ⚙️ Automatización de procesos\n• 🛠️ Mantenimiento de equipos\n\n¿Cuál te interesa más?';
        }
        
        if (msg.includes('contacto') || msg.includes('teléfono') || msg.includes('email')) {
            return '📞 Puedes contactarnos:\n\n• Completa nuestro formulario en esta página\n• WhatsApp: +502-3123-9807\n• Redes sociales: @botenginecorp\n\n¿Prefieres que te contactemos nosotros?';
        }
        
        return '🤖 Gracias por tu mensaje. Te puedo ayudar con información sobre nuestros chatbots, páginas web, precios y servicios. ¿Hay algo específico que te gustaría saber?';
    }

    addMessage(sender, text) {
        const container = document.getElementById('messages-container');
        const messageDiv = document.createElement('div');
        
        const isBot = sender === 'bot';
        
        messageDiv.style.cssText = `
            background: ${isBot ? 'rgba(30, 41, 59, 0.8)' : 'linear-gradient(135deg, #0ea5e9, #8b5cf6)'} !important;
            color: white !important;
            padding: 12px 16px !important;
            border-radius: ${isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px'} !important;
            max-width: 85% !important;
            align-self: ${isBot ? 'flex-start' : 'flex-end'} !important;
            ${isBot ? 'border: 1px solid rgba(255, 255, 255, 0.1);' : ''}
            white-space: pre-line !important;
            word-wrap: break-word !important;
        `;
        
        messageDiv.textContent = text;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;

        // Guardar en historial
        this.messages.push({ sender, text, timestamp: new Date() });
    }

    showTyping() {
        const container = document.getElementById('messages-container');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        
        typingDiv.style.cssText = `
            background: rgba(30, 41, 59, 0.8) !important;
            padding: 12px 16px !important;
            border-radius: 18px 18px 18px 4px !important;
            max-width: 85% !important;
            align-self: flex-start !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        `;
        
        typingDiv.innerHTML = `
            <div style="display: flex; gap: 4px; align-items: center;">
                <span style="color: #64748b;">🤖 Pensando</span>
                <div style="display: flex; gap: 2px;">
                    <span style="width: 4px; height: 4px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite;"></span>
                    <span style="width: 4px; height: 4px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite 0.2s;"></span>
                    <span style="width: 4px; height: 4px; background: #64748b; border-radius: 50%; animation: typing 1.4s infinite 0.4s;"></span>
                </div>
            </div>
            <style>
                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-6px); opacity: 1; }
                }
            </style>
        `;
        
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) {
            typing.remove();
        }
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    new AIBotEngine();
    console.log('🚀 WebBot IA iniciado');
});

// Si ya está cargado
if (document.readyState !== 'loading') {
    new AIBotEngine();
    console.log('🚀 WebBot IA iniciado inmediatamente');
}