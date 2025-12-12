// CHATBOT DEMO PARA VENTAS - WebBotEngine
class AIBotEngine {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.conversationStep = 0; // Controla el flujo de la conversación
        this.userData = {
            businessType: null,
            products: null,
            interest: null
        };
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
                width: 64px !important;
                height: 64px !important;
                background: linear-gradient(135deg, #0ea5e9, #8b5cf6) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                box-shadow: 0 6px 24px rgba(14, 165, 233, 0.6) !important;
                transition: all 0.3s ease !important;
                border: 3px solid rgba(255, 255, 255, 0.3) !important;
                animation: bounce 2s infinite ease-in-out !important;
            ">
                <span style="font-size: 28px; color: white;">🎅</span>
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
                position: fixed !important;
                bottom: 95px !important;
                left: 20px !important;
                width: 380px !important;
                max-width: calc(100vw - 40px) !important;
                height: 550px !important;
                max-height: calc(100vh - 130px) !important;
                background: rgba(15, 23, 42, 0.98) !important;
                border-radius: 20px !important;
                border: 2px solid rgba(14, 165, 233, 0.4) !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(14, 165, 233, 0.1) !important;
                display: none !important;
                flex-direction: column !important;
                backdrop-filter: blur(20px) !important;
                overflow: hidden !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
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
                        ">🎅</div>
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
                <div id="input-container" style="
                    padding: 16px !important;
                    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                    display: flex !important;
                    gap: 12px !important;
                    background: rgba(15, 23, 42, 0.98) !important;
                    min-height: 70px !important;
                    align-items: center !important;
                    position: sticky !important;
                    bottom: 0 !important;
                ">
                    <input id="chat-input" type="text" placeholder="Pregunta sobre servicios, precios, contacto..." style="
                        flex: 1 !important;
                        background: rgba(30, 41, 59, 0.9) !important;
                        border: 2px solid rgba(14, 165, 233, 0.3) !important;
                        border-radius: 25px !important;
                        padding: 16px 20px !important;
                        color: #f8fafc !important;
                        font-size: 16px !important;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                        outline: none !important;
                        min-height: 24px !important;
                        line-height: 1.4 !important;
                        transition: all 0.3s ease !important;
                        -webkit-appearance: none !important;
                        -webkit-border-radius: 25px !important;
                        box-sizing: border-box !important;
                        touch-action: manipulation !important;
                        -webkit-user-select: text !important;
                        user-select: text !important;
                    ">
                    <button id="send-button" style="
                        width: 52px !important;
                        height: 52px !important;
                        background: linear-gradient(135deg, #0ea5e9, #8b5cf6) !important;
                        border: none !important;
                        border-radius: 50% !important;
                        color: white !important;
                        cursor: pointer !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-size: 20px !important;
                        transition: all 0.3s ease !important;
                        flex-shrink: 0 !important;
                        -webkit-tap-highlight-color: transparent !important;
                        touch-action: manipulation !important;
                    ">📩</button>
                </div>
            </div>
        </div>

        <style>
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-4px); }
                60% { transform: translateY(-2px); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.15); opacity: 0.9; }
            }
            
            /* Hover para botón del chat */
            #chat-bubble:hover {
                transform: scale(1.08) !important;
                box-shadow: 0 8px 32px rgba(14, 165, 233, 0.8) !important;
            }
            
            #chat-bubble:active {
                transform: scale(0.95) !important;
            }
            
            /* Estilos para móviles - Mantener consistencia */
            @media (max-width: 480px) {
                #ai-chatbot {
                    bottom: 20px !important;
                    left: 20px !important;
                }
                #chat-bubble {
                    width: 64px !important;
                    height: 64px !important;
                    box-shadow: 0 8px 28px rgba(14, 165, 233, 0.7) !important;
                }
                #chat-window {
                    left: 10px !important;
                    right: 10px !important;
                    bottom: 95px !important;
                    width: calc(100vw - 20px) !important;
                    max-width: calc(100vw - 20px) !important;
                    height: 500px !important;
                    max-height: calc(100vh - 130px) !important;
                    border-radius: 20px 20px 0 0 !important;
                    transition: height 0.3s ease, bottom 0.3s ease, border-radius 0.3s ease !important;
                }
                #chat-input {
                    font-size: 16px !important;
                    padding: 16px 20px !important;
                    min-height: 24px !important;
                    border-radius: 25px !important;
                    border-width: 2px !important;
                    box-shadow: 0 2px 12px rgba(14, 165, 233, 0.15) !important;
                }
                #input-container {
                    padding: 16px !important;
                    min-height: 76px !important;
                    background: rgba(15, 23, 42, 1) !important;
                    border-top: 2px solid rgba(255, 255, 255, 0.1) !important;
                }
                #send-button {
                    width: 48px !important;
                    height: 48px !important;
                    font-size: 20px !important;
                    box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4) !important;
                }
                #messages-container {
                    padding: 16px !important;
                    padding-bottom: 100px !important;
                }
                
                /* Mejorar legibilidad en móviles */
                .message {
                    font-size: 15px !important;
                    line-height: 1.5 !important;
                    max-width: 85% !important;
                    padding: 14px 18px !important;
                    margin-bottom: 8px !important;
                }
            }
            
            /* Estilos cuando aparece el teclado - Mejorado */
            @media (max-width: 480px) {
                .keyboard-open #chat-window {
                    height: calc(100vh - 60px) !important;
                    bottom: 0 !important;
                    border-radius: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100vw !important;
                }
                
                .keyboard-open #input-container {
                    padding: 16px 20px 20px 20px !important;
                    min-height: 76px !important;
                    position: fixed !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    z-index: 100001 !important;
                    background: rgba(15, 23, 42, 1) !important;
                    backdrop-filter: blur(10px) !important;
                }
                
                .keyboard-open #messages-container {
                    padding-bottom: 140px !important; /* Espacio para el input fijo */
                }
            }
            
            /* Detección adicional de teclado virtual */
            @media (max-height: 500px) and (max-width: 480px) {
                #chat-window {
                    height: calc(100vh - 100px) !important;
                    bottom: 5px !important;
                    border-radius: 8px 8px 0 0 !important;
                }
                #input-container {
                    padding: 12px 16px 16px 16px !important;
                    min-height: 70px !important;
                    position: fixed !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    background: rgba(15, 23, 42, 1) !important;
                }
                #messages-container {
                    padding-bottom: 100px !important;
                }
            }
            
            /* Para dispositivos muy pequeños */
            @media (max-height: 400px) and (max-width: 480px) {
                #chat-window {
                    height: calc(100vh - 80px) !important;
                    bottom: 0 !important;
                    border-radius: 0 !important;
                }
                #input-container {
                    padding: 10px 16px 12px 16px !important;
                    min-height: 64px !important;
                }
            }

            /* Tablets pequeñas */
            @media (min-width: 481px) and (max-width: 768px) {
                #chat-window {
                    width: 420px !important;
                    max-width: calc(100vw - 40px) !important;
                }
            }

            /* Orientación horizontal en móviles */
            @media (max-width: 768px) and (orientation: landscape) {
                #chat-window {
                    height: 85vh !important;
                    max-height: calc(100vh - 60px) !important;
                }
                
                @media (max-height: 450px) {
                    #chat-window {
                        height: calc(100vh - 100px) !important;
                        bottom: 5px !important;
                    }
                }
            }
            
            /* Input focus states */
            #chat-input:focus {
                border-color: rgba(14, 165, 233, 0.8) !important;
                box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2) !important;
                background: rgba(30, 41, 59, 1) !important;
            }
            
            #send-button:hover, #send-button:active {
                transform: scale(0.95) !important;
                box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4) !important;
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
        const chatWindow = document.getElementById('chat-window');

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

        // Configurar manejo del teclado móvil
        this.setupMobileKeyboard(input, chatWindow);

        console.log('✅ Eventos configurados');
    }

    setupMobileKeyboard(input, chatWindow) {
        let initialViewportHeight = window.innerHeight;
        let initialWindowHeight = window.screen.height;
        let isKeyboardOpen = false;
        let keyboardTimeout;

        // Detectar cuando aparece/desaparece el teclado - Mejorado
        const handleViewportChange = () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            const percentageChange = heightDifference / initialViewportHeight;
            
            // Si la altura disminuyó más del 25%, el teclado está abierto
            if (percentageChange > 0.25 && !isKeyboardOpen) {
                isKeyboardOpen = true;
                document.body.classList.add('keyboard-open');
                this.adjustForKeyboard(chatWindow, true);
                console.log('🔧 Teclado detectado - Ajustando layout');
            } 
            // Si la altura volvió a más del 90% original, el teclado se cerró
            else if (percentageChange < 0.1 && isKeyboardOpen) {
                isKeyboardOpen = false;
                document.body.classList.remove('keyboard-open');
                this.adjustForKeyboard(chatWindow, false);
                console.log('🔧 Teclado cerrado - Restaurando layout');
            }
        };

        // Debounced viewport change handler
        const debouncedViewportChange = () => {
            clearTimeout(keyboardTimeout);
            keyboardTimeout = setTimeout(handleViewportChange, 100);
        };

        // Eventos para detectar cambios de viewport
        window.addEventListener('resize', debouncedViewportChange);
        
        // Para iOS y Android, también escuchar cambios de orientación
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                initialViewportHeight = window.innerHeight;
                initialWindowHeight = window.screen.height;
                handleViewportChange();
            }, 800); // Más tiempo para que se complete la rotación
        });

        // Focus del input - Manejo mejorado
        input.addEventListener('focus', () => {
            // Agregar clase de focus para estilos específicos
            document.body.classList.add('input-focused');
            
            // Para móviles, ajustar después de que aparezca el teclado
            if (window.innerWidth <= 480) {
                setTimeout(() => {
                    const currentHeight = window.innerHeight;
                    if (currentHeight < initialViewportHeight * 0.75) {
                        isKeyboardOpen = true;
                        document.body.classList.add('keyboard-open');
                        this.adjustForKeyboard(chatWindow, true);
                    }
                    
                    // Scroll al input después del ajuste
                    this.scrollToInput(input);
                }, 400); // Tiempo suficiente para que aparezca el teclado
            }
        });

        // Blur del input
        input.addEventListener('blur', () => {
            document.body.classList.remove('input-focused');
            
            // Delay para permitir que el usuario pueda tocar otros elementos
            setTimeout(() => {
                const currentHeight = window.innerHeight;
                if (currentHeight >= initialViewportHeight * 0.9 && isKeyboardOpen) {
                    isKeyboardOpen = false;
                    document.body.classList.remove('keyboard-open');
                    this.adjustForKeyboard(chatWindow, false);
                }
            }, 500);
        });

        // Detectar Visual Viewport API si está disponible (mejor para iOS)
        if (window.visualViewport) {
            const handleVisualViewportChange = () => {
                const viewportHeight = window.visualViewport.height;
                const heightDifference = initialViewportHeight - viewportHeight;
                const isKeyboard = heightDifference > 150;
                
                if (isKeyboard !== isKeyboardOpen) {
                    isKeyboardOpen = isKeyboard;
                    document.body.classList.toggle('keyboard-open', isKeyboard);
                    this.adjustForKeyboard(chatWindow, isKeyboard);
                }
            };
            
            window.visualViewport.addEventListener('resize', handleVisualViewportChange);
        }
    }

    // Nueva función para scroll suave al input
    scrollToInput(input) {
        if (window.innerWidth <= 480) {
            setTimeout(() => {
                // Scroll que mantiene el input visible pero no demasiado arriba
                const inputRect = input.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const targetPosition = window.pageYOffset + inputRect.top - (viewportHeight * 0.7);
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // También asegurar scroll dentro del contenedor de mensajes
                const messagesContainer = document.getElementById('messages-container');
                if (messagesContainer) {
                    setTimeout(() => {
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }, 300);
                }
            }, 200);
        }
    }

    adjustForKeyboard(chatWindow, keyboardOpen) {
        if (window.innerWidth <= 480) { // Solo en móviles
            const messagesContainer = document.getElementById('messages-container');
            const inputContainer = document.getElementById('input-container');
            const currentViewportHeight = window.innerHeight;
            
            if (keyboardOpen) {
                // Cuando aparece el teclado - Layout optimizado
                const keyboardHeight = Math.max(200, window.screen.height - currentViewportHeight);
                const availableHeight = currentViewportHeight - 60; // Margen de seguridad
                
                // Ajustar ventana del chat
                chatWindow.style.setProperty('height', `${availableHeight}px`, 'important');
                chatWindow.style.setProperty('bottom', '0px', 'important');
                chatWindow.style.setProperty('maxHeight', `${availableHeight}px`, 'important');
                chatWindow.style.setProperty('borderRadius', '8px 8px 0 0', 'important');
                chatWindow.style.setProperty('left', '0px', 'important');
                chatWindow.style.setProperty('right', '0px', 'important');
                chatWindow.style.setProperty('width', '100vw', 'important');
                
                // Fijar input container al bottom
                if (inputContainer) {
                    inputContainer.style.setProperty('position', 'fixed', 'important');
                    inputContainer.style.setProperty('bottom', '0px', 'important');
                    inputContainer.style.setProperty('left', '0px', 'important');
                    inputContainer.style.setProperty('right', '0px', 'important');
                    inputContainer.style.setProperty('zIndex', '100001', 'important');
                    inputContainer.style.setProperty('background', 'rgba(15, 23, 42, 1)', 'important');
                    inputContainer.style.setProperty('backdropFilter', 'blur(10px)', 'important');
                    inputContainer.style.setProperty('borderTop', '2px solid rgba(255, 255, 255, 0.15)', 'important');
                }
                
                // Ajustar contenedor de mensajes
                if (messagesContainer) {
                    const inputHeight = inputContainer ? inputContainer.offsetHeight : 80;
                    messagesContainer.style.setProperty('paddingBottom', `${inputHeight + 20}px`, 'important');
                    messagesContainer.style.setProperty('maxHeight', `${availableHeight - inputHeight - 60}px`, 'important');
                    
                    // Scroll suave al último mensaje
                    setTimeout(() => {
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }, 150);
                }
                
            } else {
                // Cuando se oculta el teclado - Restaurar layout normal
                chatWindow.style.setProperty('height', '75vh', 'important');
                chatWindow.style.setProperty('bottom', '80px', 'important');
                chatWindow.style.setProperty('maxHeight', 'calc(100vh - 120px)', 'important');
                chatWindow.style.setProperty('borderRadius', '20px 20px 0 0', 'important');
                chatWindow.style.setProperty('left', '0px', 'important');
                chatWindow.style.setProperty('right', '0px', 'important');
                chatWindow.style.setProperty('width', 'calc(100vw - 20px)', 'important');
                
                // Restaurar input container
                if (inputContainer) {
                    inputContainer.style.removeProperty('position');
                    inputContainer.style.removeProperty('bottom');
                    inputContainer.style.removeProperty('left');
                    inputContainer.style.removeProperty('right');
                    inputContainer.style.removeProperty('zIndex');
                    inputContainer.style.setProperty('background', 'rgba(15, 23, 42, 0.98)', 'important');
                    inputContainer.style.removeProperty('backdropFilter');
                    inputContainer.style.setProperty('borderTop', '1px solid rgba(255, 255, 255, 0.1)', 'important');
                }
                
                // Restaurar contenedor de mensajes
                if (messagesContainer) {
                    messagesContainer.style.setProperty('paddingBottom', '120px', 'important');
                    messagesContainer.style.removeProperty('maxHeight');
                }
            }
            
            // Log para debugging
            console.log(`🔧 Layout ajustado - Teclado: ${keyboardOpen ? 'Abierto' : 'Cerrado'}, Altura: ${currentViewportHeight}px`);
        }
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const notification = document.getElementById('notification-badge');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            // Animación de apertura
            chatWindow.classList.add('opening');
            chatWindow.style.display = 'flex';
            notification.style.display = 'none';
            this.isOpen = true;
            
            // Remover clase de animación después de completarse
            setTimeout(() => {
                chatWindow.classList.remove('opening');
            }, 300);
            
            // Focus en input con delay para móviles
            setTimeout(() => {
                const input = document.getElementById('chat-input');
                if (input && window.innerWidth <= 480) {
                    // En móviles, focus más suave para evitar problemas con el teclado
                    input.focus({ preventScroll: true });
                } else if (input) {
                    input.focus();
                }
            }, window.innerWidth <= 480 ? 500 : 300);
            
            // Log para debugging
            console.log('💬 Chat abierto - Dispositivo:', window.innerWidth <= 480 ? 'Móvil' : 'Desktop');
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        
        // Animación de cierre
        chatWindow.classList.add('closing');
        
        // Limpiar clases de teclado al cerrar
        document.body.classList.remove('keyboard-open', 'input-focused');
        
        setTimeout(() => {
            chatWindow.style.display = 'none';
            chatWindow.classList.remove('closing');
            this.isOpen = false;
            
            // Log para debugging
            console.log('💬 Chat cerrado');
        }, 300);
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('bot', '¡Hola! 👋 Soy tu asistente de BotEngine. Estoy aquí para ayudarte a mejorar tu negocio con automatización.\n\n¿Me permites hacerte unas preguntas rápidas?');
            
            setTimeout(() => {
                this.showQuickButtons([
                    { text: '✅ ¡Claro, adelante!', value: 'start' },
                    { text: '📞 Prefiero hablar con un agente', value: 'agent' }
                ]);
            }, 800);
        }, 1000);
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Mostrar mensaje del usuario
        this.addMessage('user', message);
        input.value = '';

        // Procesar mensaje según el flujo de conversación
        this.processUserResponse(message);
    }

    processUserResponse(message) {
        // Mostrar indicador de escritura
        this.showTyping();

        setTimeout(() => {
            this.hideTyping();
            const msg = message.toLowerCase();

            // Manejar solicitud de agente en cualquier momento
            if (msg.includes('agente') || msg.includes('humano') || msg.includes('persona') || msg.includes('vivo')) {
                this.contactAgent();
                return;
            }

            // Flujo de conversación
            switch(this.conversationStep) {
                case 0: // Mensaje inicial
                    if (msg.includes('claro') || msg.includes('sí') || msg.includes('si') || msg.includes('adelante') || msg.includes('start')) {
                        this.askBusinessType();
                    } else if (msg.includes('agent')) {
                        this.contactAgent();
                    } else {
                        this.askBusinessType(); // Por defecto continúa
                    }
                    break;

                case 1: // Pregunta tipo de negocio
                    this.userData.businessType = message;
                    this.askProducts();
                    break;

                case 2: // Pregunta productos/servicios
                    this.userData.products = message;
                    this.askInterest();
                    break;

                case 3: // Pregunta interés
                    this.userData.interest = message;
                    this.showRecommendation();
                    break;

                case 4: // Después de recomendación
                    if (msg.includes('sí') || msg.includes('si') || msg.includes('cotiza') || msg.includes('contacto')) {
                        this.showContactOptions();
                    } else if (msg.includes('precio') || msg.includes('costo')) {
                        this.showPricing();
                    } else {
                        this.showContactOptions();
                    }
                    break;

                default:
                    this.handleGeneralQuestion(message);
            }
        }, 1500);
    }

    askBusinessType() {
        this.conversationStep = 1;
        this.addMessage('bot', '¡Perfecto! 🎯\n\n¿Qué tipo de negocio tienes?');
        
        setTimeout(() => {
            this.showQuickButtons([
                { text: '🛍️ Tienda / E-commerce', value: 'tienda' },
                { text: '🍽️ Restaurante', value: 'restaurante' },
                { text: '💼 Servicios profesionales', value: 'servicios' },
                { text: '🏥 Salud / Belleza', value: 'salud' },
                { text: '📚 Educación', value: 'educacion' },
                { text: '✏️ Otro', value: 'otro' }
            ]);
        }, 800);
    }

    askProducts() {
        this.conversationStep = 2;
        this.addMessage('bot', `¡Excelente! Un negocio de ${this.userData.businessType} 👏\n\n¿Qué productos o servicios ofreces? (Ejemplo: ropa, comida, consultas, etc.)`);
    }

    askInterest() {
        this.conversationStep = 3;
        this.addMessage('bot', `Interesante, ${this.userData.products} suena genial 🌟\n\n¿Qué te gustaría automatizar o mejorar en tu negocio?`);
        
        setTimeout(() => {
            this.showQuickButtons([
                { text: '🤖 Automatizar respuestas', value: 'chatbot' },
                { text: '🌐 Crear sitio web', value: 'website' },
                { text: '📦 Catálogo digital', value: 'catalog' },
                { text: '📱 Presencia en redes', value: 'social' },
                { text: '💬 Todo lo anterior', value: 'all' }
            ]);
        }, 800);
    }

    showRecommendation() {
        this.conversationStep = 4;
        const interest = this.userData.interest.toLowerCase();
        
        let recommendation = '';
        
        if (interest.includes('chatbot') || interest.includes('respuesta') || interest.includes('autom')) {
            recommendation = `🤖 **Recomendación: Chatbot Inteligente**

Basado en tu negocio de ${this.userData.businessType} con ${this.userData.products}, un chatbot te ayudaría a:

✅ Responder preguntas frecuentes 24/7
✅ Tomar pedidos automáticamente
✅ Programar citas o reservas
✅ Enviar catálogos y precios
✅ Dar seguimiento a clientes

💰 **Desde Q1,500** - Listo en 1-2 semanas`;
        } else if (interest.includes('web') || interest.includes('sitio') || interest.includes('página')) {
            recommendation = `🌐 **Recomendación: Sitio Web Profesional**

Para tu negocio de ${this.userData.businessType} con ${this.userData.products}, un sitio web incluiría:

✅ Diseño moderno y atractivo
✅ Optimizado para celulares
✅ Catálogo de productos
✅ Formulario de contacto
✅ Integración con redes sociales
✅ SEO básico para Google

💰 **Desde Q1,500** - Listo en 1-2 semanas`;
        } else if (interest.includes('catálogo') || interest.includes('catalog')) {
            recommendation = `📦 **Recomendación: Catálogo Digital + Chatbot**

Perfecto para ${this.userData.businessType} con ${this.userData.products}:

✅ Catálogo web interactivo
✅ Chatbot que muestra productos
✅ Botón directo a WhatsApp
✅ Actualizaciones fáciles
✅ Compartible en redes

💰 **Desde Q2,500** - Listo en 2 semanas`;
        } else {
            recommendation = `🚀 **Recomendación: Paquete Completo**

Para impulsar tu negocio de ${this.userData.businessType} con ${this.userData.products}:

✅ Sitio web profesional
✅ Chatbot inteligente
✅ Catálogo de productos
✅ Integración con redes
✅ Sistema de mensajería
✅ Soporte técnico incluido

💰 **Desde Q4,500** - Solución integral`;
        }

        this.addMessage('bot', recommendation);
        
        setTimeout(() => {
            this.addMessage('bot', '¿Te gustaría recibir una cotización personalizada? 📊');
            setTimeout(() => {
                this.showQuickButtons([
                    { text: '✅ Sí, quiero cotización', value: 'cotiza' },
                    { text: '💬 Chatea en vivo con un agente', value: 'agent' },
                    { text: '💰 Ver todos los precios', value: 'precios' }
                ]);
            }, 800);
        }, 2000);
    }

    showContactOptions() {
        this.addMessage('bot', '¡Perfecto! 🎉\n\nPuedes contactarnos de las siguientes formas:');
        
        setTimeout(() => {
            this.showQuickButtons([
                { text: '📞 WhatsApp: +502-3123-9807', value: 'whatsapp', url: 'https://wa.me/50231239807?text=Hola,%20me%20interesa%20una%20cotización' },
                { text: '📝 Llenar formulario', value: 'form', url: '#demo' },
                { text: '📧 Email', value: 'email', url: 'mailto:contacto@botenginecorp.com' }
            ]);
        }, 1000);
    }

    showPricing() {
        this.addMessage('bot', `💰 **Nuestros Precios**

**CHATBOTS:**
• Básico: Q1,500 - Q2,500
• Intermedio: Q3,500 - Q5,000
• Avanzado: Q5,500 - Q7,000+

**PÁGINAS WEB:**
• Básica: Q1,500 - Q2,500
• Intermedia: Q3,500 - Q5,000
• Avanzada: Q6,000 - Q8,000+

**MANTENIMIENTO:**
• Mensual: Q200

¿Te interesa alguno en particular? 🎯`);
        
        setTimeout(() => {
            this.showQuickButtons([
                { text: '🤖 Chatbot', value: 'chatbot-info' },
                { text: '🌐 Página Web', value: 'web-info' },
                { text: '💬 Hablar con agente', value: 'agent' },
                { text: '📞 Solicitar cotización', value: 'cotiza' }
            ]);
        }, 1000);
    }

    contactAgent() {
        this.addMessage('bot', '¡Claro! Te conectaré con un agente humano 👨‍💼\n\nPuedes contactarnos directamente por:');
        
        setTimeout(() => {
            this.showQuickButtons([
                { text: '💬 WhatsApp Directo', value: 'whatsapp', url: 'https://wa.me/50231239807?text=Hola,%20necesito%20hablar%20con%20un%20agente' },
                { text: '📞 Llamar ahora', value: 'call', url: 'tel:+50231239807' },
                { text: '📝 Dejar mensaje', value: 'form', url: '#demo' }
            ], true);
        }, 1000);
    }

    handleGeneralQuestion(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('precio') || msg.includes('costo') || msg.includes('cuánto')) {
            this.showPricing();
        } else if (msg.includes('servicio') || msg.includes('qué hacen') || msg.includes('ofrecen')) {
            this.addMessage('bot', '🚀 **Nuestros Servicios:**\n\n• 🤖 Chatbots inteligentes\n• 🌐 Páginas web modernas\n• ⚙️ Automatización de procesos\n• 📱 Integración con redes sociales\n\n¿Cuál te interesa más?');
        } else if (msg.includes('contacto') || msg.includes('teléfono') || msg.includes('email')) {
            this.showContactOptions();
        } else {
            this.addMessage('bot', '🤖 Puedo ayudarte con:\n\n• Ver nuestros servicios\n• Conocer precios\n• Recibir recomendaciones\n• Contactar a un agente\n\n¿Qué te gustaría saber?');
        }
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
        messageDiv.className = 'message'; // Para estilos CSS
        container.appendChild(messageDiv);
        
        // Scroll suave mejorado para móviles
        setTimeout(() => {
            // Scroll suave al último mensaje
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
            
            // En móviles, manejar scroll y visibilidad del input
            if (window.innerWidth <= 480) {
                const input = document.getElementById('chat-input');
                const isKeyboardOpen = document.body.classList.contains('keyboard-open');
                
                // Si el teclado está abierto y el input tiene focus
                if (input && document.activeElement === input && isKeyboardOpen) {
                    // Usar scrollIntoView con opciones más suaves
                    setTimeout(() => {
                        this.scrollToInput(input);
                    }, 200);
                }
                
                // Asegurar que el nuevo mensaje sea visible
                if (messageDiv) {
                    setTimeout(() => {
                        messageDiv.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest',
                            inline: 'nearest'
                        });
                    }, 300);
                }
            }
        }, 100);

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

    showQuickButtons(buttons, isLink = false) {
        const container = document.getElementById('messages-container');
        const buttonsDiv = document.createElement('div');
        
        buttonsDiv.className = 'quick-buttons';
        buttonsDiv.style.cssText = `
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            margin: 8px 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
        `;

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button.text;
            btn.style.cssText = `
                background: rgba(14, 165, 233, 0.15) !important;
                color: #0ea5e9 !important;
                border: 1px solid rgba(14, 165, 233, 0.3) !important;
                padding: 10px 16px !important;
                border-radius: 20px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                transition: all 0.2s ease !important;
                white-space: nowrap !important;
                flex: 0 1 auto !important;
                font-weight: 500 !important;
            `;

            // Hover effect - usando addEventListener en lugar de inline handlers
            btn.addEventListener('mouseover', () => {
                btn.style.background = 'rgba(14, 165, 233, 0.25)';
                btn.style.borderColor = 'rgba(14, 165, 233, 0.5)';
                btn.style.transform = 'scale(1.05)';
            });
            
            btn.addEventListener('mouseout', () => {
                btn.style.background = 'rgba(14, 165, 233, 0.15)';
                btn.style.borderColor = 'rgba(14, 165, 233, 0.3)';
                btn.style.transform = 'scale(1)';
            });

            btn.addEventListener('click', () => {
                // Si tiene URL, abrir en nueva pestaña
                if (button.url) {
                    if (button.url.startsWith('http') || button.url.startsWith('tel:') || button.url.startsWith('mailto:')) {
                        window.open(button.url, '_blank');
                        this.addMessage('user', button.text);
                        setTimeout(() => {
                            this.addMessage('bot', '✅ Perfecto, te he redirigido. Si tienes alguna otra pregunta, estoy aquí para ayudarte. 😊');
                        }, 1000);
                    } else {
                        // Es un anchor interno
                        this.addMessage('user', button.text);
                        setTimeout(() => {
                            document.querySelector(button.url)?.scrollIntoView({ behavior: 'smooth' });
                            this.addMessage('bot', '✅ Te he llevado a la sección correspondiente. ¿Necesitas algo más? 😊');
                        }, 500);
                    }
                } else {
                    // Procesar como respuesta normal
                    this.addMessage('user', button.text);
                    this.processUserResponse(button.value);
                }
                
                // Remover botones después de hacer clic
                buttonsDiv.remove();
            });

            buttonsDiv.appendChild(btn);
        });

        container.appendChild(buttonsDiv);
        
        // Scroll al final
        setTimeout(() => {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
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